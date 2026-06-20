(() => {
  if (document.body.dataset.page !== "product-detail") {
    return;
  }

  function initProductDetailPage() {
    khoiTaoTrangChiTietSanPham();
    veGioHang();
    veTrangThaiNguoiDung();
    renderRelatedProducts();
    renderReviews();
    
    // ----- THÊM LOGIC ĐỔI ẢNH KHI CHỌN MÀU -----
    const nhomMau = document.querySelector("#nhom-mau-sac");
    if (nhomMau) {
      nhomMau.addEventListener("click", function(e) {
        const nutMau = e.target.closest(".nut-mau-sac");
        if (!nutMau) return;

        const tenMau = nutMau.dataset.mau;
        if (!sanPhamDangXem) return;

        // Tìm ảnh tương ứng trong danh sách màu
        const mauChon = sanPhamDangXem.mauSac.find(m => m.ten === tenMau);
        const anhMoi = mauChon?.anh || sanPhamDangXem.anh;

        // Cập nhật ảnh chính
        const anhChinh = document.querySelector("#anh-chi-tiet");
        if (anhChinh) {
          anhChinh.src = anhMoi;
          anhChinh.style.opacity = "0.6";
          setTimeout(() => { anhChinh.style.opacity = "1"; }, 150);
        }

        // Cập nhật text màu đã chọn
        const mauDangChon = document.querySelector("#mau-dang-chon");
        if (mauDangChon) mauDangChon.textContent = tenMau;

        // Đánh dấu nút active
        nhomMau.querySelectorAll(".nut-mau-sac").forEach(btn => btn.classList.remove("dang-chon"));
        nutMau.classList.add("dang-chon");
      });
    }
    // ----- KẾT THÚC THÊM -----
  }

  function renderRelatedProducts() {
    const productGrid = document.querySelector("#luoi-san-pham");
    if (!productGrid || !sanPhamDangXem) {
      return;
    }

    const relatedProducts = danhSachSanPham
      .filter((product) => product.danhMuc === sanPhamDangXem.danhMuc && product.ma !== sanPhamDangXem.ma)
      .slice(0, 4);

    if (relatedProducts.length === 0) {
      productGrid.innerHTML = '<div class="col-12 text-center text-muted py-4"><p>Chưa có sản phẩm liên quan.</p></div>';
      return;
    }

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

  function renderReviews() {
    const reviewList = document.querySelector("#reviewList");
    if (!reviewList || !sanPhamDangXem) {
      return;
    }

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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductDetailPage);
  } else {
    initProductDetailPage();
  }
})();