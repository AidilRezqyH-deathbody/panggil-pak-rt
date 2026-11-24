
/* ==========================================
   PANGGIL PAK RT
   SERVICE CATEGORY CONFIGURATION

   File: js/services.js
   Purpose:
   - Store service category information
   - Retrieve service information
   - Read service ID from URL
   - Preselect service on submission form
========================================== */


/* ==========================================
   01. SERVICE DATABASE
========================================== */

const SERVICE_CATEGORIES = [

    {
        id: "SRV-01",
        name: "Surat dan Administrasi",
        description:
            "Layanan pengajuan surat pengantar dan kebutuhan administrasi warga.",
        icon: "file-text"
    },

    {
        id: "SRV-02",
        name: "Proposal Kegiatan",
        description:
            "Pengajuan proposal kegiatan masyarakat, lingkungan, dan kemasyarakatan.",
        icon: "clipboard-list"
    },

    {
        id: "SRV-03",
        name: "Laporan Kependudukan",
        description:
            "Pelaporan kelahiran, kematian, pendatang baru, dan perubahan data warga.",
        icon: "users"
    },

    {
        id: "SRV-04",
        name: "Laporan Lingkungan",
        description:
            "Pelaporan permasalahan kebersihan, fasilitas umum, dan kondisi lingkungan.",
        icon: "trees"
    },

    {
        id: "SRV-05",
        name: "Pengaduan Masyarakat",
        description:
            "Penyampaian keluhan atau permasalahan yang membutuhkan perhatian pengurus RT.",
        icon: "message-square-warning"
    },

    {
        id: "SRV-06",
        name: "Aspirasi dan Saran",
        description:
            "Penyampaian ide, masukan, dan saran untuk meningkatkan kualitas lingkungan.",
        icon: "lightbulb"
    },

    {
        id: "SRV-07",
        name: "Keamanan dan Ketertiban",
        description:
            "Pelaporan informasi atau permasalahan terkait keamanan dan ketertiban lingkungan.",
        icon: "shield-check"
    },

    {
        id: "SRV-08",
        name: "Informasi Lainnya",
        description:
            "Penyampaian informasi atau kebutuhan warga yang belum termasuk kategori lainnya.",
        icon: "info"
    }

];


/* ==========================================
   02. SERVICE DATA ACCESS
========================================== */

/**
 * Get all available service categories.
 *
 * @returns {Array}
 */
function getAllServices() {
    return SERVICE_CATEGORIES.map((service) => ({
        ...service
    }));
}


/**
 * Find a service using its ID.
 *
 * @param {string} serviceId
 * @returns {Object|null}
 */
function getServiceById(serviceId) {
    if (!serviceId) return null;

    const normalizedId = String(serviceId)
        .trim()
        .toUpperCase();

    const service = SERVICE_CATEGORIES.find(
        (item) => item.id === normalizedId
    );

    return service ? { ...service } : null;
}


/**
 * Check whether a service ID exists.
 *
 * @param {string} serviceId
 * @returns {boolean}
 */
function isValidServiceId(serviceId) {
    return getServiceById(serviceId) !== null;
}


/* ==========================================
   03. URL SERVICE DETECTION
========================================== */

/**
 * Read the service ID from the URL.
 *
 * Example:
 * pengajuan.html?layanan=SRV-01
 *
 * @returns {string|null}
 */
function getServiceIdFromURL() {
    const urlParams = new URLSearchParams(
        window.location.search
    );

    const serviceId = urlParams.get("layanan");

    if (!serviceId) return null;

    return isValidServiceId(serviceId)
        ? serviceId.toUpperCase()
        : null;
}


/**
 * Get the complete service selected through URL.
 *
 * @returns {Object|null}
 */
function getServiceFromURL() {
    const serviceId = getServiceIdFromURL();

    if (!serviceId) return null;

    return getServiceById(serviceId);
}


/* ==========================================
   04. FORM SERVICE PRESELECTION
========================================== */

/**
 * Find the service selection element.
 *
 * Supported selectors:
 * - #serviceSelect
 * - #serviceCategory
 * - #jenisLayanan
 * - [name="layanan"]
 *
 * @returns {HTMLSelectElement|null}
 */
function getServiceSelectElement() {
    return document.querySelector(
        '#serviceSelect, ' +
        '#serviceCategory, ' +
        '#jenisLayanan, ' +
        '[name="layanan"]'
    );
}


/**
 * Preselect the service based on URL parameter.
 *
 * The select element must have an option whose value
 * matches the service ID, for example:
 *
 * <option value="SRV-01">
 *     Surat dan Administrasi
 * </option>
 */
function preselectServiceFromURL() {
    const selectedService = getServiceFromURL();

    if (!selectedService) return;

    const serviceSelect = getServiceSelectElement();

    if (!serviceSelect) return;

    const matchingOption = Array.from(
        serviceSelect.options
    ).find((option) => {
        return option.value.toUpperCase() === selectedService.id;
    });

    // Do not change the form if the option does not exist.
    if (!matchingOption) {
        console.warn(
            `Opsi layanan ${selectedService.id} tidak ditemukan pada formulir.`
        );

        return;
    }

    serviceSelect.value = selectedService.id;

    // Notify other scripts that the service has been selected.
    serviceSelect.dispatchEvent(
        new Event("change", {
            bubbles: true
        })
    );

    // Send a custom event with the selected service information.
    document.dispatchEvent(
        new CustomEvent("service:prefilled", {
            detail: {
                service: selectedService
            }
        })
    );

    console.log(
        `Kategori layanan dipilih: ${selectedService.name}`
    );
}


/* ==========================================
   05. SELECTED SERVICE INFORMATION
========================================== */

/**
 * Update optional service information elements.
 *
 * Supported HTML attributes:
 *
 * data-selected-service-name
 * data-selected-service-description
 */
function updateSelectedServiceInformation(service) {
    if (!service) return;

    const nameElements = document.querySelectorAll(
        "[data-selected-service-name]"
    );

    const descriptionElements = document.querySelectorAll(
        "[data-selected-service-description]"
    );

    nameElements.forEach((element) => {
        element.textContent = service.name;
    });

    descriptionElements.forEach((element) => {
        element.textContent = service.description;
    });
}


/* ==========================================
   06. SERVICE INITIALIZATION
========================================== */

function initializeServices() {
    const selectedService = getServiceFromURL();

    if (selectedService) {
        updateSelectedServiceInformation(selectedService);
        preselectServiceFromURL();
    }
}


/* ==========================================
   07. PUBLIC SERVICE API
========================================== */

/**
 * Expose service functions for other JavaScript files.
 *
 * Example:
 *
 * PanggilPakRTServices.getAllServices();
 * PanggilPakRTServices.getServiceById("SRV-01");
 * PanggilPakRTServices.getServiceFromURL();
 */
window.PanggilPakRTServices = Object.freeze({

    getAllServices,

    getServiceById,

    isValidServiceId,

    getServiceIdFromURL,

    getServiceFromURL

});


/* ==========================================
   08. DOM INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeServices
);
