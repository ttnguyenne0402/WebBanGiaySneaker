/**
 * admin.js - Trang quản trị (admin.html)
 * 
 * Nội dung:
 * - Kiểm tra session admin, nếu không có -> chuyển về login
 * - Quản lý tài khoản khách hàng (CRUD)
 * - Quản lý sản phẩm (CRUD) với khả năng hợp nhất từ sản phẩm mặc định và sản phẩm tùy chỉnh
 * - Sử dụng localStorage với các key riêng: soleStyleTaiKhoan, admin_products, admin_deleted_products
 */

// Dùng IIFE
(() => {
    // =========== 1. HẰNG SỐ VÀ BIẾN ===========
    const storageKeys = {
        users: "soleStyleTaiKhoan",
        legacyUsers: "custom_users",
        currentUser: "soleStyleNguoiDung",
        products: "admin_products",
        deletedProducts: "admin_deleted_products"
    };

    const defaultCategory = "Giày";
    const defaultImage = "assets/img/BLAZER+MID+'77+OD+NBY.avif";

    let userModalInstance = null;
    let productModalInstance = null;

    // =========== 2. KHỞI TẠO ===========
    document.addEventListener("DOMContentLoaded", initAdminPage);

    function initAdminPage() {
        // Kiểm tra quyền admin
        if (sessionStorage.getItem("is_admin") !== "true") {
            window.location.href = "./login.html";
            return;
        }

        migrateLegacyUsers();   // Chuyển đổi từ key cũ nếu có
        bindNavigation();       // Gán sự kiện chuyển tab
        bindActions();          // Gán sự kiện cho các nút
        loadUsers();            // Hiển thị danh sách tài khoản
        loadProducts();         // Hiển thị danh sách sản phẩm
    }

    // =========== 3. HÀM TIỆN ÍCH CHUNG ===========
    function readStorage(key, fallback) {
        try {
            const rawValue = localStorage.getItem(key);
            return rawValue ? JSON.parse(rawValue) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function formatMoney(value) {
        return `${Number(value || 0).toLocaleString("vi-VN")}đ`;
    }

    function normalizeId(value) {
        return String(value ?? "").trim();
    }

    function normalizeEmail(value) {
        return String(value ?? "").trim().toLowerCase();
    }

    function getBootstrapModal(elementId) {
        const modalElement = document.getElementById(elementId);
        return modalElement && window.bootstrap ? bootstrap.Modal.getOrCreateInstance(modalElement) : null;
    }

    // =========== 4. CHUYỂN TAB ===========
    function bindNavigation() {
        const navLinks = document.querySelectorAll(".admin-nav-link");
        const sections = document.querySelectorAll(".admin-section");

        navLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                navLinks.forEach((item) => item.classList.remove("active"));
                sections.forEach((section) => section.classList.add("d-none"));
                link.classList.add("active");
                document.getElementById(link.dataset.target)?.classList.remove("d-none");
            });
        });
    }

    // =========== 5. SỰ KIỆN CHUNG ===========
    function bindActions() {
        document.getElementById("adminLogoutBtn")?.addEventListener("click", logoutAdmin);
        document.getElementById("openUserModalBtn")?.addEventListener("click", openUserModal);
        document.getElementById("openProductModalBtn")?.addEventListener("click", openProductModal);
        document.getElementById("userForm")?.addEventListener("submit", saveUser);
        document.getElementById("productForm")?.addEventListener("submit", saveProduct);
        document.getElementById("userTableBody")?.addEventListener("click", handleUserTableClick);
        document.getElementById("productTableBody")?.addEventListener("click", handleProductTableClick);
    }

    function logoutAdmin(event) {
        event.preventDefault();
        sessionStorage.removeItem("is_admin");
        sessionStorage.removeItem("user_name");
        sessionStorage.removeItem("user_email");
        localStorage.removeItem(storageKeys.currentUser);
        window.location.href = "./login.html";
    }

    // =========== 6. QUẢN LÝ TÀI KHOẢN ===========
    function normalizeUser(user, index = 0) {
        const email = normalizeEmail(user.email || user.account || user.username);
        if (!email) return null;

        return {
            ma: user.ma || user.id || `U${Date.now()}${index}`,
            hoTen: String(user.hoTen || user.name || user.fullName || "Người dùng").trim(),
            email,
            dienThoai: String(user.dienThoai || user.phone || user.soDienThoai || "").trim(),
            matKhau: String(user.matKhau || user.password || ""),
            ngayTao: user.ngayTao || new Date().toISOString()
        };
    }

    function getUsers() {
        return readStorage(storageKeys.users, [])
            .map(normalizeUser)
            .filter(Boolean);
    }

    function saveUsers(users) {
        writeStorage(storageKeys.users, users.map((user, index) => normalizeUser(user, index)).filter(Boolean));
    }

    // Chuyển đổi từ key cũ (custom_users) sang key mới
    function migrateLegacyUsers() {
        const legacyUsers = readStorage(storageKeys.legacyUsers, []);
        if (!Array.isArray(legacyUsers) || legacyUsers.length === 0) return;

        const users = getUsers();
        const knownEmails = new Set(users.map((user) => user.email));
        let hasNewUser = false;

        legacyUsers.forEach((legacyUser, index) => {
            const user = normalizeUser(legacyUser, index);
            if (!user || knownEmails.has(user.email)) return;
            users.push(user);
            knownEmails.add(user.email);
            hasNewUser = true;
        });

        if (hasNewUser) {
            saveUsers(users);
        }
    }

    function loadUsers() {
        const tbody = document.getElementById("userTableBody");
        if (!tbody) return;

        const users = getUsers();
        if (users.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">Chưa có tài khoản khách hàng.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = users.map((user) => `
            <tr>
                <td>${escapeHtml(user.hoTen)}</td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.dienThoai || "-")}</td>
                <td><code>${escapeHtml(user.matKhau)}</code></td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-warning me-1" type="button" data-user-action="edit" data-email="${escapeHtml(user.email)}" aria-label="Sửa tài khoản">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" type="button" data-user-action="delete" data-email="${escapeHtml(user.email)}" aria-label="Xóa tài khoản">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    }

    function handleUserTableClick(event) {
        const button = event.target.closest("[data-user-action]");
        if (!button) return;

        const email = button.dataset.email;
        if (button.dataset.userAction === "edit") {
            editUser(email);
        } else if (button.dataset.userAction === "delete") {
            deleteUser(email);
        }
    }

    function openUserModal() {
        document.getElementById("userForm")?.reset();
        document.getElementById("editUserOldEmail").value = "";
        document.getElementById("userModalTitle").textContent = "Thêm tài khoản";
        userModalInstance = getBootstrapModal("userModal");
        userModalInstance?.show();
    }

    function editUser(email) {
        const user = getUsers().find((item) => item.email === normalizeEmail(email));
        if (!user) {
            alert("Không tìm thấy tài khoản cần sửa.");
            return;
        }

        document.getElementById("userName").value = user.hoTen || "";
        document.getElementById("userEmail").value = user.email || "";
        document.getElementById("userPhone").value = user.dienThoai || "";
        document.getElementById("userPassword").value = user.matKhau || "";
        document.getElementById("editUserOldEmail").value = user.email || "";
        document.getElementById("userModalTitle").textContent = "Sửa tài khoản";
        userModalInstance = getBootstrapModal("userModal");
        userModalInstance?.show();
    }

    function saveUser(event) {
        event.preventDefault();

        const oldEmail = normalizeEmail(document.getElementById("editUserOldEmail").value);
        const hoTen = document.getElementById("userName").value.trim();
        const email = normalizeEmail(document.getElementById("userEmail").value);
        const dienThoai = document.getElementById("userPhone").value.trim();
        const matKhau = document.getElementById("userPassword").value;
        const users = getUsers();

        if (!hoTen || !email || !matKhau) {
            alert("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
            return;
        }

        // Kiểm tra trùng email (trừ trường hợp sửa chính tài khoản đó)
        const duplicatedEmail = users.some((user) => user.email === email && user.email !== oldEmail);
        if (duplicatedEmail) {
            alert("Email này đã tồn tại trong hệ thống.");
            return;
        }

        if (oldEmail) {
            // Sửa tài khoản cũ
            const index = users.findIndex((user) => user.email === oldEmail);
            if (index === -1) {
                alert("Không tìm thấy tài khoản cần sửa.");
                return;
            }
            users[index] = { ...users[index], hoTen, email, dienThoai, matKhau };
        } else {
            // Thêm mới
            users.unshift({
                ma: `U${Date.now()}`,
                hoTen,
                email,
                dienThoai,
                matKhau,
                ngayTao: new Date().toISOString()
            });
        }

        saveUsers(users);
        loadUsers();
        userModalInstance?.hide();
    }

    function deleteUser(email) {
        const normalizedEmail = normalizeEmail(email);
        if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;

        const users = getUsers().filter((user) => user.email !== normalizedEmail);
        // Nếu xóa chính user đang đăng nhập, xóa luôn session
        const currentUser = readStorage(storageKeys.currentUser, null);
        if (normalizeEmail(currentUser?.email) === normalizedEmail) {
            localStorage.removeItem(storageKeys.currentUser);
        }

        saveUsers(users);
        loadUsers();
    }

    // =========== 7. QUẢN LÝ SẢN PHẨM ===========

    // Lấy danh sách sản phẩm mặc định (từ biến toàn cục defaultProducts)
    function getDefaultProducts() {
        if (typeof defaultProducts === "undefined" || !Array.isArray(defaultProducts)) {
            return [];
        }
        return defaultProducts.map((product) => normalizeProduct(product, true));
    }

    // Lấy sản phẩm đã được lưu (admin thêm/sửa)
    function getStoredProducts() {
        return readStorage(storageKeys.products, [])
            .map((product) => normalizeProduct(product, false))
            .filter((product) => product.ma);
    }

    function saveStoredProducts(products) {
        writeStorage(storageKeys.products, products.map((product) => normalizeProduct(product, false)));
    }

    // Lấy danh sách ID sản phẩm mặc định đã bị xóa
    function getDeletedProductIds() {
        return readStorage(storageKeys.deletedProducts, []).map((id) => normalizeId(id)).filter(Boolean);
    }

    function saveDeletedProductIds(ids) {
        const uniqueIds = Array.from(new Set(ids.map((id) => normalizeId(id)).filter(Boolean)));
        writeStorage(storageKeys.deletedProducts, uniqueIds);
    }

    // Chuẩn hóa object sản phẩm (đồng bộ thuộc tính tiếng Việt và tiếng Anh)
    function normalizeProduct(product, isDefaultProduct = false) {
        const id = normalizeId(product.ma ?? product.id ?? product.productId ?? product.code ?? product.slug);
        const price = Number(product.gia ?? product.price ?? 0) || 0;
        const oldPrice = Number(product.giaCu ?? product.oldPrice ?? 0) || 0;
        const stock = Number(product.tonKho ?? product.stock ?? 0) || 0;
        const category = String(product.danhMuc ?? product.category ?? product.categoryLabel ?? defaultCategory).trim();

        return {
            ...product,
            ma: id,
            id,
            ten: String(product.ten ?? product.name ?? product.productName ?? "Sản phẩm").trim(),
            name: String(product.name ?? product.ten ?? product.productName ?? "Sản phẩm").trim(),
            thuongHieu: String(product.thuongHieu ?? product.brand ?? "SoleStyle").trim(),
            brand: String(product.brand ?? product.thuongHieu ?? "SoleStyle").trim(),
            doiTuong: String(product.doiTuong ?? "Unisex").trim(),
            danhMuc: category,
            category,
            categoryLabel: category,
            loai: String(product.loai ?? product.type ?? category).trim(),
            gia: price,
            price,
            giaCu: oldPrice,
            oldPrice,
            tonKho: stock,
            stock,
            danhGia: Number(product.danhGia ?? product.rating ?? 5) || 5,
            soDanhGia: Number(product.soDanhGia ?? 0) || 0,
            anh: String(product.anh ?? product.image ?? defaultImage).trim(),
            image: String(product.image ?? product.anh ?? defaultImage).trim(),
            moTa: String(product.moTa ?? product.description ?? "Sản phẩm chất lượng cao.").trim(),
            description: String(product.description ?? product.moTa ?? "Sản phẩm chất lượng cao.").trim(),
            mauSac: Array.isArray(product.mauSac) && product.mauSac.length > 0
                ? product.mauSac
                : [{ ten: "Mặc định", maMau: "#111111" }],
            kichThuoc: Array.isArray(product.kichThuoc) && product.kichThuoc.length > 0
                ? product.kichThuoc
                : ["Free size"],
            nhan: product.nhan ?? (oldPrice > price && price > 0 ? `-${Math.round((1 - price / oldPrice) * 100)}%` : "new"),
            isDefaultProduct
        };
    }

    // Hợp nhất sản phẩm mặc định và sản phẩm lưu (loại bỏ đã xóa)
    function getProductsForAdmin() {
        const deletedIds = new Set(getDeletedProductIds());
        const products = new Map();

        // Thêm sản phẩm mặc định (chưa bị xóa)
        getDefaultProducts()
            .filter((product) => !deletedIds.has(normalizeId(product.ma)))
            .forEach((product) => {
                products.set(normalizeId(product.ma), product);
            });

        // Ghi đè hoặc thêm sản phẩm từ admin_products
        getStoredProducts().forEach((product) => {
            const id = normalizeId(product.ma);
            if (!id || deletedIds.has(id)) return;
            const baseProduct = products.get(id);
            products.set(id, {
                ...baseProduct,
                ...product,
                isDefaultProduct: Boolean(baseProduct?.isDefaultProduct)
            });
        });

        return Array.from(products.values());
    }

    function getProductById(id) {
        const normalizedId = normalizeId(id);
        return getProductsForAdmin().find((product) => normalizeId(product.ma) === normalizedId);
    }

    function loadProducts() {
        const tbody = document.getElementById("productTableBody");
        if (!tbody) return;

        const products = getProductsForAdmin();
        if (products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">Chưa có sản phẩm nào.</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = products.map((product) => `
            <tr>
                <td>${escapeHtml(product.ma)}</td>
                <td><img src="${escapeHtml(product.anh)}" alt="${escapeHtml(product.ten)}"></td>
                <td>
                    <div class="fw-semibold">${escapeHtml(product.ten)}</div>
                    <small class="text-muted">${escapeHtml(product.thuongHieu || "SoleStyle")}</small>
                </td>
                <td>${escapeHtml(product.danhMuc)}</td>
                <td class="text-danger fw-bold">${formatMoney(product.gia)}</td>
                <td>${Number(product.tonKho || 0)}</td>
                <td class="text-nowrap">
                    <button class="btn btn-sm btn-warning me-1" type="button" data-product-action="edit" data-id="${escapeHtml(product.ma)}" aria-label="Sửa sản phẩm">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" type="button" data-product-action="delete" data-id="${escapeHtml(product.ma)}" aria-label="Xóa sản phẩm">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");
    }

    function handleProductTableClick(event) {
        const button = event.target.closest("[data-product-action]");
        if (!button) return;

        const id = button.dataset.id;
        if (button.dataset.productAction === "edit") {
            editProduct(id);
        } else if (button.dataset.productAction === "delete") {
            deleteProduct(id);
        }
    }

    function openProductModal() {
        document.getElementById("productForm")?.reset();
        document.getElementById("editProductId").value = "";
        document.getElementById("productModalTitle").textContent = "Thêm sản phẩm";
        document.getElementById("prodImage").value = defaultImage;
        document.getElementById("prodStock").value = 10;
        productModalInstance = getBootstrapModal("productModal");
        productModalInstance?.show();
    }

    function editProduct(id) {
        const product = getProductById(id);
        if (!product) {
            alert("Không tìm thấy sản phẩm cần sửa.");
            return;
        }

        document.getElementById("prodId").value = product.ma || "";
        document.getElementById("prodName").value = product.ten || "";
        document.getElementById("prodBrand").value = product.thuongHieu || "";
        document.getElementById("prodCategory").value = product.danhMuc || defaultCategory;
        document.getElementById("prodType").value = product.loai || "";
        document.getElementById("prodImage").value = product.anh || "";
        document.getElementById("prodPrice").value = product.gia || 0;
        document.getElementById("prodOldPrice").value = product.giaCu || 0;
        document.getElementById("prodStock").value = product.tonKho ?? 0;
        document.getElementById("prodDesc").value = product.moTa || "";
        document.getElementById("editProductId").value = product.ma || "";
        document.getElementById("productModalTitle").textContent = "Sửa sản phẩm";
        productModalInstance = getBootstrapModal("productModal");
        productModalInstance?.show();
    }

    function saveProduct(event) {
        event.preventDefault();

        const oldId = normalizeId(document.getElementById("editProductId").value);
        const id = normalizeId(document.getElementById("prodId").value);
        const name = document.getElementById("prodName").value.trim();
        const brand = document.getElementById("prodBrand").value.trim() || "SoleStyle";
        const category = document.getElementById("prodCategory").value;
        const type = document.getElementById("prodType").value.trim() || category;
        const image = document.getElementById("prodImage").value.trim();
        const price = Number(document.getElementById("prodPrice").value);
        const oldPrice = Number(document.getElementById("prodOldPrice").value) || 0;
        const stock = Number(document.getElementById("prodStock").value) || 0;
        const description = document.getElementById("prodDesc").value.trim();

        if (!id || !name || !category || !image || price <= 0) {
            alert("Vui lòng nhập đầy đủ ID, tên, danh mục, ảnh và giá bán hợp lệ.");
            return;
        }

        // Kiểm tra trùng ID (trừ trường hợp sửa chính nó)
        const currentProducts = getProductsForAdmin();
        const duplicatedId = currentProducts.some((product) => normalizeId(product.ma) === id && normalizeId(product.ma) !== oldId);
        if (duplicatedId) {
            alert("ID sản phẩm đã tồn tại trong hệ thống.");
            return;
        }

        // Lấy sản phẩm cũ (nếu có) để giữ lại các thuộc tính không thay đổi
        const existingProduct = oldId ? getProductById(oldId) : null;
        const productData = normalizeProduct({
            ...(existingProduct || {}),
            ma: id,
            ten: name,
            thuongHieu: brand,
            danhMuc: category,
            loai: type,
            gia: price,
            giaCu: oldPrice,
            tonKho: stock,
            anh: image,
            moTa: description || existingProduct?.moTa || "Sản phẩm chất lượng cao.",
            // Giữ nguyên màu sắc, kích thước, đánh giá nếu có
            mauSac: existingProduct?.mauSac || [{ ten: "Mặc định", maMau: "#111111" }],
            kichThuoc: existingProduct?.kichThuoc || ["Free size"],
            danhGia: existingProduct?.danhGia || 5,
            soDanhGia: existingProduct?.soDanhGia || 0
        });

        // Cập nhật danh sách sản phẩm lưu
        let storedProducts = getStoredProducts();
        // Xóa sản phẩm cũ nếu có
        if (oldId) {
            storedProducts = storedProducts.filter((product) => normalizeId(product.ma) !== oldId);
        }
        // Xóa sản phẩm trùng ID (đề phòng)
        storedProducts = storedProducts.filter((product) => normalizeId(product.ma) !== id);
        // Thêm vào đầu danh sách
        storedProducts.unshift(productData);
        saveStoredProducts(storedProducts);

        // Nếu sản phẩm này là sản phẩm mặc định và bị thay đổi ID, đánh dấu ID cũ là đã xóa
        const deletedIds = getDeletedProductIds();
        const oldDefaultProductExists = oldId && oldId !== id && getDefaultProducts().some((product) => normalizeId(product.ma) === oldId);
        if (oldDefaultProductExists && !deletedIds.includes(oldId)) {
            deletedIds.push(oldId);
        }
        // Nếu ID mới trùng với sản phẩm mặc định, xóa nó khỏi danh sách đã xóa
        const newDefaultProductExists = getDefaultProducts().some((product) => normalizeId(product.ma) === id);
        if (newDefaultProductExists && deletedIds.includes(id)) {
            const index = deletedIds.indexOf(id);
            if (index !== -1) deletedIds.splice(index, 1);
        }

        saveDeletedProductIds(deletedIds);
        loadProducts();
        productModalInstance?.hide();
    }

    function deleteProduct(id) {
        const normalizedId = normalizeId(id);
        const product = getProductById(normalizedId);
        if (!product) {
            alert("Không tìm thấy sản phẩm cần xóa.");
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

        // Xóa khỏi danh sách lưu
        const storedProducts = getStoredProducts().filter((item) => normalizeId(item.ma) !== normalizedId);
        saveStoredProducts(storedProducts);

        // Nếu là sản phẩm mặc định, thêm ID vào danh sách đã xóa
        const defaultProductExists = getDefaultProducts().some((item) => normalizeId(item.ma) === normalizedId);
        const deletedIds = getDeletedProductIds();
        if (defaultProductExists && !deletedIds.includes(normalizedId)) {
            deletedIds.push(normalizedId);
            saveDeletedProductIds(deletedIds);
        }

        loadProducts();
    }
})();