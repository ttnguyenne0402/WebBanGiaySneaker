(() => {
  if (document.body.dataset.page !== "products") {
    return;
  }

  function initProductsPage() {
    apDungThamSoTrangSanPham();
    veSanPham();
    veGioHang();
    veTrangThaiNguoiDung();
    khoiTaoNutLoc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductsPage);
  } else {
    initProductsPage();
  }
function khoiTaoNutLoc() {
  const nutLocDanhMuc = document.querySelectorAll(".bo-loc-ngang [data-loc-danh-muc]");
  const nutLocThuongHieu = document.querySelectorAll(".bo-loc-ngang [data-loc-thuong-hieu]");

  nutLocDanhMuc.forEach((nut) => {
    nut.addEventListener("click", () => {
      nutLocDanhMuc.forEach((btn) => btn.classList.toggle("active", btn === nut));
    });
  });

  nutLocThuongHieu.forEach((nut) => {
    nut.addEventListener("click", () => {
      nutLocThuongHieu.forEach((btn) => btn.classList.toggle("active", btn === nut));
    });
  });
}
})();
