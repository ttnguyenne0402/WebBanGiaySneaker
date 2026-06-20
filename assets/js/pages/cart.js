(() => {
  if (document.body.dataset.page !== "cart") {
    return;
  }

  function initCartPage() {
    veGioHang();
    veTrangThaiNguoiDung();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartPage);
  } else {
    initCartPage();
  }
})();
