/**
 * profile.js - Xử lý trang hồ sơ cá nhân (profile.html)
 * 
 * Nội dung chính:
 * - Kiểm tra đăng nhập, nếu chưa đăng nhập -> chuyển đến login
 * - Hiển thị thông tin user (tên, avatar, email)
 * - Quản lý các tab (Tổng quan, Đơn hàng, Địa chỉ, Điểm thưởng, Thông báo)
 * - Quản lý sổ địa chỉ (CRUD, đặt mặc định)
 * - Xem lịch sử đơn hàng theo trạng thái
 * - Xem lịch sử điểm thưởng (tích lũy / sử dụng)
 * - Thông báo từ file JSON
 * - Đăng xuất (modal xác nhận)
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. KIỂM TRA ĐĂNG NHẬP
    // ==========================================
    function getCurrentUserFromSession() {
        if (typeof nguoiDungHienTai !== "undefined" && nguoiDungHienTai) {
            return nguoiDungHienTai;
        }
        try {
            const stored = localStorage.getItem("soleStyleNguoiDung");
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    }

    const currentUser = getCurrentUserFromSession();
    const userName = currentUser?.hoTen || currentUser?.name || sessionStorage.getItem("user_name") || currentUser?.email;

    // Nếu chưa đăng nhập, chuyển về login
    if (!currentUser) {
        window.location.href = "./login.html";
        return;
    }

    // ==========================================
    // 2. HIỂN THỊ THÔNG TIN USER
    // ==========================================
    const nameElement = document.getElementById("profileName");
    if (nameElement) nameElement.textContent = userName;

    const avatarImg = document.getElementById("profileAvatarImg");
    if (avatarImg && userName) {
        const firstLetter = userName.charAt(0).toUpperCase();
        avatarImg.src = `https://placehold.co/100x100/ffedd5/ff7a18?text=${firstLetter}`;
    }

    if (currentUser) {
        const emailElement = document.getElementById("profileEmail");
        if (emailElement) emailElement.textContent = currentUser.email || currentUser.account || "";
    }

    // ==========================================
    // 3. XỬ LÝ ĐĂNG XUẤT (Modal tùy chỉnh)
    // ==========================================
    const logoutBtn = document.getElementById("logoutBtn");
    const logoutModal = document.getElementById("logoutModalOverlay");
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
    const closeModalIcon = document.getElementById("closeModalIcon");
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

    if (logoutBtn && logoutModal) {
        const closeModal = () => logoutModal.classList.remove("show");

        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logoutModal.classList.add("show");
        });

        if (cancelLogoutBtn) cancelLogoutBtn.addEventListener("click", closeModal);
        if (closeModalIcon) closeModalIcon.addEventListener("click", closeModal);
        logoutModal.addEventListener("click", (e) => {
            if (e.target === logoutModal) closeModal();
        });

        if (confirmLogoutBtn) {
            confirmLogoutBtn.addEventListener("click", () => {
                // Gọi hàm đăng xuất (nếu có trong common) hoặc tự xóa localStorage
                if (typeof dangXuatTaiKhoan === "function") {
                    dangXuatTaiKhoan();
                    window.location.href = "./index.html";
                    return;
                }
                localStorage.removeItem("soleStyleNguoiDung");
                window.location.href = "./index.html";
            });
        }
    }

    // ==========================================
    // 4. CHUYỂN TAB CHÍNH
    // ==========================================
    const navItems = document.querySelectorAll(".nav-item[data-target]");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const triggerLinks = document.querySelectorAll(".nav-trigger");
    const contentScrollArea = document.querySelector(".content-scroll-area");

    function switchTab(targetId) {
        tabPanes.forEach((pane) => pane.classList.remove("active"));
        navItems.forEach((item) => item.classList.remove("active"));

        const targetPane = document.querySelector(targetId);
        if (targetPane) targetPane.classList.add("active");

        const targetNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (targetNav) targetNav.classList.add("active");
    }

    function scrollToContent() {
        if (window.innerWidth < 992) {
            if (contentScrollArea) {
                contentScrollArea.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        } else {
            if (contentScrollArea) {
                contentScrollArea.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    }

    navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = item.getAttribute("data-target");
            if (targetId) {
                switchTab(targetId);
                scrollToContent();
            }
        });
    });

    triggerLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("data-trigger");
            const subTargetId = link.getAttribute("data-sub-target");

            if (targetId) {
                switchTab(targetId);
                if (subTargetId) {
                    const subTabBtn = document.querySelector(`.fpt-tab-item[data-target-pane="${subTargetId}"]`);
                    if (subTabBtn) subTabBtn.click();
                }
                scrollToContent();
            }
        });
    });

    // ==========================================
    // 5. XỬ LÝ TAB CON (Đơn hàng, Điểm thưởng)
    // ==========================================
    const fptTabs = document.querySelectorAll(".fpt-tab-item");
    fptTabs.forEach((tab) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();
            const parentWrapper = this.closest(".fpt-tabs");
            if (parentWrapper) {
                parentWrapper.querySelectorAll(".fpt-tab-item").forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");

                const targetSelector = this.getAttribute("data-target-pane") || this.getAttribute("data-order-target");
                if (targetSelector) {
                    const panesContainer = this.closest(".content-block").querySelector(".fpt-panes-container") || this.closest(".content-block").querySelector(".order-panes-container");
                    if (panesContainer) {
                        panesContainer.querySelectorAll(".fpt-pane, .order-pane").forEach((pane) => pane.classList.remove("active"));
                        const targetPane = panesContainer.querySelector(targetSelector);
                        if (targetPane) targetPane.classList.add("active");
                    }
                }
            }
        });
    });

    // ==========================================
    // 6. ĐIỂM THƯỞNG
    // ==========================================
    function getScopedStorageKey(baseKey) {
        const user = getCurrentUserFromSession();
        return user?.ma ? `${baseKey}_${user.ma}` : baseKey;
    }

    function getRewardHistory() {
        return JSON.parse(localStorage.getItem(getScopedStorageKey("rewardHistory"))) || [];
    }

    function getAvailablePoints() {
        const history = getRewardHistory();
        return history.reduce((total, item) => {
            if (item.type === "earn") return total + Number(item.point || 0);
            if (item.type === "used") return total - Number(item.point || 0);
            return total;
        }, 0);
    }

    function renderAvailablePoints() {
        const pointNumber = document.querySelector(".points-card h3");
        if (pointNumber) {
            pointNumber.textContent = getAvailablePoints().toLocaleString("vi-VN");
        }
    }

    function renderRewardHistory(filter = "all") {
        const history = getRewardHistory();
        const filteredHistory = filter === "all" ? history :
            filter === "earn" ? history.filter((item) => item.type === "earn") :
                history.filter((item) => item.type === "used");

        const paneId = filter === "earn" ? "point-earned" : filter === "used" ? "point-used" : "point-all";
        const pane = document.getElementById(paneId);
        if (!pane) return;

        if (filteredHistory.length === 0) {
            pane.innerHTML = `
                <div class="empty-state py-5 border-0 bg-transparent text-center">
                    <i class="bi ${filter === "used" ? "bi-dash-circle-dotted" : "bi-clock-history"} text-muted opacity-50" style="font-size: 4rem"></i>
                    <h5 class="mt-3 text-dark fw-bold">
                        ${filter === "used" ? "Chưa có lịch sử sử dụng điểm" : filter === "earn" ? "Chưa có lịch sử tích điểm" : "Chưa có lịch sử điểm"}
                    </h5>
                </div>
            `;
            return;
        }

        pane.innerHTML = filteredHistory.map((item) => {
            const isEarn = item.type === "earn";
            return `
                <div class="reward-item">
                    <div class="reward-info">
                        <h4>${item.title}</h4>
                        <p>${item.description}</p>
                        <p>${item.date}</p>
                    </div>
                    <div class="reward-point ${isEarn ? "plus" : "minus"}">
                        ${isEarn ? "+" : "-"}${Number(item.point || 0).toLocaleString("vi-VN")}
                    </div>
                </div>
            `;
        }).join("");
    }

    // Gán sự kiện cho các tab điểm thưởng
    document.querySelector('[data-target-pane="#point-all"]')?.addEventListener("click", () => renderRewardHistory("all"));
    document.querySelector('[data-target-pane="#point-earned"]')?.addEventListener("click", () => renderRewardHistory("earn"));
    document.querySelector('[data-target-pane="#point-used"]')?.addEventListener("click", () => renderRewardHistory("used"));

    // ==========================================
    // 7. THÔNG BÁO (load từ JSON)
    // ==========================================
    async function fetchNotifications() {
        try {
            const response = await fetch("./assets/json/notifications.json");
            if (!response.ok) throw new Error("Không thể tải file JSON");
            const data = await response.json();

            const notifContainer = document.getElementById("notificationListContainer");
            if (notifContainer) {
                let htmlContent = "";
                data.forEach((item) => {
                    const displayClass = item.isExtra ? "extra-notif d-none" : "";
                    htmlContent += `
                        <div class="notification-item ${displayClass} p-3 mb-3 border rounded d-flex align-items-start gap-3">
                            <div class="notification-icon-wrap bg-${item.theme}-subtle text-${item.theme} rounded-circle">
                                <i class="bi ${item.icon} fs-5"></i>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <h6 class="fw-bold mb-0 text-dark">${item.title}</h6>
                                    <span class="small text-muted">${item.time}</span>
                                </div>
                                <p class="mb-0 text-secondary small">${item.desc}</p>
                            </div>
                        </div>
                    `;
                });
                notifContainer.innerHTML = htmlContent;
            }
        } catch (error) {
            console.error("Lỗi khi load thông báo:", error);
        }
    }

    fetchNotifications();

    // ==========================================
    // 8. TỰ ĐỘNG CHUYỂN TAB ĐƠN HÀNG TRÊN MOBILE
    // ==========================================
    function checkResponsiveDefaultTab() {
        if (window.innerWidth < 992) {
            const activePane = document.querySelector(".tab-pane.active");
            if (!activePane || activePane.id === "tab-overview") {
                switchTab("#tab-orders");
                const allOrderBtn = document.querySelector('.fpt-tab-item[data-target-pane="#order-all"]');
                if (allOrderBtn) allOrderBtn.click();
            }
        }
    }

    checkResponsiveDefaultTab();
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkResponsiveDefaultTab, 150);
    });

    // ==========================================
    // 9. QUẢN LÝ SỔ ĐỊA CHỈ
    // ==========================================
    const LOCAL_STORAGE_ADDR_KEY = getScopedStorageKey("tht_user_addresses");
    const addressModalOverlay = document.getElementById("addressModalOverlay");
    const emptyAddAddressBtn = document.getElementById("emptyAddAddressBtn");
    const topAddAddressBtn = document.getElementById("topAddAddressBtn");
    const cancelAddressBtn = document.getElementById("cancelAddressBtn");
    const addressForm = document.getElementById("addressForm");
    const addressEmptyState = document.getElementById("addressEmptyState");
    const addressListContainer = document.getElementById("addressListContainer");
    const addressTypeBtns = document.querySelectorAll(".address-type-btn");

    let addresses = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ADDR_KEY)) || [];

    function openAddressModal() {
        addressForm.reset();
        document.getElementById("addrDefault").checked = addresses.length === 0;
        addressModalOverlay.classList.add("show");
    }

    function closeAddressModal() {
        addressModalOverlay.classList.remove("show");
    }

    if (emptyAddAddressBtn) emptyAddAddressBtn.addEventListener("click", openAddressModal);
    if (topAddAddressBtn) topAddAddressBtn.addEventListener("click", openAddressModal);
    if (cancelAddressBtn) cancelAddressBtn.addEventListener("click", closeAddressModal);
    if (addressModalOverlay) {
        addressModalOverlay.addEventListener("click", (e) => {
            if (e.target === addressModalOverlay) closeAddressModal();
        });
    }

    addressTypeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            addressTypeBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
        });
    });

    function renderAddresses() {
        if (addresses.length === 0) {
            addressEmptyState.classList.remove("d-none");
            addressListContainer.classList.add("d-none");
            topAddAddressBtn.classList.add("d-none");
            return;
        }
        addressEmptyState.classList.add("d-none");
        addressListContainer.classList.remove("d-none");
        topAddAddressBtn.classList.remove("d-none");

        const sortedAddresses = [...addresses].sort((a, b) => (b.isDefault === true) - (a.isDefault === true));

        let html = "";
        sortedAddresses.forEach((addr) => {
            const defaultBadge = addr.isDefault ? `<span class="addr-badge badge-default ms-2">Mặc định</span>` : "";
            const typeBadge = `<span class="addr-badge badge-type ms-2">${addr.type}</span>`;
            const setAsDefaultBtn = !addr.isDefault ? `<button type="button" class="text-primary border-end pe-2 me-2 border-secondary-subtle" onclick="setDefaultAddress('${addr.id}')">Thiết lập mặc định</button>` : ``;

            html += `
                <div class="address-card ${addr.isDefault ? "is-default" : ""}">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <span class="addr-name">${addr.name}</span>
                            <span class="addr-phone">${addr.phone}</span>
                        </div>
                        <div class="addr-actions">
                            ${setAsDefaultBtn}
                            <button type="button" class="text-danger" onclick="deleteAddress('${addr.id}')">Xóa</button>
                        </div>
                    </div>
                    <div class="text-secondary small mb-2">
                        ${addr.detail}<br>
                        ${addr.region}
                    </div>
                    <div>
                        ${defaultBadge}
                        ${typeBadge}
                    </div>
                </div>
            `;
        });
        addressListContainer.innerHTML = html;
    }

    if (addressForm) {
        addressForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("addrName").value;
            const phone = document.getElementById("addrPhone").value;
            const region = document.getElementById("addrRegion").value;
            const detail = document.getElementById("addrDetail").value;
            const type = document.querySelector(".address-type-btn.active").getAttribute("data-type");
            const isDefault = document.getElementById("addrDefault").checked;

            const newAddress = {
                id: "addr_" + Date.now(),
                name,
                phone,
                region,
                detail,
                type,
                isDefault
            };

            if (isDefault) {
                addresses.forEach((a) => (a.isDefault = false));
            } else if (addresses.length === 0) {
                newAddress.isDefault = true;
            }

            addresses.push(newAddress);
            localStorage.setItem(LOCAL_STORAGE_ADDR_KEY, JSON.stringify(addresses));
            renderAddresses();
            closeAddressModal();
        });
    }

    // Hàm đặt mặc định (gọi từ inline onclick)
    window.setDefaultAddress = function (id) {
        addresses = addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id
        }));
        localStorage.setItem(LOCAL_STORAGE_ADDR_KEY, JSON.stringify(addresses));
        renderAddresses();
    };

    // Hàm xóa địa chỉ (mở modal xác nhận)
    window.deleteAddress = function (id) {
        addressIdToDelete = id;
        deleteAddressModalOverlay.classList.add("show");
    };

    // Modal xác nhận xóa địa chỉ
    const deleteAddressModalOverlay = document.getElementById("deleteAddressModalOverlay");
    const closeDeleteModalIcon = document.getElementById("closeDeleteModalIcon");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    let addressIdToDelete = null;

    function closeDeleteModal() {
        deleteAddressModalOverlay.classList.remove("show");
        addressIdToDelete = null;
    }

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    if (closeDeleteModalIcon) closeDeleteModalIcon.addEventListener("click", closeDeleteModal);
    if (deleteAddressModalOverlay) {
        deleteAddressModalOverlay.addEventListener("click", (e) => {
            if (e.target === deleteAddressModalOverlay) closeDeleteModal();
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener("click", () => {
            if (addressIdToDelete) {
                addresses = addresses.filter((addr) => addr.id !== addressIdToDelete);
                if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
                    addresses[0].isDefault = true;
                }
                localStorage.setItem(LOCAL_STORAGE_ADDR_KEY, JSON.stringify(addresses));
                renderAddresses();
                closeDeleteModal();
            }
        });
    }

    renderAddresses();

    // ==========================================
    // 10. HIỂN THỊ ĐƠN HÀNG
    // ==========================================
    function formatMoney(value) {
        let number = Number(String(value ?? 0).replace(/,/g, ""));
        if (!Number.isFinite(number)) number = 0;
        return new Intl.NumberFormat("vi-VN").format(number) + " đ";
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function getCurrentUserOrders() {
        if (!Array.isArray(donHang)) return [];
        return donHang.filter((order) => order.maNguoiDung === currentUser.ma);
    }

    function getOrderStatusClass(status) {
        const normalized = String(status || "").toLowerCase();
        if (normalized.includes("hoàn tất") || normalized.includes("completed")) return "text-success";
        if (normalized.includes("đang giao") || normalized.includes("shipping")) return "text-primary";
        if (normalized.includes("đang xử lý") || normalized.includes("received") || normalized.includes("tiếp nhận")) return "text-warning";
        if (normalized.includes("hủy") || normalized.includes("cancel")) return "text-danger";
        if (normalized.includes("trả") || normalized.includes("returned")) return "text-secondary";
        return "text-dark";
    }

    function buildOrderCard(order) {
        const items = Array.isArray(order.sanPham) ? order.sanPham : [];
        const itemsHtml = items.map((item) => {
            const productName = item.ten || item.name || "Sản phẩm";
            const productImage = item.anh || item.image || "";
            const productVariant = [item.mauSac || item.color, item.kichThuoc || item.storage].filter(Boolean).join(" / ");
            const quantity = item.soLuong || item.quantity || 1;
            const price = item.gia || item.price || 0;

            return `
                <div class="order-body">
                    <img src="${productImage}" alt="${productName}">
                    <div class="order-details">
                        <h6 class="mb-1 fw-bold text-dark">${productName}</h6>
                        <p class="text-muted small mb-1">Phân loại: ${productVariant || "Không có"}</p>
                        <p class="text-muted small mb-0 fw-semibold">x${quantity}</p>
                    </div>
                    <div class="order-price-wrap">
                        <div class="current-price text-danger">${formatMoney(price)}</div>
                    </div>
                </div>
            `;
        }).join("");

        const firstProduct = items[0] || {};
        const firstProductId = firstProduct.ma || firstProduct.id || "";
        const reorderLink = firstProductId ? `./product-detail.html?id=${firstProductId}` : `./index.html#featured`;
        const orderCode = order.ma || order.code || "";
        const orderStatus = order.trangThai || order.status || "Đã tiếp nhận";
        const statusClass = getOrderStatusClass(orderStatus);
        const orderDate = formatDate(order.ngayTao || order.createdAt || new Date().toISOString());
        const total = order.tongTien || (order.totals && order.totals.total) || 0;

        return `
            <div class="order-card shadow-sm border mb-4 rounded-4">
                <div class="order-header bg-light d-flex justify-content-between align-items-center">
                    <span class="text-secondary fw-bold"><i class="bi bi-receipt me-1"></i> Mã ĐH: ${orderCode}</span>
                    <span class="order-status ${statusClass} fw-bold"><i class="bi bi-check-circle-fill me-1"></i> ${orderStatus}</span>
                </div>
                ${itemsHtml}
                <div class="order-footer bg-white border-bottom">
                    <div class="text-secondary small">Ngày đặt: ${orderDate}</div>
                    <div class="fs-5 text-dark">Thành tiền: <strong class="text-danger fs-4">${formatMoney(total)}</strong></div>
                </div>
                <div class="order-footer bg-light justify-content-end gap-2">
                    <button class="btn btn-outline-secondary px-4 py-2 rounded-3 fw-medium" type="button" onclick="viewOrderDetails('${orderCode}')">Xem chi tiết</button>
                    <a href="${reorderLink}" class="btn btn-danger-custom px-4 py-2 rounded-3 fw-medium" style="background-color: var(--ht-red)">Mua lại</a>
                </div>
            </div>
        `;
    }

    // Xem chi tiết đơn hàng (modal)
    window.viewOrderDetails = function (orderCode) {
        const orders = getCurrentUserOrders();
        const order = orders.find((o) => (o.ma || o.code) === orderCode);
        if (!order) return;

        const contentDiv = document.getElementById("orderDetailContent");
        if (!contentDiv) return;

        const addr = order.khachHang || {};
        const items = Array.isArray(order.sanPham) ? order.sanPham : [];

        const itemsHtml = items.map((item) => {
            const productName = item.ten || item.name || "Sản phẩm";
            const productImage = item.anh || item.image || "";
            const productVariant = [item.mauSac || item.color, item.kichThuoc || item.storage].filter(Boolean).join(" / ");
            const quantity = item.soLuong || item.quantity || 1;
            const price = item.gia || item.price || 0;

            return `
                <div class="d-flex align-items-center mb-3 border-bottom pb-3">
                    <img src="${productImage}" alt="${productName}" class="me-3 border rounded" style="width: 70px; height: 70px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-bold">${productName}</h6>
                        <p class="mb-1 small text-muted">Phân loại: ${productVariant || "Không có"}</p>
                        <p class="mb-0 small text-danger fw-semibold">${formatMoney(price)} <span class="text-muted ms-2">x${quantity}</span></p>
                    </div>
                </div>
            `;
        }).join("");

        contentDiv.innerHTML = `
            <div class="mb-4">
                <h6 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="bi bi-geo-alt"></i> Thông tin nhận hàng</h6>
                <p class="mb-1"><strong>Họ và tên:</strong> ${addr.hoTen || addr.name || "Không có"}</p>
                <p class="mb-1"><strong>Điện thoại:</strong> ${addr.dienThoai || addr.phone || "Không có"}</p>
                <p class="mb-0"><strong>Địa chỉ:</strong> ${addr.diaChi || addr.detail || ""}, ${addr.tinhThanh || addr.region || ""}</p>
            </div>
            <div class="mb-4">
                <h6 class="fw-bold text-primary border-bottom pb-2 mb-3"><i class="bi bi-box-seam"></i> Thông tin sản phẩm</h6>
                ${itemsHtml}
            </div>
            <div class="d-flex justify-content-between align-items-center bg-light p-3 rounded border">
                <span class="fs-6 fw-bold text-dark">Tổng thanh toán:</span>
                <span class="fs-4 fw-bolder text-danger">${formatMoney(order.tongTien || (order.totals && order.totals.total) || 0)}</span>
            </div>
        `;

        const modalEl = document.getElementById("orderDetailModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    };

    function loadAndRenderOrders() {
        const orders = getCurrentUserOrders();

        // Phần Tổng quan: hiển thị 2 đơn hàng gần nhất
        const overviewSection = document.querySelector("#tab-overview .content-block:nth-child(1)");
        if (overviewSection && orders.length > 0) {
            const recentOrders = orders.slice(0, 2);
            let html = `
                <div class="section-header">
                    <h3 class="section-title">Đơn hàng gần đây</h3>
                    <a href="#" class="view-all-link nav-trigger" data-trigger="#tab-orders">Xem tất cả <i class="bi bi-chevron-right"></i></a>
                </div>
            `;
            recentOrders.forEach((order) => (html += buildOrderCard(order)));
            overviewSection.innerHTML = html;

            overviewSection.querySelector(".nav-trigger")?.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelector('.nav-item[data-target="#tab-orders"]').click();
            });
        }

        // Các tab đơn hàng theo trạng thái
        const panes = {
            all: document.getElementById("order-all"),
            processing: document.getElementById("order-processing"),
            shipping: document.getElementById("order-shipping"),
            completed: document.getElementById("order-completed"),
            cancelled: document.getElementById("order-cancelled"),
            returned: document.getElementById("order-returned")
        };

        const statusGroups = {
            processing: orders.filter((order) => {
                const status = String(order.trangThai || order.status || "").toLowerCase();
                return status.includes("đang xử lý") || status.includes("tiếp nhận") || status.includes("received") || status.includes("processing");
            }),
            shipping: orders.filter((order) => {
                const status = String(order.trangThai || order.status || "").toLowerCase();
                return status.includes("đang giao") || status.includes("shipping");
            }),
            completed: orders.filter((order) => {
                const status = String(order.trangThai || order.status || "").toLowerCase();
                return status.includes("hoàn tất") || status.includes("completed");
            }),
            cancelled: orders.filter((order) => {
                const status = String(order.trangThai || order.status || "").toLowerCase();
                return status.includes("hủy") || status.includes("cancel");
            }),
            returned: orders.filter((order) => {
                const status = String(order.trangThai || order.status || "").toLowerCase();
                return status.includes("trả") || status.includes("returned");
            })
        };

        if (panes.all) {
            panes.all.innerHTML = orders.length > 0 ? orders.map((order) => buildOrderCard(order)).join("") : "";
        }

        Object.entries(statusGroups).forEach(([key, items]) => {
            const pane = panes[key];
            if (!pane) return;
            pane.innerHTML = items.length > 0 ? items.map((order) => buildOrderCard(order)).join("") : "";
        });
    }

    // ==========================================
    // 11. KHỞI CHẠY TẤT CẢ
    // ==========================================
    renderAvailablePoints();
    renderRewardHistory("all");
    renderRewardHistory("earn");
    renderRewardHistory("used");
    loadAndRenderOrders();
});