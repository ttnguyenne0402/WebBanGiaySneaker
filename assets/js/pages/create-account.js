 
(() => { 
  if (document.body.dataset.page !== "create-account") {
    return;
  }
 
  function initCreateAccountPage() {
    const registerForm = document.querySelector("#bieu-mau-dang-ky");

    if (registerForm) {
      registerForm.addEventListener("submit", dangKyTaiKhoan);
    }
  }
 
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCreateAccountPage);
  } else {
    initCreateAccountPage();
  }
})();