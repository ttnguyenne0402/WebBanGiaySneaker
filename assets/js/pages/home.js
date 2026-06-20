/**
 * home.js - Xử lý trang chủ (index.html)
 * 
 * Nội dung: 
 * - Slider banner tự động chuyển ảnh
 * - Đồng hồ đếm ngược Flash Sale
 * - Gán sự kiện cho nút "Mua ngay" trên slider
 * - Gọi các hàm hiển thị sản phẩm, giỏ hàng, trạng thái đăng nhập từ common.js
 */

// Dùng IIFE (Immediately Invoked Function Expression) để tránh xung đột biến toàn cục
(() => {
  // Kiểm tra nếu đây không phải trang chủ thì thoát (dựa vào data-page trên body)
  if (document.body.dataset.page !== "home") {
    return;
  }

  // === Lấy các phần tử DOM cần thiết ===
  const sliderContainer = document.querySelector("#sliderContainer");
  const slides = document.querySelectorAll(".slide");           // Tất cả các slide
  const prevButton = document.querySelector("#prevBtn");        // Nút trái
  const nextButton = document.querySelector("#nextBtn");        // Nút phải
  const sliderDots = document.querySelector("#sliderDots");    // Vùng chứa các chấm tròn (dots)
  const buyButtons = document.querySelectorAll(".nut-mua-slider"); // Nút "Mua ngay" trên mỗi slide

  let currentSlide = 0;       // Slide đang hiển thị (index bắt đầu từ 0)
  let sliderTimer = null;     // Biến lưu ID của setTimeout để dừng auto-play khi cần

  /**
   * Chuyển đến slide có chỉ số index
   * @param {number} index - Chỉ số slide muốn hiển thị (có thể âm để quay vòng)
   */
  function showSlide(index) {
    if (slides.length === 0) return;

    // Đảm bảo index luôn nằm trong khoảng [0, slides.length-1]
    currentSlide = (index + slides.length) % slides.length;

    // Đánh dấu slide nào đang active (ẩn/hiện) thông qua class 'active'
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    });

    // Cập nhật trạng thái cho các chấm tròn (dots)
    sliderDots?.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === currentSlide);
    });
  }

  /**
   * Bắt đầu chế độ tự động chuyển slide (mỗi 5.2 giây)
   */
  function startSliderAutoPlay() {
    window.clearInterval(sliderTimer); // Xóa timer cũ nếu có
    sliderTimer = window.setInterval(() => {
      showSlide(currentSlide + 1); // Chuyển sang slide tiếp theo
    }, 5200);
  }

  /**
   * Khởi tạo slider: tạo các chấm tròn, gán sự kiện click, pause khi hover
   */
  function initHeroSlider() {
    if (!sliderDots || slides.length === 0) return;

    // Tạo các chấm tròn tương ứng với số lượng slide
    sliderDots.innerHTML = Array.from(slides)
      .map((_, index) => `<button type="button" aria-label="Chuyển đến banner ${index + 1}"></button>`)
      .join("");

    // Gán sự kiện click cho từng chấm tròn
    sliderDots.querySelectorAll("button").forEach((button, index) => {
      button.addEventListener("click", () => {
        showSlide(index);
        startSliderAutoPlay(); // Reset timer khi người dùng bấm chọn
      });
    });

    // Sự kiện cho nút prev / next
    prevButton?.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startSliderAutoPlay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startSliderAutoPlay();
    });

    // Pause tự động khi di chuột vào slider, tiếp tục khi rời chuột
    sliderContainer?.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
    sliderContainer?.addEventListener("mouseleave", startSliderAutoPlay);

    // Hiển thị slide đầu tiên và bắt đầu tự động
    showSlide(0);
    startSliderAutoPlay();
  }

  /**
   * Khởi tạo đồng hồ đếm ngược Flash Sale
   * Lấy thời gian kết thúc cố định (tính từ thời điểm tải trang + 1 ngày 13h41'51")
   */
  function initFlashCountdown() {
    const dayEl = document.getElementById("flash-ngay");
    const hourEl = document.getElementById("flash-gio");
    const minuteEl = document.getElementById("flash-phut");
    const secondEl = document.getElementById("flash-giay");

    if (!dayEl || !hourEl || !minuteEl || !secondEl) return;

    // Thời gian kết thúc: hiện tại + 1 ngày 13 giờ 41 phút 51 giây (ví dụ)
    const endTime = Date.now() + (1 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000) + (41 * 60 * 1000) + (51 * 1000);

    // Cập nhật mỗi giây
    window.setInterval(() => {
      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        dayEl.textContent = "00";
        hourEl.textContent = "00";
        minuteEl.textContent = "00";
        secondEl.textContent = "00";
        return;
      }

      // Tính ngày, giờ, phút, giây còn lại
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      // Hiển thị với 2 chữ số (padStart)
      dayEl.textContent = String(days).padStart(2, "0");
      hourEl.textContent = String(hours).padStart(2, "0");
      minuteEl.textContent = String(minutes).padStart(2, "0");
      secondEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
  }

  /**
   * Gán sự kiện cho nút "Mua ngay" trên slider: chuyển đến trang chi tiết sản phẩm
   */
  function bindSliderBuyButtons() {
    buyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const maSanPham = button.dataset.maSanPham;
        window.location.href = layLienKetChiTietSanPham(maSanPham); // hàm từ common.js
      });
    });
  }

  /**
   * Hàm khởi tạo toàn bộ trang chủ
   */
  function initHomePage() {
    apDungThamSoTrangSanPham(); // Nếu có query string q/brand thì áp dụng (từ common)
    initHeroSlider();           // Khởi tạo slider
    initFlashCountdown();       // Khởi tạo đồng hồ đếm ngược
    bindSliderBuyButtons();     // Gán sự kiện cho nút mua ngay trên slider
    veSanPham();               // Hiển thị danh sách sản phẩm (từ common)
    veGioHang();               // Hiển thị giỏ hàng (từ common)
    veTrangThaiNguoiDung();    // Cập nhật trạng thái đăng nhập (từ common)
  }

  // Chạy khi DOM đã sẵn sàng, hoặc chạy ngay nếu DOM đã sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage);
  } else {
    initHomePage();
  }
})();