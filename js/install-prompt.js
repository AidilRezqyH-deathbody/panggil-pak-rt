
/* =========================================================
   PANGGIL PAK RT
   INSTALL APP PROMPT
   Version: 1.1.0
========================================================= */


/* =========================================================
   01. CONFIGURATION
========================================================= */

const INSTALL_PROMPT_CONFIG = Object.freeze({
    storageKey: "panggilPakRTInstallDismissed",
    dismissDuration: 7 * 24 * 60 * 60 * 1000,
    displayDelay: 1200
});


/* =========================================================
   02. STATE
========================================================= */

let deferredInstallPrompt = null;
let installPromptElement = null;


/* =========================================================
   03. DEVICE DETECTION
========================================================= */

function getInstallDeviceType() {
    const userAgent = navigator.userAgent || "";

    if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
    if (/Android/i.test(userAgent)) return "android";

    return "desktop";
}


function isAppAlreadyInstalled() {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
    );
}


/* =========================================================
   04. DISMISSAL MANAGEMENT
========================================================= */

function isInstallPromptDismissed() {
    try {
        const dismissedUntil = Number(
            localStorage.getItem(INSTALL_PROMPT_CONFIG.storageKey)
        );

        if (!dismissedUntil) return false;

        if (Date.now() >= dismissedUntil) {
            localStorage.removeItem(
                INSTALL_PROMPT_CONFIG.storageKey
            );

            return false;
        }

        return true;

    } catch (error) {
        console.warn("[PWA] Preferensi instalasi tidak tersedia.");
        return false;
    }
}


function saveInstallPromptDismissal() {
    try {
        localStorage.setItem(
            INSTALL_PROMPT_CONFIG.storageKey,
            String(Date.now() + INSTALL_PROMPT_CONFIG.dismissDuration)
        );
    } catch (error) {
        console.warn("[PWA] Preferensi instalasi tidak dapat disimpan.");
    }
}


/* =========================================================
   05. INSTALLATION GUIDE
========================================================= */

function getInstallationGuide() {
    const device = getInstallDeviceType();

    const guides = {
        android: {
            title: "Instal melalui browser",
            steps: [
                "Buka menu browser melalui ikon tiga titik.",
                "Pilih Instal aplikasi atau Tambahkan ke layar utama.",
                "Ikuti petunjuk yang muncul sampai selesai."
            ]
        },

        ios: {
            title: "Instal melalui Safari",
            steps: [
                "Buka halaman ini menggunakan Safari.",
                "Tekan tombol Bagikan pada browser.",
                "Pilih Tambahkan ke Layar Utama.",
                "Tekan Tambahkan untuk menyelesaikan."
            ]
        },

        desktop: {
            title: "Instal melalui browser",
            steps: [
                "Cari ikon instalasi pada bilah alamat browser, jika tersedia.",
                "Jika tidak ada, buka menu browser.",
                "Pilih Instal PANGGIL PAK RT atau opsi instalasi aplikasi."
            ]
        }
    };

    return guides[device];
}


/* =========================================================
   06. CREATE INSTALL PROMPT
========================================================= */

function createInstallPrompt() {
    if (installPromptElement) return;

    const banner = document.createElement("section");

    banner.className = "pwa-install-banner";
    banner.setAttribute("aria-label", "Rekomendasi instalasi aplikasi");

    banner.innerHTML = `
        <div class="pwa-install-content">

            <div class="pwa-install-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <path d="M12 18h.01"/>
                    <path d="M12 6v7"/>
                    <path d="m9 10 3 3 3-3"/>
                </svg>
            </div>

            <div class="pwa-install-text">
                <h3>Lebih praktis dengan PANGGIL PAK RT</h3>

                <p>
                    Pasang aplikasi di layar utama untuk akses
                    layanan masyarakat dengan lebih mudah.
                </p>
            </div>

            <div class="pwa-install-actions">

                <button
                    type="button"
                    class="pwa-install-button"
                    id="pwaInstallButton">

                    <svg viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="M12 3v12"/>
                        <path d="m7 10 5 5 5-5"/>
                        <path d="M5 17v4h14v-4"/>
                    </svg>

                    <span id="pwaInstallButtonText">
                        Instal Aplikasi
                    </span>

                </button>

                <button
                    type="button"
                    class="pwa-later-button"
                    id="pwaLaterButton"
                    aria-label="Tutup rekomendasi instalasi">

                    <svg viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="m18 6-12 12"/>
                        <path d="m6 6 12 12"/>
                    </svg>

                </button>

            </div>

        </div>

        <div
            class="pwa-install-guide"
            id="pwaInstallGuide"
            hidden>

            <h4 id="pwaGuideTitle"></h4>
            <ol id="pwaGuideSteps"></ol>

            <button
                type="button"
                class="pwa-guide-close"
                id="pwaGuideClose">
                Mengerti
            </button>

        </div>
    `;

    document.body.appendChild(banner);
    installPromptElement = banner;

    addInstallPromptStyles();

    document
        .getElementById("pwaInstallButton")
        .addEventListener("click", handleInstallButton);

    document
        .getElementById("pwaLaterButton")
        .addEventListener("click", dismissInstallPrompt);

    document
        .getElementById("pwaGuideClose")
        .addEventListener("click", closeInstallationGuide);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            banner.classList.add("is-visible");
        });
    });
}


/* =========================================================
   07. INSTALLATION GUIDE
========================================================= */

function showInstallationGuide() {
    const guide = getInstallationGuide();

    const container = document.getElementById("pwaInstallGuide");
    const title = document.getElementById("pwaGuideTitle");
    const steps = document.getElementById("pwaGuideSteps");

    if (!container || !title || !steps) return;

    title.textContent = guide.title;
    steps.replaceChildren();

    guide.steps.forEach((step) => {
        const item = document.createElement("li");
        item.textContent = step;
        steps.appendChild(item);
    });

    container.hidden = false;

    requestAnimationFrame(() => {
        container.classList.add("is-open");
    });
}


function closeInstallationGuide() {
    const guide = document.getElementById("pwaInstallGuide");

    if (!guide) return;

    guide.classList.remove("is-open");

    setTimeout(() => {
        guide.hidden = true;
    }, 220);
}


/* =========================================================
   08. INSTALL BUTTON
========================================================= */

async function handleInstallButton() {
    const button = document.getElementById("pwaInstallButton");

    if (!button) return;

    if (!deferredInstallPrompt) {
        showInstallationGuide();
        return;
    }

    button.classList.add("is-pressed");
    button.disabled = true;

    try {
        deferredInstallPrompt.prompt();

        const result = await deferredInstallPrompt.userChoice;

        if (result.outcome === "accepted") {
            console.info("[PWA] Instalasi diterima.");
        } else {
            console.info("[PWA] Instalasi belum dipilih.");
        }

    } catch (error) {
        console.error("[PWA] Prompt instalasi gagal:", error);
        showInstallationGuide();

    } finally {
        deferredInstallPrompt = null;

        button.disabled = false;
        button.classList.remove("is-pressed");

        const text = document.getElementById("pwaInstallButtonText");

        if (text) text.textContent = "Cara Instal";
    }
}


/* =========================================================
   09. DISMISS PROMPT
========================================================= */

function dismissInstallPrompt() {
    if (!installPromptElement) return;

    saveInstallPromptDismissal();

    installPromptElement.classList.remove("is-visible");
    installPromptElement.classList.add("is-closing");

    setTimeout(() => {
        installPromptElement?.remove();
        installPromptElement = null;
    }, 300);
}


/* =========================================================
   10. STYLES
========================================================= */

function addInstallPromptStyles() {
    if (document.getElementById("pwaInstallStyles")) return;

    const style = document.createElement("style");
    style.id = "pwaInstallStyles";

    style.textContent = `

        .pwa-install-banner {
            position: fixed;
            left: 24px;
            right: 24px;
            bottom: 24px;
            z-index: 9998;

            max-width: 820px;
            margin: 0 auto;
            padding: 17px 20px;

            background: #ffffff;
            border: 1px solid #e4ebe4;
            border-radius: 16px;

            box-shadow: 0 10px 32px rgba(16, 43, 34, 0.13);

            opacity: 0;
            transform: translateY(22px) scale(0.985);

            pointer-events: none;

            transition:
                opacity 0.35s ease,
                transform 0.35s cubic-bezier(.2,.8,.2,1);
        }

        .pwa-install-banner.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        .pwa-install-banner.is-closing {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
            pointer-events: none;
        }

        .pwa-install-content {
            display: flex;
            align-items: center;
            gap: 14px;
        }

        .pwa-install-icon {
            width: 46px;
            height: 46px;
            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            color: #173d30;
            background: #eaf1eb;
            border-radius: 13px;
        }

        .pwa-install-icon svg {
            width: 24px;
            height: 24px;
        }

        .pwa-install-text {
            flex: 1;
            min-width: 0;
        }

        .pwa-install-text h3 {
            margin: 0 0 4px;
            color: #173d30;
            font-size: 14px;
            font-weight: 700;
            line-height: 1.5;
        }

        .pwa-install-text p {
            margin: 0;
            color: #69766e;
            font-size: 12px;
            line-height: 1.55;
        }

        .pwa-install-actions {
            display: flex;
            align-items: center;
            gap: 9px;
            flex-shrink: 0;
        }

        .pwa-install-button {
            min-height: 38px;
            padding: 0 13px;

            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 7px;

            border: 1px solid #173d30;
            border-radius: 9px;

            background: #173d30;
            color: #ffffff;

            font: inherit;
            font-size: 12px;
            font-weight: 600;

            cursor: pointer;

            transition:
                background 0.18s ease,
                transform 0.18s ease,
                box-shadow 0.18s ease;
        }

        .pwa-install-button svg {
            width: 15px;
            height: 15px;
        }

        .pwa-install-button:hover {
            background: #102b22;
            box-shadow: 0 4px 12px rgba(23, 61, 48, 0.18);
            transform: translateY(-1px);
        }

        .pwa-install-button:active,
        .pwa-install-button.is-pressed {
            transform: scale(0.96);
            box-shadow: none;
        }

        .pwa-install-button:disabled {
            opacity: 0.7;
            cursor: wait;
        }

        .pwa-later-button {
            width: 34px;
            height: 34px;
            padding: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border: 1px solid transparent;
            border-radius: 9px;

            background: transparent;
            color: #69766e;

            cursor: pointer;

            transition:
                color 0.18s ease,
                background 0.18s ease,
                transform 0.18s ease;
        }

        .pwa-later-button svg {
            width: 17px;
            height: 17px;
        }

        .pwa-later-button:hover {
            background: #f1f4f0;
            color: #173d30;
            transform: rotate(90deg);
        }

        .pwa-later-button:active {
            transform: scale(0.88);
        }

        .pwa-install-guide {
            display: grid;
            grid-template-rows: 0fr;
            opacity: 0;
            margin-top: 0;
            border-top: 0 solid #e8ede8;

            transition:
                opacity 0.22s ease,
                margin 0.22s ease;
        }

        .pwa-install-guide.is-open {
            grid-template-rows: 1fr;
            opacity: 1;
            margin-top: 14px;
            padding-top: 14px;
            border-top-width: 1px;
        }

        .pwa-install-guide[hidden] {
            display: none;
        }

        .pwa-install-guide h4 {
            margin: 0 0 8px;
            color: #173d30;
            font-size: 13px;
        }

        .pwa-install-guide ol {
            margin: 0;
            padding-left: 21px;
            color: #536158;
            font-size: 12px;
            line-height: 1.85;
        }

        .pwa-guide-close {
            justify-self: start;
            margin-top: 10px;
            padding: 7px 12px;

            border: 1px solid #dce6dd;
            border-radius: 7px;

            background: #f5f6ef;
            color: #173d30;

            font: inherit;
            font-size: 11px;
            font-weight: 600;

            cursor: pointer;

            transition: background 0.18s ease;
        }

        .pwa-guide-close:hover {
            background: #e8f0e9;
        }

        @media (max-width: 640px) {

            .pwa-install-banner {
                left: 12px;
                right: 12px;
                bottom: 12px;

                padding: 14px;
                border-radius: 14px;
            }

            .pwa-install-content {
                gap: 11px;
                align-items: center;
            }

            .pwa-install-icon {
                width: 40px;
                height: 40px;
                border-radius: 11px;
            }

            .pwa-install-icon svg {
                width: 21px;
                height: 21px;
            }

            .pwa-install-text h3 {
                font-size: 12px;
            }

            .pwa-install-text p {
                font-size: 11px;
            }

            .pwa-install-actions {
                gap: 5px;
            }

            .pwa-install-button {
                min-height: 36px;
                padding: 0 10px;
                font-size: 11px;
                white-space: nowrap;
            }

            .pwa-later-button {
                width: 30px;
                height: 30px;
            }

        }

        @media (max-width: 390px) {

            .pwa-install-content {
                flex-wrap: wrap;
            }

            .pwa-install-text {
                flex: 1;
            }

            .pwa-install-actions {
                width: 100%;
                justify-content: flex-end;
            }

        }

        @media (prefers-reduced-motion: reduce) {

            .pwa-install-banner,
            .pwa-install-button,
            .pwa-later-button,
            .pwa-install-guide {
                transition: none !important;
            }

        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   11. INITIALIZATION
========================================================= */

function initializeInstallPrompt() {

    if (isAppAlreadyInstalled()) return;

    if (isInstallPromptDismissed()) return;

    setTimeout(() => {

        if (!isAppAlreadyInstalled()) {
            createInstallPrompt();
        }

    }, INSTALL_PROMPT_CONFIG.displayDelay);
}


/* =========================================================
   12. BROWSER EVENTS
========================================================= */

window.addEventListener("beforeinstallprompt", (event) => {

    event.preventDefault();

    deferredInstallPrompt = event;

});


window.addEventListener("appinstalled", () => {

    console.info("[PWA] Aplikasi berhasil diinstal.");

    installPromptElement?.remove();
    installPromptElement = null;

    deferredInstallPrompt = null;

    try {
        localStorage.removeItem(
            INSTALL_PROMPT_CONFIG.storageKey
        );
    } catch (error) {
        console.warn("[PWA] Preferensi instalasi tidak dapat diperbarui.");
    }

});


/* =========================================================
   13. START
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeInstallPrompt,
        { once: true }
    );

} else {

    initializeInstallPrompt();

}
