/**
 * product-detail.js - Xử lý trang chi tiết sản phẩm (product-detail.html)
 * 
 * Nội dung: 
 * - Gọi các hàm từ common để hiển thị thông tin sản phẩm
 * - Thêm logic đổi ảnh chính khi người dùng chọn màu
 * - Hiển thị sản phẩm liên quan và đánh giá
 */

(() => {
  // Kiểm tra nếu không phải trang chi tiết thì thoát
  if (document.body.dataset.page !== "product-detail") {
    return;
  }

  /**
   * Hàm khởi tạo trang chi tiết
   */
  function initProductDetailPage() {
    // Gọi hàm từ common: lấy sản phẩm từ URL, mở modal chi tiết
    khoiTaoTrangChiTietSanPham();

    // Vẽ giỏ hàng và trạng thái đăng nhập
    veGioHang();
    veTrangThaiNguoiDung();

    // Hiển thị sản phẩm liên quan
    renderRelatedProducts();

    // Hiển thị đánh giá (mẫu)
    renderReviews();

    // === THÊM LOGIC ĐỔI ẢNH KHI CHỌN MÀU ===
    const nhomMau = document.querySelector("#nhom-mau-sac");
    if (nhomMau) {
      nhomMau.addEventListener("click", function (e) {
        // Tìm nút màu được click (class .nut-mau-sac)
        const nutMau = e.target.closest(".nut-mau-sac");
        if (!nutMau) return;

        // Lấy tên màu từ data-mau
        const tenMau = nutMau.dataset.mau;
        if (!sanPhamDangXem) return;

        // Tìm ảnh tương ứng trong danh sách màu của sản phẩm
        const mauChon = sanPhamDangXem.mauSac.find(m => m.ten === tenMau);
        // Nếu có ảnh riêng cho màu đó thì dùng, không thì dùng ảnh mặc định
        const anhMoi = mauChon?.anh || sanPhamDangXem.anh;

        // Cập nhật ảnh chính (thẻ img #anh-chi-tiet)
        const anhChinh = document.querySelector("#anh-chi-tiet");
        if (anhChinh) {
          anhChinh.src = anhMoi;
          // Hiệu ứng mờ rồi hiện để tạo cảm giác mượt
          anhChinh.style.opacity = "0.6";
          setTimeout(() => { anhChinh.style.opacity = "1"; }, 150);
        }

        // Cập nhật text "Màu đang chọn"
        const mauDangChon = document.querySelector("#mau-dang-chon");
        if (mauDangChon) mauDangChon.textContent = tenMau;

        // Đánh dấu nút màu đang được chọn (class .dang-chon)
        nhomMau.querySelectorAll(".nut-mau-sac").forEach(btn => btn.classList.remove("dang-chon"));
        nutMau.classList.add("dang-chon");
      });
    }
    // === KẾT THÚC PHẦN THÊM ===
  }

  /**
   * Hiển thị các sản phẩm liên quan (cùng danh mục, tối đa 4)
   */
  function renderRelatedProducts() {
    const productGrid = document.querySelector("#luoi-san-pham");
    if (!productGrid || !sanPhamDangXem) return;

    // Lọc sản phẩm cùng danh mục, khác mã sản phẩm hiện tại
    const relatedProducts = danhSachSanPham
      .filter((product) => product.danhMuc === sanPhamDangXem.danhMuc && product.ma !== sanPhamDangXem.ma)
      .slice(0, 4);

    if (relatedProducts.length === 0) {
      productGrid.innerHTML = '<div class="col-12 text-center text-muted py-4"><p>Chưa có sản phẩm liên quan.</p></div>';
      return;
    }

    // Tạo HTML cho từng sản phẩm (tương tự như card sản phẩm)
    productGrid.innerHTML = relatedProducts.map((product) => `
      <div class="col-12 col-sm-6 col-lg-3">
        <article class="the-san-pham" data-ma-san-pham="${product.ma}" tabindex="0" aria-label="Xem ${product.ten}">
          <div class="khung-anh-san-pham">
            ${taoNhanSanPham(product)}
            <button class="nut-yeu-thich" type="button" aria-label="Yêu thích">
              <i class="bi bi-heart"></i>
            </button>
            <img src="${product.anh}" alt="${product.ten}">
          </div>
          <div class="than-the-san-pham">
            <p class="thuong-hieu-san-pham">${product.thuongHieu}</p>
            <span class="danh-muc-san-pham">${product.danhMuc}</span>
            <h3 class="ten-san-pham">${product.ten}</h3>
            <div class="danh-gia-san-pham">
              <span><i class="bi bi-star-fill"></i> ${product.danhGia}</span>
              <span>${product.soDanhGia} đánh giá</span>
            </div>
            <p class="ton-kho-san-pham">${product.tonKho > 0 ? `${product.tonKho} sản phẩm còn hàng` : "Tạm hết hàng"}</p>
            <div class="dong-gia-san-pham">
              <span class="gia-moi">${dinhDangTien(product.gia)}</span>
              ${product.giaCu ? `<del class="gia-cu">${dinhDangTien(product.giaCu)}</del>` : ""}
            </div>
            <div class="hanh-dong-card-san-pham">
              <button class="nut-gio-card" type="button" data-ma-san-pham="${product.ma}" ${product.tonKho === 0 ? "disabled" : ""} aria-label="Thêm vào giỏ hàng">
                <i class="bi bi-bag-plus"></i>
              </button>
              <a class="nut-mua-ngay-card${product.tonKho === 0 ? " disabled" : ""}" href="${product.tonKho === 0 ? "#" : layLienKetChiTietSanPham(product.ma)}">
                Xem chi tiết
              </a>
            </div>
          </div>
        </article>
      </div>
    `).join("");
  }

  /**
   * Hiển thị đánh giá (mẫu) – có thể mở rộng lấy từ API sau
   */
  function renderReviews() {
    const reviewList = document.querySelector("#reviewList");
    if (!reviewList || !sanPhamDangXem) return;

    // Dữ liệu đánh giá mẫu
    const reviews = [
      { user: "Nguyễn Hồ Sĩ Nguyên", comment: "Sản phẩm rất đẹp, đúng với mô tả, đế giày êm.", date: "18/06/2026" },
      { user: "Nguyên Văn Tèo", comment: "Giao hàng nhanh, size vừa vặn, rất hài lòng.", date: "15/06/2026" }
    ];

    reviewList.innerHTML = reviews.map((review) => `
      <div class="review-item border-bottom pb-3">
        <div class="d-flex align-items-center gap-2 mb-1">
          <span class="fw-bold">${review.user}</span>
          <span class="text-warning small"><i class="bi bi-star-fill"></i> ${sanPhamDangXem.danhGia}</span>
        </div>
        <p class="mb-1 text-secondary">${review.comment}</p>
        <small class="text-muted">${review.date}</small>
      </div>
    `).join("");
  }

  // Chạy khi DOM sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductDetailPage);
  } else {
    initProductDetailPage();
  }
})();