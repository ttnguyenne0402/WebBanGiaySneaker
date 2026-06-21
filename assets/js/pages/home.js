(() => { 
  if (document.body.dataset.page !== "home") {
    return;
  }
 
  const sliderContainer = document.querySelector("#sliderContainer");
  const slides = document.querySelectorAll(".slide");            
  const prevButton = document.querySelector("#prevBtn");         
  const nextButton = document.querySelector("#nextBtn");         
  const sliderDots = document.querySelector("#sliderDots");    
  const buyButtons = document.querySelectorAll(".nut-mua-slider");  

  let currentSlide = 0;       
  let sliderTimer = null;     
 
  function showSlide(index) {
    if (slides.length === 0) return; 
    currentSlide = (index + slides.length) % slides.length; 
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentSlide);
    }); 
    sliderDots?.querySelectorAll("button").forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === currentSlide);
    });
  }
 
  function startSliderAutoPlay() {
    window.clearInterval(sliderTimer);  
    sliderTimer = window.setInterval(() => {
      showSlide(currentSlide + 1); 
    }, 5200);
  }
 
  function initHeroSlider() {
    if (!sliderDots || slides.length === 0) return;
 
    sliderDots.innerHTML = Array.from(slides)
      .map((_, index) => `<button type="button" aria-label="Chuyển đến banner ${index + 1}"></button>`)
      .join("");
 
    sliderDots.querySelectorAll("button").forEach((button, index) => {
      button.addEventListener("click", () => {
        showSlide(index);
        startSliderAutoPlay();  
      });
    });
 
    prevButton?.addEventListener("click", () => {
      showSlide(currentSlide - 1);
      startSliderAutoPlay();
    });

    nextButton?.addEventListener("click", () => {
      showSlide(currentSlide + 1);
      startSliderAutoPlay();
    });
 
    sliderContainer?.addEventListener("mouseenter", () => window.clearInterval(sliderTimer));
    sliderContainer?.addEventListener("mouseleave", startSliderAutoPlay);
 
    showSlide(0);
    startSliderAutoPlay();
  }
 
  function initFlashCountdown() {
    const dayEl = document.getElementById("flash-ngay");
    const hourEl = document.getElementById("flash-gio");
    const minuteEl = document.getElementById("flash-phut");
    const secondEl = document.getElementById("flash-giay");

    if (!dayEl || !hourEl || !minuteEl || !secondEl) return; 
    const endTime = Date.now() + (1 * 24 * 60 * 60 * 1000) + (13 * 60 * 60 * 1000) + (41 * 60 * 1000) + (51 * 1000); 
    window.setInterval(() => {
      const remaining = endTime - Date.now();

      if (remaining <= 0) {
        dayEl.textContent = "00";
        hourEl.textContent = "00";
        minuteEl.textContent = "00";
        secondEl.textContent = "00";
        return;
      } 
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000); 
      dayEl.textContent = String(days).padStart(2, "0");
      hourEl.textContent = String(hours).padStart(2, "0");
      minuteEl.textContent = String(minutes).padStart(2, "0");
      secondEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
  } 
  function bindSliderBuyButtons() {
    buyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const maSanPham = button.dataset.maSanPham;
        window.location.href = layLienKetChiTietSanPham(maSanPham);  
      });
    });
  }
 
  function initHomePage() {
    apDungThamSoTrangSanPham(); 
    initHeroSlider();            
    initFlashCountdown();        
    bindSliderBuyButtons();  
    veSanPham();              
    veGioHang();                  
    veTrangThaiNguoiDung();    
  }
 
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage);
  } else {
    initHomePage();
  }
})();