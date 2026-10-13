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

    // Glightbox Init
    // ----------------------------------------
    const lightbox = GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });

    // Blog Prose Scroll Reveal Animation
    // ----------------------------------------
    const blogElements = document.querySelectorAll(".blog-prose h2, .blog-prose h3, .blog-prose blockquote, .blog-prose img:not(.no-reveal)");
    
    if (blogElements.length > 0) {
        // Add initial class
        blogElements.forEach(el => {
            el.classList.add("blog-prose-reveal");
        });

        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        blogElements.forEach((el) => {
            revealObserver.observe(el);
        });
    }

    // Code Block Copy Button
    // ----------------------------------------
    const codeBlocks = document.querySelectorAll(".blog-prose pre");
    
    codeBlocks.forEach((block) => {
        // Create copy button
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-code-btn";
        copyBtn.innerHTML = '<i class="fa-regular fa-clipboard"></i><span>Copy</span>';
        
        // Append button to pre block
        block.appendChild(copyBtn);
        
        copyBtn.addEventListener("click", async () => {
            // Find the code element inside this pre block
            const code = block.querySelector("code");
            if (!code) return;
            
            try {
                await navigator.clipboard.writeText(code.innerText);
                
                // Visual feedback
                copyBtn.classList.add("copied");
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Copied!</span>';
                
                setTimeout(() => {
                    copyBtn.classList.remove("copied");
                    copyBtn.innerHTML = '<i class="fa-regular fa-clipboard"></i><span>Copy</span>';
                }, 2000);
            } catch (err) {
                console.error("Failed to copy code: ", err);
                copyBtn.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Error</span>';
            }
        });
    });
})();
