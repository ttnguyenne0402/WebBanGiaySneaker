/**
 * checkout.js - Xử lý trang thanh toán (checkout.html)
 * 
 * Nội dung:
 * - Hiển thị giỏ hàng tóm tắt
 * - Quản lý địa chỉ nhận hàng (từ sổ địa chỉ của user)
 * - Tích điểm / sử dụng điểm giảm giá (1 điểm = 1đ)
 * - Tính phí vận chuyển theo phương thức
 * - Xử lý thanh toán (COD, thẻ)
 * - Lưu đơn hàng, trừ điểm, cộng điểm
 */

// =========== 1. TRẠNG THÁI TOÀN CỤC ===========
const checkoutState = {
    cart: [],
    usePoints: false,
    usedPoints: 0
};

// Tỷ lệ tích điểm: 1% giá trị đơn hàng (có thể điều chỉnh)
const REWARD_RATE = 0.01;

const checkoutElements = {};

// =========== 2. KHỞI TẠO ===========
document.addEventListener("DOMContentLoaded", initCheckout);

function initCheckout() {
    cacheCheckoutElements();
    checkoutState.cart = readCart();
    console.log("Giỏ hàng lấy được từ localStorage:", checkoutState.cart);

    renderCheckoutBreadcrumb();
    updateLoginState();

    loadAddresses();
    bindCheckoutEvents();
    renderCheckout();
}

// =========== 3. CÁC HÀM HỖ TRỢ ===========

function cacheCheckoutElements() {
    checkoutElements.form = document.getElementById("checkoutForm");
    checkoutElements.cartItems = document.getElementById("cartItems");
    checkoutElements.subtotalValue = document.getElementById("subtotalValue");
    checkoutElements.discountValue = document.getElementById("discountValue");
    checkoutElements.shippingValue = document.getElementById("shippingValue");
    checkoutElements.totalValue = document.getElementById("totalValue");
    checkoutElements.submitOrderBtn = document.getElementById("submitOrderBtn");

    checkoutElements.addressSelect = document.getElementById("addressSelect");
    checkoutElements.cardFields = document.getElementById("cardFields");
    checkoutElements.cardNumber = document.getElementById("cardNumber");
    checkoutElements.cardExpiry = document.getElementById("cardExpiry");
    checkoutElements.cardCvv = document.getElementById("cardCvv");
    checkoutElements.orderCode = document.getElementById("orderCode");
    checkoutElements.toast = document.getElementById("checkoutToast");
    checkoutElements.searchForm = document.querySelector(".search-form");

    checkoutElements.pointDiscountValue = document.getElementById("pointDiscountValue");
    checkoutElements.usePointSwitch = document.getElementById("usePointSwitch");
    checkoutElements.availablePointText = document.getElementById("availablePointText");
    checkoutElements.pointMoneyText = document.getElementById("pointMoneyText");
}

// =========== 4. ĐỊA CHỈ ===========

function loadAddresses() {
    const addresses = JSON.parse(localStorage.getItem(getAddressStorageKey())) || [];
    const select = checkoutElements.addressSelect;
    if (!select) return;

    if (addresses.length === 0) {
        select.innerHTML = `<option value="">Bạn chưa lưu địa chỉ nào. Vui lòng cập nhật sổ địa chỉ.</option>`;
        return;
    }

    let html = "";
    addresses.forEach((addr) => {
        const isSelected = addr.isDefault ? "selected" : "";
        const typeLabel = addr.type ? `[${addr.type}] ` : "";
        const displayText = `${typeLabel}${addr.name} - ${addr.phone} - ${addr.detail}, ${addr.region}`;
        html += `<option value="${addr.id}" ${isSelected}>${displayText}</option>`;
    });
    select.innerHTML = html;
}

function getAddressStorageKey() {
    return getScopedStorageKey("tht_user_addresses");
}

function getScopedStorageKey(baseKey) {
    const user = getCurrentUserFromSession();
    return user?.ma ? `${baseKey}_${user.ma}` : baseKey;
}

function getCurrentUserFromSession() {
    if (typeof nguoiDungHienTai !== "undefined" && nguoiDungHienTai) {
        return nguoiDungHienTai;
    }
    try {
        const stored = localStorage.getItem("soleStyleNguoiDung");
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
}

// =========== 5. ĐIỂM THƯỞNG ===========

function getRewardHistory() {
    return JSON.parse(localStorage.getItem(getScopedStorageKey("rewardHistory"))) || [];
}

function getAvailablePoints() {
    const history = getRewardHistory();
    const total = history.reduce((sum, item) => {
        if (item.type === "earn") return sum + Number(item.point || 0);
        if (item.type === "used") return sum - Number(item.point || 0);
        return sum;
    }, 0);
    return Math.max(0, total);
}

function useRewardPoint(point, orderCode) {
    if (point <= 0) return;
    const history = getRewardHistory();
    history.unshift({
        id: Date.now(),
        type: "used",
        title: "Sử dụng điểm thưởng",
        description: `Đơn hàng #${orderCode}`,
        point: point,
        date: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem(getScopedStorageKey("rewardHistory"), JSON.stringify(history));
}

// 🔧 ĐÃ SỬA: tích điểm theo tỷ lệ REWARD_RATE
function addRewardPoint(orderCode, totalMoney) {
    const history = getRewardHistory();
    const point = Math.floor(totalMoney * REWARD_RATE);
    if (point <= 0) return; // không tích điểm nếu số tiền quá nhỏ
    history.unshift({
        id: Date.now(),
        type: "earn",
        title: "Tích điểm từ đơn hàng",
        description: `Đơn hàng #${orderCode}`,
        point,
        date: new Date().toLocaleString("vi-VN")
    });
    localStorage.setItem(getScopedStorageKey("rewardHistory"), JSON.stringify(history));
}

// =========== 6. GIỎ HÀNG & TÍNH TOÁN ===========

function readCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(getCartKey())) || [];
        return Array.isArray(cart) ? cart.map(normalizeCartItem) : [];
    } catch {
        return [];
    }
}

function getCartKey() {
    return typeof khoaLuuTru !== "undefined" ? khoaLuuTru.gioHang : "soleStyleGioHang";
}

function normalizeCartItem(item) {
    const quantity = Math.max(1, Number(item.quantity ?? item.soLuong ?? 1));
    return {
        ...item,
        id: item.id ?? item.maSanPham ?? "",
        name: item.name ?? item.ten ?? "Sản phẩm",
        image: item.image ?? item.anh ?? "",
        price: item.price ?? item.gia ?? 0,
        quantity,
        color: item.color ?? item.mauSac ?? "",
        storage: item.storage ?? item.kichThuoc ?? "",
        detailUrl: item.detailUrl ?? (item.maSanPham ? `./product-detail.html?id=${encodeURIComponent(item.maSanPham)}` : "")
    };
}

function saveCart() {
    localStorage.setItem(getCartKey(), JSON.stringify(checkoutState.cart.map(prepareCartItemForStorage)));
    updateCartCount();
}

function prepareCartItemForStorage(item) {
    return {
        ...item,
        soLuong: item.quantity,
        ten: item.name,
        anh: item.image,
        gia: item.price,
        mauSac: item.color,
        kichThuoc: item.storage,
        maSanPham: item.id
    };
}

function getSubtotal() {
    return checkoutState.cart.reduce((sum, item) => sum + normalizePrice(item.price) * Number(item.quantity || 1), 0);
}

function normalizePrice(value) {
    let number = Number(String(value ?? 0).replace(/,/g, ""));
    if (!Number.isFinite(number)) number = 0;
    return number;
}

function getShippingFee(subtotal) {
    const checkedMethod = document.querySelector("[name='shippingMethod']:checked");
    const method = checkedMethod?.value || "standard";

    if (method === "standard") {
        return subtotal <= 5000000 ? 0 : subtotal * 0.001;
    } else if (method === "express") {
        if (subtotal < 100000) return subtotal * 0.2;
        if (subtotal < 500000) return subtotal * 0.1;
        if (subtotal < 1000000) return subtotal * 0.05;
        if (subtotal <= 5000000) return subtotal * 0.004;
        return subtotal * 0.003;
    } else if (method === "pickup") {
        return 0;
    }
    return 0;
}

function renderSummary() {
    const subtotal = getSubtotal();
    const shippingFee = getShippingFee(subtotal);
    const availablePoints = getAvailablePoints();
    const maxPointMoney = availablePoints;               // 1 điểm = 1đ
    const maxAllowed = Math.max(0, subtotal + shippingFee);
    const pointDiscount = checkoutState.usePoints ? Math.min(maxPointMoney, maxAllowed) : 0;
    const finalPointDiscount = Math.floor(pointDiscount);
    checkoutState.usedPoints = finalPointDiscount;

    const total = Math.max(subtotal + shippingFee - finalPointDiscount, 0);

    setText(checkoutElements.subtotalValue, money(subtotal));
    setText(checkoutElements.discountValue, "0đ");
    setText(checkoutElements.pointDiscountValue, finalPointDiscount ? `- ${money(finalPointDiscount)}` : "0đ");
    setText(checkoutElements.shippingValue, shippingFee ? money(shippingFee) : "Miễn phí");
    setText(checkoutElements.totalValue, money(total));
    setText(checkoutElements.availablePointText, availablePoints.toLocaleString("vi-VN"));
    setText(checkoutElements.pointMoneyText, `[- ${money(availablePoints)}]`);
}

function money(value) {
    return new Intl.NumberFormat("vi-VN").format(normalizePrice(value)) + " đ";
}

function setText(element, value) {
    if (element) element.textContent = value;
}

// =========== 7. RENDER CHECKOUT ===========

function renderCheckout() {
    renderCartItems();
    setText(checkoutElements.availablePointText, getAvailablePoints());
    renderSummary();
    updateCartCount();
}

function renderCartItems() {
    if (!checkoutElements.cartItems) return;

    if (!checkoutState.cart.length) {
        checkoutElements.cartItems.innerHTML = `
            <div class="cart-empty border p-4 text-center rounded-4">
                <i class="bi bi-bag fs-1 text-secondary"></i>
                <h3 class="mt-3 fs-5">Giỏ hàng đang trống</h3>
                <p class="text-muted">Chọn sản phẩm trước khi thanh toán.</p>
                <a class="btn btn-outline-dark mt-2" href="./index.html#featured">Xem sản phẩm</a>
            </div>
        `;
        checkoutElements.submitOrderBtn.disabled = true;
        return;
    }

    checkoutElements.submitOrderBtn.disabled = false;
    checkoutElements.cartItems.innerHTML = checkoutState.cart.map((item, index) => buildCartItem(item, index)).join("");
}

function buildCartItem(item, index) {
    const itemMeta = [item.color, item.storage].filter(Boolean).join(" / ");
    return `
        <article class="cart-item border-0 border-bottom rounded-0 mb-2 pb-3">
            <div class="cart-item-img border rounded">
                ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">` : `<i class="bi bi-phone"></i>`}
            </div>
            <div class="cart-item-info">
                <h3 class="fs-6">
                    <a href="${escapeHtml(item.detailUrl || `./product-detail.html?id=${item.id}`)}" class="text-dark text-decoration-none">
                        ${escapeHtml(item.name || "Sản phẩm")}
                    </a>
                </h3>
                <p class="text-muted small mb-2">${escapeHtml(itemMeta || "Phiên bản tiêu chuẩn")}</p>
                <div class="cart-item-bottom">
                    <strong class="cart-item-price text-danger">${money(item.price)}</strong>
                    <div class="d-flex align-items-center gap-2">
                        <div class="qty-control border rounded px-1">
                            <button type="button" data-cart-action="decrease" data-cart-index="${index}"><i class="bi bi-dash"></i></button>
                            <span class="px-2">${Number(item.quantity || 1)}</span>
                            <button type="button" data-cart-action="increase" data-cart-index="${index}"><i class="bi bi-plus"></i></button>
                        </div>
                        <button class="btn btn-sm btn-light text-danger remove-item p-1 px-2" type="button" data-cart-action="remove" data-cart-index="${index}"><i class="bi bi-trash"></i></button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function handleCartAction(event) {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    const index = Number(button.dataset.cartIndex);
    const item = checkoutState.cart[index];
    if (!item) return;

    if (button.dataset.cartAction === "increase") {
        item.quantity = Number(item.quantity || 1) + 1;
    }
    if (button.dataset.cartAction === "decrease") {
        item.quantity = Math.max(1, Number(item.quantity || 1) - 1);
    }
    if (button.dataset.cartAction === "remove") {
        checkoutState.cart.splice(index, 1);
    }

    saveCart();
    renderCheckout();
}

function updateCartCount() {
    const totalQuantity = checkoutState.cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    document.querySelectorAll("[data-cart-count], #so-luong-gio-hang").forEach((badge) => {
        badge.textContent = totalQuantity;
    });
}

// =========== 8. THANH TOÁN ===========

function bindCheckoutEvents() {
    checkoutElements.cartItems?.addEventListener("click", handleCartAction);
    checkoutElements.form?.addEventListener("submit", submitOrder);
    checkoutElements.searchForm?.addEventListener("submit", handleSearchSubmit);

    document.querySelectorAll("[name='shippingMethod']").forEach((input) => {
        input.addEventListener("change", renderSummary);
    });

    document.querySelectorAll("[name='paymentMethod']").forEach((input) => {
        input.addEventListener("change", togglePaymentFields);
    });

    checkoutElements.cardNumber?.addEventListener("input", formatCardNumber);
    checkoutElements.cardExpiry?.addEventListener("input", formatCardExpiry);
    togglePaymentFields();

    checkoutElements.usePointSwitch?.addEventListener("change", function () {
        checkoutState.usePoints = this.checked;
        renderSummary();
    });
}

function handleSearchSubmit(event) {
    event.preventDefault();
    const input = checkoutElements.searchForm?.querySelector("input");
    const query = input?.value.trim();
    window.location.href = query ? `./index.html#featured` : "./index.html#featured";
}

function togglePaymentFields() {
    const paymentMethod = document.querySelector("[name='paymentMethod']:checked")?.value || "cod";
    const showCardFields = paymentMethod === "card";
    checkoutElements.cardFields?.classList.toggle("d-none", !showCardFields);
}

function formatCardNumber(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
    event.target.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatCardExpiry(event) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
    event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function submitOrder(event) {
    event.preventDefault();

    if (!checkoutState.cart.length) {
        showToast("Giỏ hàng đang trống.", "error");
        return;
    }

    if (!checkoutElements.addressSelect.value) {
        showToast("Vui lòng chọn hoặc thêm địa chỉ nhận hàng.", "error");
        checkoutElements.addressSelect.focus();
        return;
    }

    if (!isPaymentValid()) {
        showToast("Vui lòng kiểm tra thông tin thẻ.", "error");
        return;
    }

    const totals = getOrderTotals();
    const order = buildOrder(totals);
    saveOrder(order);

    // Trừ điểm: 1 điểm = 1đ, nên số điểm trừ = số tiền usedPoints
    if (checkoutState.usedPoints > 0) {
        useRewardPoint(checkoutState.usedPoints, order.code);
    }

    // Xóa giỏ hàng
    checkoutState.cart = [];
    saveCart();
    renderCheckout();

    checkoutElements.form.reset();

    if (checkoutElements.orderCode) checkoutElements.orderCode.textContent = order.code;
    showOrderSuccessModal();
}

function isPaymentValid() {
    const paymentMethod = document.querySelector("[name='paymentMethod']:checked")?.value || "cod";
    if (paymentMethod !== "card") return true;

    const cardNumber = checkoutElements.cardNumber?.value.replace(/\D/g, "") || "";
    const cardExpiry = checkoutElements.cardExpiry?.value || "";
    const cardCvv = checkoutElements.cardCvv?.value.replace(/\D/g, "") || "";

    if (cardNumber.length < 12) {
        checkoutElements.cardNumber?.focus();
        return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        checkoutElements.cardExpiry?.focus();
        return false;
    }
    if (cardCvv.length < 3) {
        checkoutElements.cardCvv?.focus();
        return false;
    }
    return true;
}

function getOrderTotals() {
    const subtotal = getSubtotal();
    const shippingFee = getShippingFee(subtotal);
    const pointDiscount = checkoutState.usedPoints;
    return {
        subtotal,
        shippingFee,
        discount: 0,
        pointDiscount,
        total: Math.max(subtotal + shippingFee - pointDiscount, 0)
    };
}

function buildOrder(totals) {
    const formData = new FormData(checkoutElements.form);

    const addressId = formData.get("customerAddressId");
    const addresses = JSON.parse(localStorage.getItem(getAddressStorageKey())) || [];
    const selectedAddress = addresses.find((a) => String(a.id) === String(addressId)) || {};
    const user = getCurrentUserFromSession();
    const code = createOrderCode();
    const createdAt = new Date().toISOString();
    const note = formData.get("orderNote") || "";
    const orderItems = checkoutState.cart.map(prepareCartItemForStorage);

    const customerInfo = {
        hoTen: selectedAddress.name || user?.hoTen || "",
        dienThoai: selectedAddress.phone || user?.dienThoai || "",
        diaChi: selectedAddress.detail || "",
        tinhThanh: selectedAddress.region || "",
        ghiChu: note
    };

    return {
        ma: code,
        code,
        maNguoiDung: user?.ma || null,
        ngayTao: createdAt,
        createdAt,
        trangThai: "Đã tiếp nhận",
        khachHang: customerInfo,
        status: "completed",
        customer: {
            addressData: selectedAddress,
            note
        },
        shippingMethod: formData.get("shippingMethod"),
        paymentMethod: formData.get("paymentMethod"),
        cachThanhToan: formData.get("paymentMethod"),
        sanPham: orderItems,
        items: orderItems,
        tamTinh: totals.subtotal,
        phiVanChuyen: totals.shippingFee,
        tongTien: totals.total,
        totals
    };
}

function createOrderCode() {
    const timestamp = Date.now().toString().slice(-6);
    const randomPart = Math.floor(Math.random() * 900 + 100);
    return `SS${timestamp}${randomPart}`;
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem(getOrderKey())) || [];
    orders.unshift(order);
    localStorage.setItem(getOrderKey(), JSON.stringify(orders));
    // Gọi cộng điểm với tổng tiền thực tế (đã trừ điểm)
    addRewardPoint(order.code, order.totals.total);
}

function getOrderKey() {
    return typeof khoaLuuTru !== "undefined" ? khoaLuuTru.donHang : "soleStyleDonHang";
}

function showOrderSuccessModal() {
    const modalElement = document.getElementById("orderSuccessModal");
    if (!window.bootstrap || !modalElement) {
        showToast("Đặt hàng thành công.");
        return;
    }
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
}

function showToast(message, type = "success") {
    if (!checkoutElements.toast) return;
    const icon = type === "error" ? "bi-exclamation-circle-fill" : "bi-check-circle-fill";
    const toast = document.createElement("div");
    toast.className = `checkout-toast-message ${type} shadow-sm border`;
    toast.innerHTML = `<i class="bi ${icon}"></i><span>${escapeHtml(message)}</span>`;
    checkoutElements.toast.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2800);
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========== 9. CẬP NHẬT TRẠNG THÁI HEADER ===========

function updateLoginState() {
    const userName = sessionStorage.getItem("user_name");
    document.querySelectorAll(".header-account-chip").forEach((accountLink) => {
        const span = accountLink.querySelector("span");
        const isMobile = accountLink.closest(".d-xl-none") !== null;

        if (userName) {
            if (span) {
                span.textContent = userName;
                if (isMobile) span.style.display = "inline";
            }
            accountLink.removeAttribute("href");
            accountLink.style.cursor = "pointer";
            accountLink.onclick = (e) => {
                e.preventDefault();
                window.location.href = "./profile.html";
            };
        } else {
            if (span) {
                span.textContent = "Đăng Nhập";
                if (isMobile) span.style.display = "none";
            }
            accountLink.setAttribute("href", "./login.html");
            accountLink.onclick = null;
        }
    });
}

// =========== 10. BREADCRUMB ===========

function renderCheckoutBreadcrumb() {
    const fromDetail = JSON.parse(localStorage.getItem("checkout_from_detail") || "null");
    const bcCategory = document.getElementById("checkoutBcCategory");
    const bcBrand = document.getElementById("checkoutBcBrand");
    const bcBrandIcon = document.getElementById("checkoutBcBrandIcon");
    const bcProduct = document.getElementById("checkoutBcProduct");
    const bcProductIcon = document.getElementById("checkoutBcProductIcon");
    const bcCart = document.getElementById("checkoutBcCart");
    const bcCartIcon = document.getElementById("checkoutBcCartIcon");

    if (!bcCategory || !bcCart) return;

    bcBrand?.classList.add("d-none");
    bcBrandIcon?.classList.add("d-none");
    bcProduct?.classList.add("d-none");
    bcProductIcon?.classList.add("d-none");
    bcCart?.classList.remove("d-none");
    bcCartIcon?.classList.remove("d-none");

    if (fromDetail) {
        bcCategory.textContent = fromDetail.categoryName || "Sản phẩm";
        bcCategory.href = fromDetail.categoryUrl || "./index.html#featured";
        if (fromDetail.brandName && fromDetail.brandUrl) {
            bcBrand.textContent = fromDetail.brandName;
            bcBrand.href = fromDetail.brandUrl;
            bcBrand.classList.remove("d-none");
            bcBrandIcon.classList.remove("d-none");
        }
        if (fromDetail.productName && fromDetail.productUrl) {
            bcProduct.textContent = fromDetail.productName;
            bcProduct.href = fromDetail.productUrl;
            bcProduct.classList.remove("d-none");
            bcProductIcon.classList.remove("d-none");
        }
        bcCart.classList.add("d-none");
        bcCartIcon.classList.add("d-none");
        return;
    }

    bcCategory.textContent = "Sản phẩm";
    bcCategory.href = "./index.html#featured";
}

// =========== 11. HÀM TIỆN ÍCH CHUNG ===========

function getCurrentUser() {
    return getCurrentUserFromSession();
}