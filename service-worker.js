
/* =========================================================
   PANGGIL PAK RT
   SERVICE WORKER
   Version: 1.0.0
========================================================= */

const CACHE_NAME = "panggil-pak-rt-static-v1.1";

/* =========================================================
   01. INSTALL
========================================================= */

self.addEventListener("install", (event) => {
    // Aktifkan service worker baru tanpa menunggu tab lama ditutup.
    self.skipWaiting();
});


/* =========================================================
   02. ACTIVATE
========================================================= */

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return (
                            cacheName.startsWith("panggil-pak-rt-") &&
                            cacheName !== CACHE_NAME
                        );
                    })
                    .map((cacheName) => caches.delete(cacheName))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});


/* =========================================================
   03. STATIC ASSET DETECTION
========================================================= */

function isStaticAsset(url) {
    const allowedExtensions = [
        ".css",
        ".js",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        ".svg",
        ".ico",
        ".woff",
        ".woff2"
    ];

    const pathname = url.pathname.toLowerCase();

    return allowedExtensions.some((extension) => {
        return pathname.endsWith(extension);
    });
}


/* =========================================================
   04. OFFLINE RESPONSE
========================================================= */

function createOfflineResponse() {
    const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">

            <meta name="theme-color" content="#173D30">

            <title>Offline | PANGGIL PAK RT</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #F5F6EF;
                    color: #173D30;
                    font-family: Arial, sans-serif;
                    text-align: center;
                }

                .offline-card {
                    width: 100%;
                    max-width: 420px;
                    padding: 36px 24px;
                    background: #FFFFFF;
                    border-radius: 20px;
                    box-shadow: 0 8px 30px
                        rgba(23, 61, 48, 0.08);
                }

                .offline-icon {
                    font-size: 56px;
                    margin-bottom: 18px;
                }

                h1 {
                    margin: 0 0 12px;
                    font-size: 24px;
                }

                p {
                    color: #69766E;
                    line-height: 1.7;
                }

                button {
                    margin-top: 16px;
                    padding: 13px 22px;
                    border: none;
                    border-radius: 10px;
                    background: #173D30;
                    color: white;
                    font-size: 15px;
                    font-weight: bold;
                    cursor: pointer;
                }
            </style>
        </head>

        <body>
            <main class="offline-card">
                <div class="offline-icon">📡</div>

                <h1>Koneksi Terputus</h1>

                <p>
                    Sepertinya perangkat kamu sedang
                    tidak terhubung ke internet.
                    Silakan periksa koneksi dan coba kembali.
                </p>

                <button onclick="window.location.reload()">
                    Coba Lagi
                </button>
            </main>
        </body>
        </html>
    `;

    return new Response(html, {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
            "Content-Type": "text/html; charset=utf-8"
        }
    });
}



/* =========================================================
   05. FETCH HANDLER
   Strategy: Network First, Cache Fallback
========================================================= */

self.addEventListener("fetch", (event) => {

    const request = event.request;
    const url = new URL(request.url);

    // Hanya menangani permintaan GET.
    if (request.method !== "GET") {
        return;
    }

    // Abaikan permintaan dari domain lain.
    if (url.origin !== self.location.origin) {
        return;
    }

    // Halaman HTML selalu mencoba mengambil versi terbaru.
    if (request.mode === "navigate") {

        event.respondWith(
            fetch(request).catch(() => {
                return createOfflineResponse();
            })
        );

        return;
    }

    // Hanya file statis yang boleh masuk cache.
    if (!isStaticAsset(url)) {
        return;
    }

    // Network First.
    event.respondWith(
        (async () => {

            const cache = await caches.open(CACHE_NAME);

            try {

                // Coba mengambil file terbaru dari server.
                const networkResponse = await fetch(request);

                // Simpan respons valid ke cache.
                if (
                    networkResponse &&
                    networkResponse.ok &&
                    networkResponse.type === "basic"
                ) {

                    await cache.put(
                        request,
                        networkResponse.clone()
                    );

                    return networkResponse;
                }

                // Jika respons server tidak valid,
                // gunakan cache jika tersedia.
                const cachedResponse = await cache.match(request);

                return cachedResponse || networkResponse;

            } catch (error) {

                // Jika jaringan gagal, gunakan cache.
                const cachedResponse = await cache.match(request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                return new Response(
                    "File tidak tersedia saat offline.",
                    {
                        status: 503,
                        headers: {
                            "Content-Type": "text/plain"
                        }
                    }
                );

            }

        })()
    );

});
