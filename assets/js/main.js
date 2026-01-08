// main script
(function () {
    "use strict";

    // Dropdown Menu Toggler For Mobile
    // ----------------------------------------
    const dropdownMenuToggler = document.querySelectorAll(
        ".nav-dropdown > .nav-link",
    );

    dropdownMenuToggler.forEach((toggler) => {
        toggler?.addEventListener("click", (e) => {
            e.target.closest(".nav-item").classList.toggle("active");
        });
    });

    // Testimonial Slider
    // ----------------------------------------
    new Swiper(".testimonial-slider", {
        spaceBetween: 24,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".testimonial-slider-next",
            prevEl: ".testimonial-slider-prev",
        },
        pagination: {
            el: ".testimonial-slider-pagination",
            type: "bullets",
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
        },
    });

    // Timeline Animation
    // ----------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        const timelineItems = document.querySelectorAll(".timeline-item");
        if (timelineItems.length > 0) {
            const timelineObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.remove("opacity-0", "translate-y-8");
                            timelineObserver.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "0px 0px -50px 0px",
                }
            );

            timelineItems.forEach((item) => {
                timelineObserver.observe(item);
            });
        }
    });
})();
