/**
 * products.js - Xử lý trang sản phẩm (products.html)
 * 
 * Nội dung: Áp dụng bộ lọc từ URL, khởi tạo các nút lọc ngang (brand, category)
 * Hầu hết logic đã có trong common.js, file này chỉ bổ sung tương tác cho các nút lọc nhanh
 */

(() => {
  // Kiểm tra nếu không phải trang products thì thoát
  if (document.body.dataset.page !== "products") {
    return;
  }

  /**
   * Khởi tạo các nút lọc ngang (nằm trên thanh công cụ)
   * Khi click vào một nút, các nút cùng nhóm sẽ được bỏ active, chỉ nút được click giữ active
   */
  function khoiTaoNutLoc() {
    // Các nút lọc danh mục (data-loc-danh-muc)
    const nutLocDanhMuc = document.querySelectorAll(".bo-loc-ngang [data-loc-danh-muc]");
    // Các nút lọc thương hiệu (data-loc-thuong-hieu)
    const nutLocThuongHieu = document.querySelectorAll(".bo-loc-ngang [data-loc-thuong-hieu]");

    nutLocDanhMuc.forEach((nut) => {
      nut.addEventListener("click", () => {
        // Khi click, tất cả các nút trong nhóm đều bỏ active, chỉ nút được click thêm active
        nutLocDanhMuc.forEach((btn) => btn.classList.toggle("active", btn === nut));
        // Hàm apDungLocDanhMuc (từ common) sẽ cập nhật bộ lọc và vẽ lại sản phẩm
        apDungLocDanhMuc(nut.dataset.locDanhMuc);
      });
    });

    nutLocThuongHieu.forEach((nut) => {
      nut.addEventListener("click", () => {
        nutLocThuongHieu.forEach((btn) => btn.classList.toggle("active", btn === nut));
        apDungLocThuongHieu(nut.dataset.locThuongHieu);
      });
    });
  }

  /**
   * Hàm khởi tạo trang products
   */
  function initProductsPage() {
    // Áp dụng tham số từ URL (q, brand)
    apDungThamSoTrangSanPham();
    // Vẽ sản phẩm
    veSanPham();
    // Vẽ giỏ hàng
    veGioHang();
    // Cập nhật trạng thái đăng nhập
    veTrangThaiNguoiDung();
    // Khởi tạo các nút lọc ngang
    khoiTaoNutLoc();
  }

  // Chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductsPage);
  } else {
    initProductsPage();
  }
})();