
/* ==========================================
   PANGGIL PAK RT
   THEME CONFIGURATION
   Light Mode & Dark Mode
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initializeTheme();
});


/* ==========================================
   01. THEME CONFIGURATION
========================================== */

const THEME_CONFIG = {
    storageKey: "panggilPakRTTheme",

    defaultTheme: "light",

    themes: {
        light: "light",
        dark: "dark"
    },

    selectors: {
        toggle: ".theme-toggle, .theme-switch",
        icon: ".theme-icon"
    }
};


/* ==========================================
   02. GET SAVED THEME
========================================== */

function getSavedTheme() {

    try {
        const savedTheme = localStorage.getItem(
            THEME_CONFIG.storageKey
        );

        if (
            savedTheme === THEME_CONFIG.themes.light ||
            savedTheme === THEME_CONFIG.themes.dark
        ) {
            return savedTheme;
        }

    } catch (error) {
        console.warn("Tidak dapat membaca pengaturan tema:", error);
    }

    return null;
}


/* ==========================================
   03. GET SYSTEM THEME
========================================== */

function getSystemTheme() {

    if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
        return THEME_CONFIG.themes.dark;
    }

    return THEME_CONFIG.themes.light;
}


/* ==========================================
   04. DETERMINE INITIAL THEME
========================================== */

function getInitialTheme() {

    const savedTheme = getSavedTheme();

    if (savedTheme) {
        return savedTheme;
    }

    return getSystemTheme() || THEME_CONFIG.defaultTheme;
}


/* ==========================================
   05. APPLY THEME
========================================== */

function applyTheme(theme, savePreference = true) {

    const validThemes = Object.values(THEME_CONFIG.themes);

    if (!validThemes.includes(theme)) {
        theme = THEME_CONFIG.defaultTheme;
    }

    // Apply theme to HTML element
    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    // Update theme toggle appearance
    updateThemeButton(theme);

    // Save user preference
    if (savePreference) {
        saveTheme(theme);
    }

    // Update browser theme color
    updateThemeColor(theme);

}


/* ==========================================
   06. SAVE THEME
========================================== */

function saveTheme(theme) {

    try {
        localStorage.setItem(
            THEME_CONFIG.storageKey,
            theme
        );

    } catch (error) {
        console.warn("Tidak dapat menyimpan pengaturan tema:", error);
    }

}


/* ==========================================
   07. UPDATE THEME BUTTON
========================================== */

function updateThemeButton(theme) {

    const themeButtons = document.querySelectorAll(
        THEME_CONFIG.selectors.toggle
    );

    themeButtons.forEach((button) => {

        const isDarkMode = theme === THEME_CONFIG.themes.dark;

        // Update accessibility attributes
        button.setAttribute(
            "aria-label",
            isDarkMode
                ? "Aktifkan mode terang"
                : "Aktifkan mode gelap"
        );

        button.setAttribute(
            "aria-pressed",
            String(isDarkMode)
        );

        button.setAttribute(
            "title",
            isDarkMode
                ? "Aktifkan Light Mode"
                : "Aktifkan Dark Mode"
        );

        // Update Lucide icon
        const icon = button.querySelector(
            THEME_CONFIG.selectors.icon
        );

        if (icon) {

            const iconName = isDarkMode ? "sun" : "moon";

            icon.setAttribute("data-lucide", iconName);

            icon.innerHTML = "";

        }

    });

    // Re-render Lucide icons
    refreshLucideIcons();

}


/* ==========================================
   08. REFRESH LUCIDE ICONS
========================================== */

function refreshLucideIcons() {

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {
        window.lucide.createIcons();
    }

}


/* ==========================================
   09. UPDATE BROWSER THEME COLOR
========================================== */

function updateThemeColor(theme) {

    const themeColor = theme === THEME_CONFIG.themes.dark
        ? "#102B22"
        : "#173D30";

    let themeColorMeta = document.querySelector(
        'meta[name="theme-color"]'
    );

    if (!themeColorMeta) {

        themeColorMeta = document.createElement("meta");

        themeColorMeta.setAttribute("name", "theme-color");

        document.head.appendChild(themeColorMeta);

    }

    themeColorMeta.setAttribute(
        "content",
        themeColor
    );

}


/* ==========================================
   10. TOGGLE THEME
========================================== */

function toggleTheme() {

    const currentTheme = document.documentElement.getAttribute(
        "data-theme"
    ) || THEME_CONFIG.defaultTheme;

    const newTheme = currentTheme === THEME_CONFIG.themes.dark
        ? THEME_CONFIG.themes.light
        : THEME_CONFIG.themes.dark;

    applyTheme(newTheme, true);

}


/* ==========================================
   11. INITIALIZE THEME
========================================== */

function initializeTheme() {

    // Determine initial theme
    const initialTheme = getInitialTheme();

    // Apply initial theme
    applyTheme(initialTheme, false);

    // Find theme buttons
    const themeButtons = document.querySelectorAll(
        THEME_CONFIG.selectors.toggle
    );

    // Attach click events
    themeButtons.forEach((button) => {

        button.addEventListener("click", toggleTheme);

    });

    // Initialize system theme listener
    initializeSystemThemeListener();

}


/* ==========================================
   12. SYSTEM THEME LISTENER
========================================== */

function initializeSystemThemeListener() {

    if (!window.matchMedia) {
        return;
    }

    const systemTheme = window.matchMedia(
        "(prefers-color-scheme: dark)"
    );

    systemTheme.addEventListener("change", (event) => {

        // Do not override manually selected theme
        if (getSavedTheme()) {
            return;
        }

        const newTheme = event.matches
            ? THEME_CONFIG.themes.dark
            : THEME_CONFIG.themes.light;

        applyTheme(newTheme, false);

    });

}
