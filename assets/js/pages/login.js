document.addEventListener("DOMContentLoaded", function () {
    // ── Lấy các phần tử DOM ──
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

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); 

            const email = emailInput ? emailInput.value.trim() : "";
            const pass = passInput ? passInput.value : "";
            let hasError = false;

            if (emailInput) emailInput.classList.remove('is-invalid');
            if (passInput) passInput.classList.remove('is-invalid');
            if (emailFeedback) emailFeedback.classList.remove('show');
            if (passFeedback) passFeedback.classList.remove('show');
            if (notification) notification.className = 'thong-bao-bieu-mau';

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
                    passFeedback.textContent = 'Mật khẩu không chính xác.';
                    passFeedback.classList.add('show');
                }
                hasError = true;
            }

            if (hasError) {
                if (notification && notiContent) {
                    notification.className = 'thong-bao-bieu-mau show error';
                    notiContent.textContent = 'Vui lòng kiểm tra lại thông tin.';
                }
                return;
            }

            if (btnLogin) {
                btnLogin.classList.add('loading');
                btnLogin.disabled = true;
            }

            setTimeout(() => {
                const emailLogin = email.toLowerCase();

                const danhSachTaiKhoan = JSON.parse(localStorage.getItem("soleStyleTaiKhoan")) || [];

                const taiKhoanHopLe = danhSachTaiKhoan.find(tk =>
                    tk.email && tk.email.toLowerCase() === emailLogin && tk.matKhau === pass
                );

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
                        tenHienThi = taiKhoanHopLe.hoTen || taiKhoanHopLe.name || "Người dùng";
                        maUser = taiKhoanHopLe.ma || taiKhoanHopLe.id || Date.now();
                        dienThoaiUser = taiKhoanHopLe.dienThoai || "";
                    }

                    const userObj = {
                        ma: maUser,
                        hoTen: tenHienThi,
                        email: email,
                        dienThoai: dienThoaiUser
                    };
                    localStorage.setItem("soleStyleNguoiDung", JSON.stringify(userObj));

                    if (notification && notiContent) {
                        notification.className = 'thong-bao-bieu-mau show success';
                        notiContent.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
                    }

                    setTimeout(() => {
                        if (isAdmin) {
                            window.location.href = "admin.html";
                        } else {
                            const params = new URLSearchParams(window.location.search);
                            const nextUrl = params.get("next") || "index.html";
                            window.location.href = nextUrl;
                        }
                    }, 1000);

                } else {
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