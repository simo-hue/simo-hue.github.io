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

        // Timeline Modal
        // ----------------------------------------
        const modal = document.getElementById("timelineModal");
        const closeModalBtn = document.getElementById("closeModal");
        const timelineCards = document.querySelectorAll(".timeline-card");

        if (modal && timelineCards.length > 0) {
            // Move modal to body to fix z-index stacking context
            document.body.appendChild(modal);

            // Open modal on card click
            timelineCards.forEach((card) => {
                card.addEventListener("click", () => {
                    // Get data from card
                    const date = card.dataset.date;
                    const title = card.dataset.title;
                    const organization = card.dataset.organization;
                    const description = card.dataset.description;
                    const extendedDescription = card.dataset.extendedDescription;
                    const icon = decodeURIComponent(card.dataset.icon || "");
                    const tags = card.dataset.tags ? card.dataset.tags.split("|") : [];
                    const achievements = card.dataset.achievements ? card.dataset.achievements.split("|") : [];
                    const linksData = card.dataset.links;

                    // Populate modal
                    document.getElementById("modalDate").textContent = date;
                    document.getElementById("modalTitle").textContent = title;
                    document.getElementById("modalOrganization").textContent = organization;

                    // Use extended description if available, otherwise use regular description
                    document.getElementById("modalDescription").textContent = extendedDescription || description;

                    document.getElementById("modalIcon").className = icon + " text-white dark:text-text-dark text-2xl md:text-3xl";

                    // Populate tags
                    const tagsContainer = document.getElementById("modalTags");
                    tagsContainer.innerHTML = "";
                    tags.forEach((tag) => {
                        const tagSpan = document.createElement("span");
                        tagSpan.className = "text-xs md:text-sm font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
                        tagSpan.textContent = tag.trim();
                        tagsContainer.appendChild(tagSpan);
                    });

                    // Populate achievements (if present)
                    const achievementsSection = document.getElementById("modalAchievementsSection");
                    const achievementsContainer = document.getElementById("modalAchievements");
                    if (achievements.length > 0 && achievements[0].trim()) {
                        achievementsContainer.innerHTML = "";
                        achievements.forEach((achievement) => {
                            const li = document.createElement("li");
                            li.className = "flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-darkmode-light";
                            li.innerHTML = `
                                <i class="fa-solid fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                                <span class="text-sm md:text-base text-gray-700 dark:text-gray-200">${achievement.trim()}</span>
                            `;
                            achievementsContainer.appendChild(li);
                        });
                        achievementsSection.classList.remove("hidden");
                    } else {
                        achievementsSection.classList.add("hidden");
                    }

                    // Populate links (if present)
                    const linksSection = document.getElementById("modalLinksSection");
                    const linksContainer = document.getElementById("modalLinks");
                    if (linksData) {
                        try {
                            const links = JSON.parse(linksData);
                            if (links && links.length > 0) {
                                linksContainer.innerHTML = "";
                                links.forEach((link) => {
                                    const a = document.createElement("a");
                                    a.href = link.url;
                                    a.target = "_blank";
                                    a.rel = "noopener noreferrer";
                                    a.className = "inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all text-sm md:text-base font-medium";
                                    a.innerHTML = `
                                        ${link.label}
                                        <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                    `;
                                    linksContainer.appendChild(a);
                                });
                                linksSection.classList.remove("hidden");
                            } else {
                                linksSection.classList.add("hidden");
                            }
                        } catch (e) {
                            linksSection.classList.add("hidden");
                        }
                    } else {
                        linksSection.classList.add("hidden");
                    }

                    // Show modal with animation
                    modal.classList.remove("hidden");
                    modal.classList.add("flex");
                    document.body.style.overflow = "hidden"; // Prevent body scroll

                    // Add blur to background content (all body children except modal)
                    Array.from(document.body.children).forEach((child) => {
                        if (child.id !== "timelineModal" && child !== modal) {
                            child.style.filter = "blur(3px)";
                            child.style.transition = "filter 0.3s ease";
                        }
                    });

                    // Trigger animation
                    setTimeout(() => {
                        modal.classList.remove("opacity-0");
                        modal.querySelector(".timeline-modal-content").classList.remove("scale-95");
                        modal.querySelector(".timeline-modal-content").classList.add("scale-100");
                    }, 10);
                });
            });

            // Close modal function
            const closeModal = () => {
                modal.classList.add("opacity-0");
                modal.querySelector(".timeline-modal-content").classList.remove("scale-100");
                modal.querySelector(".timeline-modal-content").classList.add("scale-95");


                // Remove blur from background content
                Array.from(document.body.children).forEach((child) => {
                    child.style.filter = "";
                });


                setTimeout(() => {
                    modal.classList.remove("flex");
                    modal.classList.add("hidden");
                    document.body.style.overflow = ""; // Restore body scroll
                }, 300);
            };

            // Close on button click
            if (closeModalBtn) {
                closeModalBtn.addEventListener("click", closeModal);
            }

            // Close on backdrop click
            modal.addEventListener("click", (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });

            // Close on ESC key
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && modal.classList.contains("flex")) {
                    closeModal();
                }
            });
        }
    });
    // Glightbox Init
    // ----------------------------------------
    const lightbox = GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
    });
})();

