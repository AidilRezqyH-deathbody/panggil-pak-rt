
/* ==========================================
   PANGGIL PAK RT
   GENERAL PAGE INTERACTIONS
========================================== */


/* ==========================================
   01. DOM INITIALIZATION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initializeIcons();
    initializeFAQ();
    initializeScrollReveal();
    initializeSmoothScroll();
    initializeFooterYear();

    console.log("PANGGIL PAK RT berhasil dijalankan.");
});


/* ==========================================
   02. LUCIDE ICON INITIALIZATION
========================================== */

function initializeIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

/* ==========================================
   03. FAQ ACCORDION
========================================== */

function initializeFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");

    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        item.addEventListener("toggle", () => {

            // Keep only one FAQ item open at a time.
            if (item.open) {
                faqItems.forEach((otherItem) => {
                    if (otherItem !== item) {
                        otherItem.open = false;
                    }
                });
            }

        });
    });
}

/* ==========================================
   04. SCROLL REVEAL
========================================== */

function initializeScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    // Respect reduced-motion preferences.
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("active");
        });

        return;
    }

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");

                    // Stop observing once the element is revealed.
                    observerInstance.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}


/* ==========================================
   05. SMOOTH SCROLL
========================================== */

function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const targetElement = document.querySelector(targetId);

            if (!targetElement) return;

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });
}


/* ==========================================
   06. AUTOMATIC FOOTER YEAR
========================================== */

function initializeFooterYear() {
    const yearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    const currentYear = new Date().getFullYear();

    yearElements.forEach((element) => {
        element.textContent = currentYear;
    });
}


/* ==========================================
   07. GENERAL UTILITIES
========================================== */

// Safely refresh Lucide icons when needed.
function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Return the page's current theme.
function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
}

// Check whether the visitor prefers reduced motion.
function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}
