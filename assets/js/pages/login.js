document.addEventListener("DOMContentLoaded", function () {
    // ── 1. LẤY CÁC PHẦN TỬ DOM GỐC TỪ LOGIN.HTML ──
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('mat-khau-dang-nhap');
    const form = document.getElementById('bieu-mau-dang-nhap');
    const emailInput = document.getElementById('email-dang-nhap');
    const passInput = document.getElementById('mat-khau-dang-nhap');
    const emailFeedback = document.getElementById('email-feedback');
    const passFeedback = document.getElementById('password-feedback');
    const notification = document.getElementById('thong-bao-dang-nhap');
    const notiContent = document.getElementById('thong-bao-noi-dung');
    const btnLogin = document.getElementById('btnDangNhap');

    // ── 2. XỬ LÝ ẨN / HIỆN MẬT KHẨU (CÓ PHÒNG HỜ LỖI) ──
    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            }
        });
    }

    // ── 3. XỬ LÝ SỰ KIỆN KHI BẤM NÚT ĐĂNG NHẬP ──
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Ngăn chặn tải lại trang ngay lập tức

            const email = emailInput ? emailInput.value.trim() : "";
            const pass = passInput ? passInput.value : "";
            let hasError = false;

            // Reset tất cả các trạng thái lỗi cũ trước khi kiểm tra mới
            if (emailInput) emailInput.classList.remove('is-invalid');
            if (passInput) passInput.classList.remove('is-invalid');
            if (emailFeedback) emailFeedback.classList.remove('show');
            if (passFeedback) passFeedback.classList.remove('show');
            if (notification) notification.className = 'thong-bao-bieu-mau';

            // Kiểm tra tính hợp lệ của Email
            if (!email) {
                if (emailInput) emailInput.classList.add('is-invalid');
                if (emailFeedback) {
                    emailFeedback.textContent = 'Vui lòng nhập email.';
                    emailFeedback.classList.add('show');
                }
                hasError = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                if (emailInput) emailInput.classList.add('is-invalid');
                if (emailFeedback) {
                    emailFeedback.textContent = 'Email không hợp lệ.';
                    emailFeedback.classList.add('show');
                }
                hasError = true;
            }

            // Kiểm tra tính hợp lệ của Mật khẩu
            if (!pass) {
                if (passInput) passInput.classList.add('is-invalid');
                if (passFeedback) {
                    passFeedback.textContent = 'Vui lòng nhập mật khẩu.';
                    passFeedback.classList.add('show');
                }
                hasError = true;
            } else if (pass.length < 5) {
                if (passInput) passInput.classList.add('is-invalid');
                if (passFeedback) {
                    passFeedback.textContent = 'Mật khẩu tối thiểu 5 ký tự.';
                    passFeedback.classList.add('show');
                }
                hasError = true;
            }

            // Nếu phát hiện có lỗi nhập liệu -> Dừng lại và hiện thông báo đỏ
            if (hasError) {
                if (notification && notiContent) {
                    notification.className = 'thong-bao-bieu-mau show error';
                    notiContent.textContent = 'Vui lòng kiểm tra lại thông tin.';
                }
                return;
            }

            // ── 4. XỬ LÝ ĐĂNG NHẬP THỰC TẾ (SO KHỚP LOCALSTORAGE) ──
            if (btnLogin) {
                btnLogin.classList.add('loading');
                btnLogin.disabled = true;
            }

            setTimeout(() => {
                const emailLogin = email.toLowerCase();

                // Đọc danh sách tài khoản người dùng đã đăng ký
                const danhSachTaiKhoan = JSON.parse(localStorage.getItem("soleStyleTaiKhoan")) || [];

                // Tìm kiếm tài khoản trùng khớp cả email và mật khẩu
                const taiKhoanHopLe = danhSachTaiKhoan.find(tk =>
                    tk.email && tk.email.toLowerCase() === emailLogin && tk.matKhau === pass
                );

                // Tài khoản Admin dùng để test nhanh hệ thống quản trị
                const isAdmin = (emailLogin === "admin@admin.com" && pass === "admin");

                if (taiKhoanHopLe || isAdmin) {
                    let tenHienThi = "Người dùng";
                    let maUser = Date.now();
                    let dienThoaiUser = "";

                    if (isAdmin) {
                        tenHienThi = "Administrator";
                        maUser = "admin";
                        sessionStorage.setItem("is_admin", "true");
                    } else {
                        // Tự động bóc tách tên (hỗ trợ cả trường hoTen hoặc name tùy thuộc file Đăng ký của bạn)
                        tenHienThi = taiKhoanHopLe.hoTen || taiKhoanHopLe.name || "Người dùng";
                        maUser = taiKhoanHopLe.ma || taiKhoanHopLe.id || Date.now();
                        dienThoaiUser = taiKhoanHopLe.dienThoai || "";
                    }

                    // Đóng gói thông tin đúng chuẩn cấu trúc mà file common.js đang yêu cầu
                    const userObj = {
                        ma: maUser,
                        hoTen: tenHienThi,
                        email: email,
                        dienThoai: dienThoaiUser
                    };

                    // Lưu thông tin phiên đăng nhập vào localStorage
                    localStorage.setItem("soleStyleNguoiDung", JSON.stringify(userObj));

                    // Hiển thị khung thông báo Xanh (Thành công) dựa trên Class gốc của dự án
                    if (notification && notiContent) {
                        notification.className = 'thong-bao-bieu-mau show success';
                        notiContent.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
                    }

                    // Đợi hiệu ứng thông báo chạy xong rồi chuyển hướng trang
                    setTimeout(() => {
                        // Nếu là Admin thì chuyển thẳng tới trang quản trị
                        if (isAdmin) {
                            window.location.href = "admin.html";
                        } else {
                            // Nếu là khách hàng bình thường thì về trang chủ hoặc trang trước đó
                            const params = new URLSearchParams(window.location.search);
                            const nextUrl = params.get("next") || "index.html";
                            window.location.href = nextUrl;
                        }
                    }, 1000);

                } else {
                    // Trường hợp sai thông tin Đăng nhập
                    if (btnLogin) {
                        btnLogin.classList.remove('loading');
                        btnLogin.disabled = false;
                    }
                    if (notification && notiContent) {
                        notification.className = 'thong-bao-bieu-mau show error';
                        notiContent.textContent = 'Email hoặc mật khẩu không chính xác!';
                    }
                }
            }, 1000);
        });
    }
});