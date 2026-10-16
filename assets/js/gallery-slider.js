(function () {
  "use strict";
  // Lightbox is initialized once by main.js. This file owns layout and sliders.

  const elementIsVisibleInViewport = (el, partiallyVisible = true) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
        (bottom > 0 && bottom < innerHeight)) &&
      ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
  };

  const justify_scale = screen.height * 0.25;
  const allGallery = document.querySelectorAll(".gallery");
  const checkVisibility = () => {
    allGallery.forEach((gallery) => {
      const items = gallery.querySelectorAll(".gallery-item");
      if (elementIsVisibleInViewport(gallery)) {
        items.forEach((item) => {
          let image = item.querySelector("img");
          let ratio = image.naturalWidth / image.naturalHeight;
          item.style.width = justify_scale * ratio + "px";
          item.style.flexGrow = ratio;
          image.style.opacity = 1;
        });
      }
    });
  }
  if (allGallery.length > 0) {
    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("load", checkVisibility);
    checkVisibility();
  }

  // gallery slider
  var isGallerySlider = document.getElementsByClassName("gallery-slider");
  if (isGallerySlider.length > 0 && typeof Swiper === "function") {
    new Swiper(".gallery-slider", {
      slidesPerView: 1,
      loop: true,
      autoHeight: true,
      spaceBetween: 0,
      speed: 1500,
      autoplay: {
        delay: 5000,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
})();
