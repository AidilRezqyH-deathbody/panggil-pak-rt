
/* =========================================================
   PANGGIL PAK RT
   PWA REGISTRATION
   Version: 1.0.0
========================================================= */


/* =========================================================
   01. PWA CONFIGURATION
========================================================= */

const PWA_CONFIG = Object.freeze({
    serviceWorkerPath: "./service-worker.js",
    scope: "./"
});


/* =========================================================
   02. SERVICE WORKER REGISTRATION
========================================================= */

async function registerPWAServiceWorker() {

    // Periksa dukungan Service Worker.
    if (!("serviceWorker" in navigator)) {
        console.warn(
            "[PWA] Browser tidak mendukung Service Worker."
        );

        return;
    }

    // Service Worker membutuhkan koneksi aman.
    if (!window.isSecureContext) {
        console.warn(
            "[PWA] Service Worker membutuhkan HTTPS atau localhost."
        );

        return;
    }

    try {

        const registration =
            await navigator.serviceWorker.register(
                PWA_CONFIG.serviceWorkerPath,
                {
                    scope: PWA_CONFIG.scope
                }
            );

        console.info(
            "[PWA] Service Worker berhasil didaftarkan.",
            registration.scope
        );

        // Periksa pembaruan Service Worker.
        registration.update().catch((error) => {
            console.warn(
                "[PWA] Pemeriksaan pembaruan gagal:",
                error
            );
        });

    } catch (error) {

        console.error(
            "[PWA] Gagal mendaftarkan Service Worker:",
            error
        );

    }
}


/* =========================================================
   03. INITIALIZATION
========================================================= */

window.addEventListener("load", () => {
    registerPWAServiceWorker();
});
