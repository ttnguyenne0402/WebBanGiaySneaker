/**
 * create-account.js - Trang đăng ký tài khoản mới (create-account.html)
 * 
 * Nội dung: 
 * - Kiểm tra nếu đúng trang create-account thì bắt sự kiện submit của form
 * - Gọi hàm `dangKyTaiKhoan()` từ common.js để xử lý logic (kiểm tra, lưu, chuyển hướng)
 * - Cấu trúc IIFE để tránh xung đột biến toàn cục
 */

(() => {
  // Chỉ chạy nếu trang hiện tại là trang đăng ký (dựa vào data-page trên body)
  if (document.body.dataset.page !== "create-account") {
    return;
  }

  /**
   * Hàm khởi tạo trang đăng ký
   * - Lấy form đăng ký bằng id #bieu-mau-dang-ky
   * - Gán sự kiện submit -> gọi hàm dangKyTaiKhoan (định nghĩa trong common.js)
   */
  function initCreateAccountPage() {
    const registerForm = document.querySelector("#bieu-mau-dang-ky");

    if (registerForm) {
      registerForm.addEventListener("submit", dangKyTaiKhoan);
    }
  }

  // Chạy khi DOM đã sẵn sàng, hoặc chạy ngay nếu DOM đã sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCreateAccountPage);
  } else {
    initCreateAccountPage();
  }
})();