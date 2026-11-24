
/* ==========================================
   PANGGIL PAK RT
   NAVIGATION CONFIGURATION
   Version: 1.1.0
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeNavigation();
    initializeActiveNavigation();

});


/* ==========================================
   01. INITIALIZE NAVIGATION
========================================== */

function initializeNavigation() {

    // Support new and legacy header selectors
    const menuToggle = document.querySelector(
        ".menu-toggle, .mobile-menu-toggle"
    );

    const navigation = document.querySelector(
        ".main-navigation"
    );

    if (!menuToggle || !navigation) {
        return;
    }

    // Initial menu state
    closeMobileMenu(menuToggle, navigation);

    // Mobile menu toggle
    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        toggleMobileMenu(menuToggle, navigation);

    });


    // Close menu after clicking navigation links
    const navigationLinks = navigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {

        link.addEventListener("click", () => {
            closeMobileMenu(menuToggle, navigation);
        });

    });


    // Close menu when clicking outside
    document.addEventListener("click", (event) => {

        const clickedInsideNavigation =
            navigation.contains(event.target);

        const clickedMenuToggle =
            menuToggle.contains(event.target);

        if (!clickedInsideNavigation && !clickedMenuToggle) {
            closeMobileMenu(menuToggle, navigation);
        }

    });


    // Close menu using Escape key
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeMobileMenu(menuToggle, navigation);
            menuToggle.focus();
        }

    });


    // Close mobile menu when screen becomes desktop
    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMobileMenu(menuToggle, navigation);
        }

    });


    // Accessibility attributes
    if (!navigation.id) {
        navigation.id = "mainNavigation";
    }

    menuToggle.setAttribute(
        "aria-controls",
        navigation.id
    );

}


/* ==========================================
   02. TOGGLE MOBILE MENU
========================================== */

function toggleMobileMenu(menuToggle, navigation) {

    const isOpen = navigation.classList.contains("is-open");

    if (isOpen) {

        closeMobileMenu(menuToggle, navigation);

    } else {

        openMobileMenu(menuToggle, navigation);

    }

}


/* ==========================================
   03. OPEN MOBILE MENU
========================================== */

function openMobileMenu(menuToggle, navigation) {

    navigation.classList.add("is-open");

    menuToggle.classList.add("is-active");

    menuToggle.setAttribute("aria-expanded", "true");

    menuToggle.setAttribute(
        "aria-label",
        "Tutup menu navigasi"
    );

}


/* ==========================================
   04. CLOSE MOBILE MENU
========================================== */

function closeMobileMenu(menuToggle, navigation) {

    navigation.classList.remove("is-open");

    menuToggle.classList.remove("is-active");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute(
        "aria-label",
        "Buka navigasi"
    );

}


/* ==========================================
   05. NORMALIZE PAGE PATH
========================================== */

function normalizePagePath(path) {

    let normalizedPath = path.replace(/\/+$/, "");

    // Treat root and index.html as the same page
    if (
        normalizedPath === "" ||
        normalizedPath.endsWith("/index.html")
    ) {

        return normalizedPath.replace(/\/index\.html$/, "") || "/";

    }

    return normalizedPath;

}


/* ==========================================
   06. ACTIVE NAVIGATION LINK
========================================== */

function initializeActiveNavigation() {

    const navigationLinks = document.querySelectorAll(
        ".main-navigation a[href]"
    );

    if (!navigationLinks.length) {
        return;
    }


    function updateActiveNavigation() {

        const currentURL = new URL(window.location.href);

        const currentPath = normalizePagePath(
            currentURL.pathname
        );

        let activeLinkFound = false;


        navigationLinks.forEach((link) => {

            const linkURL = new URL(
                link.getAttribute("href"),
                window.location.href
            );

            const linkPath = normalizePagePath(
                linkURL.pathname
            );

            const isSamePage =
                currentPath === linkPath;

            const isSameSection =
                currentURL.hash === linkURL.hash;

            let isActive =
                isSamePage &&
                linkURL.hash !== "" &&
                isSameSection;


            // Default active state for Beranda
            if (
                isSamePage &&
                currentURL.hash === "" &&
                linkURL.hash === "#beranda"
            ) {

                isActive = true;

            }


            link.classList.toggle("active", isActive);

            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "location"
                );

                activeLinkFound = true;

            } else {

                link.removeAttribute("aria-current");

            }

        });

    }


    // Update when URL hash changes
    window.addEventListener(
        "hashchange",
        updateActiveNavigation
    );


    // Update when browser history changes
    window.addEventListener(
        "popstate",
        updateActiveNavigation
    );


    // Initial state
    updateActiveNavigation();

}
