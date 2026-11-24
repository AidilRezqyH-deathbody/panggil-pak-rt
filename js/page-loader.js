
/* =========================================================
   PANGGIL PAK RT
   PAGE LOADER
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const pageLoader = document.getElementById("pageLoader");

    if (!pageLoader) return;

    function hidePageLoader() {
        pageLoader.classList.add("is-hidden");

        setTimeout(function () {
            pageLoader.remove();
        }, 400);
    }

    if (document.readyState === "complete") {
        hidePageLoader();
    } else {
        window.addEventListener("load", hidePageLoader, {
            once: true
        });
    }
});
