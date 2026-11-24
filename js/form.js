
/* ==========================================
   PANGGIL PAK RT
   FORM INTERACTION
========================================== */

document.addEventListener("DOMContentLoaded", () => {
    initializeSubmissionForm();
});


// ==========================================
// MAIN INITIALIZATION
// ==========================================

function initializeSubmissionForm() {
    const form = document.getElementById("submissionForm");

    // Jalankan hanya jika halaman memiliki formulir pengajuan
    if (!form) return;

    initializeServiceInformation();
    initializeDescriptionCounter();
    initializeAttachmentPreview();
    initializeFormSubmission();
}


// ==========================================
// 01. SERVICE INFORMATION
// ==========================================

function initializeServiceInformation() {
    const serviceSelect = document.getElementById("serviceSelect");
    const serviceInfo = document.getElementById("selectedServiceInfo");

    const serviceName = document.querySelector(
        "[data-selected-service-name]"
    );

    const serviceDescription = document.querySelector(
        "[data-selected-service-description]"
    );

    if (!serviceSelect) return;

    function updateServiceInformation() {
        const selectedId = serviceSelect.value;

        // Jika belum ada kategori yang dipilih
        if (!selectedId) {
            if (serviceInfo) {
                serviceInfo.hidden = true;
                serviceInfo.classList.remove("is-visible");
            }

            return;
        }

        // Ambil informasi dari services.js
        const serviceManager = window.PanggilPakRTServices;

        if (!serviceManager) {
            console.warn(
                "PanggilPakRTServices belum tersedia. Pastikan services.js dimuat terlebih dahulu."
            );

            return;
        }

        const service = serviceManager.getServiceById(selectedId);

        if (!service) {
            if (serviceInfo) {
                serviceInfo.hidden = true;
                serviceInfo.classList.remove("is-visible");
            }

            return;
        }

        // Tampilkan nama kategori
        if (serviceName) {
            serviceName.textContent = service.name;
        }

        // Tampilkan deskripsi kategori
        if (serviceDescription) {
            serviceDescription.textContent = service.description;
        }

        // Tampilkan kotak informasi
        if (serviceInfo) {
            serviceInfo.hidden = false;
            serviceInfo.classList.add("is-visible");
        }
    }

    // Perbarui ketika pengguna mengganti kategori
    serviceSelect.addEventListener("change", updateServiceInformation);

    // Tampilkan informasi kategori yang sudah terpilih
    updateServiceInformation();
}


// ==========================================
// 02. DESCRIPTION CHARACTER COUNTER
// ==========================================

function initializeDescriptionCounter() {
    const descriptionInput = document.getElementById(
        "submissionDescription"
    );

    const counter = document.getElementById("descriptionCounter");

    if (!descriptionInput || !counter) return;

    function updateCounter() {
        const currentLength = descriptionInput.value.length;
        const maximumLength = descriptionInput.maxLength > 0
            ? descriptionInput.maxLength
            : 3000;

        // Perbarui teks penghitung
        counter.textContent =
            `${currentLength} / ${maximumLength} karakter`;

        // Berikan indikator ketika mendekati batas
        counter.classList.toggle(
            "is-near-limit",
            currentLength >= maximumLength * 0.9
        );

        counter.classList.toggle(
            "is-at-limit",
            currentLength >= maximumLength
        );
    }

    descriptionInput.addEventListener("input", updateCounter);

    // Jalankan saat halaman pertama kali dibuka
    updateCounter();
}


// ==========================================
// 03. ATTACHMENT PREVIEW
// ==========================================

function initializeAttachmentPreview() {
    const fileInput = document.getElementById("submissionAttachment");
    const preview = document.getElementById("attachmentPreview");

    if (!fileInput || !preview) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const ALLOWED_EXTENSIONS = [
        "pdf",
        "jpg",
        "jpeg",
        "png"
    ];

    function showAttachmentMessage(message, type = "info") {
        preview.innerHTML = "";

        const messageElement = document.createElement("p");

        messageElement.className = `attachment-message ${type}`;
        messageElement.textContent = message;

        preview.appendChild(messageElement);
    }

    function formatFileSize(bytes) {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    function createFilePreview(file) {
        preview.innerHTML = "";

        const fileCard = document.createElement("div");
        fileCard.className = "attachment-file";

        const fileInformation = document.createElement("div");
        fileInformation.className = "attachment-file-info";

        const fileName = document.createElement("p");
        fileName.className = "attachment-file-name";
        fileName.textContent = file.name;

        const fileSize = document.createElement("span");
        fileSize.className = "attachment-file-size";
        fileSize.textContent = formatFileSize(file.size);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "attachment-remove";
        removeButton.textContent = "Hapus lampiran";
        removeButton.setAttribute(
            "aria-label",
            `Hapus lampiran ${file.name}`
        );

        fileInformation.appendChild(fileName);
        fileInformation.appendChild(fileSize);

        fileCard.appendChild(fileInformation);
        fileCard.appendChild(removeButton);

        preview.appendChild(fileCard);

        // Hapus file yang sudah dipilih
        removeButton.addEventListener("click", () => {
            fileInput.value = "";
            preview.innerHTML = "";
        });
    }

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (!file) {
            preview.innerHTML = "";
            return;
        }

        // Periksa ekstensi file
        const extension = file.name
            .split(".")
            .pop()
            .toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            fileInput.value = "";

            showAttachmentMessage(
                "Format file tidak didukung. Gunakan PDF, JPG, JPEG, atau PNG.",
                "error"
            );

            return;
        }

        // Periksa ukuran file
        if (file.size > MAX_FILE_SIZE) {
            fileInput.value = "";

            showAttachmentMessage(
                "Ukuran file melebihi batas maksimal 5 MB.",
                "error"
            );

            return;
        }

        // Tampilkan informasi file
        createFilePreview(file);
    });
}


// ==========================================
// 04. FORM SUBMISSION PLACEHOLDER
// ==========================================

function initializeFormSubmission() {
    const form = document.getElementById("submissionForm");

    const feedback = document.getElementById("formFeedback");

    if (!form) return;

    form.addEventListener("submit", (event) => {
        // Mencegah formulir mengirim data sebelum backend siap
        event.preventDefault();

        if (feedback) {
            feedback.textContent =
                "Formulir belum dapat dikirim. Sistem pengiriman data akan diaktifkan setelah integrasi backend selesai.";

            feedback.className = "form-feedback info";
            feedback.hidden = false;
        }

        // Memberi kesempatan kepada modul berikutnya
        // untuk menangani proses pengajuan.
        form.dispatchEvent(
            new CustomEvent("panggilpakrt:form-submit", {
                bubbles: true,
                detail: {
                    form: form
                }
            })
        );
    });
}
