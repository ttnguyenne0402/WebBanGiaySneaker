/**
 * cart.js - Xử lý trang giỏ hàng (cart.html)
 * 
 * Nội dung: Rất đơn giản, chỉ gọi các hàm từ common.js để hiển thị giỏ hàng
 * và trạng thái đăng nhập. Mọi logic thêm/sửa/xóa đều nằm trong common.
 */

(() => {
  // Kiểm tra nếu không phải trang giỏ hàng thì thoát
  if (document.body.dataset.page !== "cart") {
    return;
  }

  function initCartPage() {
    // Hiển thị danh sách giỏ hàng (và tổng tiền)
    veGioHang();
    // Cập nhật trạng thái đăng nhập trên header
    veTrangThaiNguoiDung();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartPage);
  } else {
    initCartPage();
  }
})();