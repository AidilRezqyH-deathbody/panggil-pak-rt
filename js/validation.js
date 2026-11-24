
/* =========================================================
   PANGGIL PAK RT
   FORM VALIDATION MODULE
   File: js/validation.js
========================================================= */


/* =========================================================
   01. VALIDATION CONFIGURATION
========================================================= */

const VALIDATION_CONFIG = Object.freeze({

    name: {
        minLength: 2,
        maxLength: 100
    },

    phone: {
        minLength: 10,
        maxLength: 20
    },

    email: {
        minLength: 5,
        maxLength: 254
    },

    subject: {
        minLength: 3,
        maxLength: 150
    },

    description: {
        minLength: 10,
        maxLength: 3000
    },

    location: {
        minLength: 3,
        maxLength: 200
    },

    attachment: {
        maxSize: 5 * 1024 * 1024,

        allowedExtensions: [
            "pdf",
            "jpg",
            "jpeg",
            "png"
        ],

        allowedMimeTypes: [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ]
    }

});


/* =========================================================
   02. VALIDATION MESSAGES
========================================================= */

const VALIDATION_MESSAGES = Object.freeze({

    nameRequired:
        "Nama lengkap wajib diisi.",

    nameInvalid:
        "Nama lengkap minimal 2 karakter.",

    nameTooLong:
        "Nama lengkap maksimal 100 karakter.",

    phoneRequired:
        "Nomor WhatsApp wajib diisi.",

    phoneInvalid:
        "Masukkan nomor WhatsApp yang valid.",

    phoneTooLong:
        "Nomor WhatsApp terlalu panjang.",

    emailRequired:
        "Alamat email wajib diisi.",

    emailInvalid:
        "Format alamat email tidak valid.",

    emailTooLong:
        "Alamat email maksimal 254 karakter.",

    rtRequired:
        "Silakan pilih RT tempat tinggal.",

    serviceRequired:
        "Silakan pilih kategori layanan.",

    subjectRequired:
        "Judul atau perihal pengajuan wajib diisi.",

    subjectInvalid:
        "Perihal pengajuan minimal 3 karakter.",

    subjectTooLong:
        "Perihal pengajuan maksimal 150 karakter.",

    descriptionRequired:
        "Penjelasan pengajuan wajib diisi.",

    descriptionInvalid:
        "Penjelasan minimal 10 karakter.",

    descriptionTooLong:
        "Penjelasan maksimal 3000 karakter.",

    locationInvalid:
        "Lokasi minimal 3 karakter.",

    locationTooLong:
        "Lokasi maksimal 200 karakter.",

    attachmentInvalid:
        "Format lampiran tidak didukung.",

    attachmentTooLarge:
        "Ukuran lampiran maksimal 5 MB.",

    consentRequired:
        "Persetujuan pemrosesan data wajib dicentang."

});


/* =========================================================
   03. VALIDATION SELECTORS
========================================================= */

const VALIDATION_FIELDS = Object.freeze({

    name: "#guestName",

    phone: "#guestPhone",

    email: "#guestEmail",

    rt: "#guestRT",

    service: "#serviceSelect",

    subject: "#submissionSubject",

    description: "#submissionDescription",

    location: "#submissionLocation",

    attachment: "#submissionAttachment",

    consent: "#dataConsent"

});


/* =========================================================
   04. GENERAL HELPERS
========================================================= */

function getValidationElement(selector) {

    return document.querySelector(selector);

}


function normalizeValidationValue(value) {

    return String(value || "").trim();

}


function getFieldValue(selector) {

    const element = getValidationElement(selector);

    if (!element) {
        return "";
    }

    return normalizeValidationValue(element.value);

}


/* =========================================================
   05. ERROR DISPLAY
========================================================= */

function addValidationError(element, message) {

    if (!element) {
        return;
    }

    clearFieldError(element);

    element.classList.add("is-invalid");

    element.setAttribute(
        "aria-invalid",
        "true"
    );

    const error = document.createElement("small");

    error.className = "field-error";

    error.setAttribute("role", "alert");

    error.textContent = message;

    const fieldContainer = element.closest(".form-field");

    if (fieldContainer) {

        fieldContainer.appendChild(error);

    } else {

        element.insertAdjacentElement(
            "afterend",
            error
        );

    }

}


function clearFieldError(element) {

    if (!element) {
        return;
    }

    element.classList.remove("is-invalid");

    element.removeAttribute("aria-invalid");

    const fieldContainer = element.closest(".form-field");

    if (fieldContainer) {

        const existingErrors = fieldContainer
            .querySelectorAll(".field-error");

        existingErrors.forEach(error => {
            error.remove();
        });

    }

}


/* =========================================================
   06. FORM FEEDBACK
========================================================= */

function showValidationFeedback(message) {

    const feedback = document.getElementById(
        "formFeedback"
    );

    if (!feedback) {
        return;
    }

    feedback.hidden = false;

    feedback.className = "form-feedback error";

    feedback.textContent = message;

}


function clearValidationFeedback() {

    const feedback = document.getElementById(
        "formFeedback"
    );

    if (!feedback) {
        return;
    }

    feedback.hidden = true;

    feedback.textContent = "";

    feedback.className = "form-feedback";

}


/* =========================================================
   07. NAME VALIDATION
========================================================= */

function validateName() {

    const element = getValidationElement(
        VALIDATION_FIELDS.name
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.name
    );

    if (!value) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.nameRequired
        );

        return false;

    }

    if (
        value.length <
        VALIDATION_CONFIG.name.minLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.nameInvalid
        );

        return false;

    }

    if (
        value.length >
        VALIDATION_CONFIG.name.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.nameTooLong
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   08. PHONE VALIDATION
========================================================= */

function validatePhone() {

    const element = getValidationElement(
        VALIDATION_FIELDS.phone
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.phone
    );

    if (!value) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.phoneRequired
        );

        return false;

    }

    const normalizedPhone = value.replace(
        /[\s()-]/g,
        ""
    );

    const phonePattern =
        /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;

    if (!phonePattern.test(normalizedPhone)) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.phoneInvalid
        );

        return false;

    }

    if (
        normalizedPhone.length >
        VALIDATION_CONFIG.phone.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.phoneTooLong
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   09. EMAIL VALIDATION
========================================================= */

function validateEmail() {

    const element = getValidationElement(
        VALIDATION_FIELDS.email
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.email
    );

    if (!value) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.emailRequired
        );

        return false;

    }

    if (
        value.length >
        VALIDATION_CONFIG.email.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.emailTooLong
        );

        return false;

    }

    if (
        value.length <
        VALIDATION_CONFIG.email.minLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.emailInvalid
        );

        return false;

    }

    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    if (!emailPattern.test(value)) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.emailInvalid
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   10. RT VALIDATION
========================================================= */

function validateRT() {

    const element = getValidationElement(
        VALIDATION_FIELDS.rt
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.rt
    );

    const allowedRT = [
        "RT 01",
        "RT 02",
        "RT 03",
        "RT 04"
    ];

    if (!value || !allowedRT.includes(value)) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.rtRequired
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   11. SERVICE VALIDATION
========================================================= */

function validateService() {

    const element = getValidationElement(
        VALIDATION_FIELDS.service
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.service
    );

    const allowedServices = [
        "SRV-01",
        "SRV-02",
        "SRV-03",
        "SRV-04",
        "SRV-05",
        "SRV-06",
        "SRV-07",
        "SRV-08"
    ];

    if (!value || !allowedServices.includes(value)) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.serviceRequired
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   12. SUBJECT VALIDATION
========================================================= */

function validateSubject() {

    const element = getValidationElement(
        VALIDATION_FIELDS.subject
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.subject
    );

    if (!value) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.subjectRequired
        );

        return false;

    }

    if (
        value.length <
        VALIDATION_CONFIG.subject.minLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.subjectInvalid
        );

        return false;

    }

    if (
        value.length >
        VALIDATION_CONFIG.subject.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.subjectTooLong
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   13. DESCRIPTION VALIDATION
========================================================= */

function validateDescription() {

    const element = getValidationElement(
        VALIDATION_FIELDS.description
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.description
    );

    if (!value) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.descriptionRequired
        );

        return false;

    }

    if (
        value.length <
        VALIDATION_CONFIG.description.minLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.descriptionInvalid
        );

        return false;

    }

    if (
        value.length >
        VALIDATION_CONFIG.description.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.descriptionTooLong
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   14. LOCATION VALIDATION
========================================================= */

function validateLocation() {

    const element = getValidationElement(
        VALIDATION_FIELDS.location
    );

    if (!element) {
        return true;
    }

    const value = getFieldValue(
        VALIDATION_FIELDS.location
    );

    // Lokasi bersifat opsional.
    if (!value) {

        clearFieldError(element);

        return true;

    }

    if (
        value.length <
        VALIDATION_CONFIG.location.minLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.locationInvalid
        );

        return false;

    }

    if (
        value.length >
        VALIDATION_CONFIG.location.maxLength
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.locationTooLong
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   15. ATTACHMENT VALIDATION
========================================================= */

function validateAttachment() {

    const element = getValidationElement(
        VALIDATION_FIELDS.attachment
    );

    if (!element) {
        return true;
    }

    const file = element.files[0];

    // Lampiran bersifat opsional.
    if (!file) {

        clearFieldError(element);

        return true;

    }

    if (
        file.size >
        VALIDATION_CONFIG.attachment.maxSize
    ) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.attachmentTooLarge
        );

        return false;

    }

    const extension = file.name
        .split(".")
        .pop()
        .toLowerCase();

    const validExtension =
        VALIDATION_CONFIG.attachment.allowedExtensions
            .includes(extension);

    const validMimeType =
        VALIDATION_CONFIG.attachment.allowedMimeTypes
            .includes(file.type);

    if (!validExtension || !validMimeType) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.attachmentInvalid
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   16. CONSENT VALIDATION
========================================================= */

function validateConsent() {

    const element = getValidationElement(
        VALIDATION_FIELDS.consent
    );

    if (!element) {
        return true;
    }

    if (!element.checked) {

        addValidationError(
            element,
            VALIDATION_MESSAGES.consentRequired
        );

        return false;

    }

    clearFieldError(element);

    return true;

}


/* =========================================================
   17. VALIDATE COMPLETE FORM
========================================================= */

function validateSubmissionForm() {

    const validators = [

        validateName,

        validatePhone,

        validateEmail,

        validateRT,

        validateService,

        validateSubject,

        validateDescription,

        validateLocation,

        validateAttachment,

        validateConsent

    ];

    let isValid = true;

    let firstInvalidElement = null;

    validators.forEach(validator => {

        const result = validator();

        if (!result) {

            isValid = false;

            if (!firstInvalidElement) {

                const fieldMap = [
                    [validateName, VALIDATION_FIELDS.name],
                    [validatePhone, VALIDATION_FIELDS.phone],
                    [validateEmail, VALIDATION_FIELDS.email],
                    [validateRT, VALIDATION_FIELDS.rt],
                    [validateService, VALIDATION_FIELDS.service],
                    [validateSubject, VALIDATION_FIELDS.subject],
                    [validateDescription, VALIDATION_FIELDS.description],
                    [validateLocation, VALIDATION_FIELDS.location],
                    [validateAttachment, VALIDATION_FIELDS.attachment],
                    [validateConsent, VALIDATION_FIELDS.consent]
                ];

                const field = fieldMap.find(
                    item => item[0] === validator
                );

                if (field) {
                    firstInvalidElement =
                        getValidationElement(field[1]);
                }

            }

        }

    });

    if (!isValid) {

        showValidationFeedback(
            "Mohon periksa kembali data yang kamu masukkan."
        );

        if (firstInvalidElement) {

            firstInvalidElement.focus();

            firstInvalidElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        return false;

    }

    clearValidationFeedback();

    return true;

}


/* =========================================================
   18. LIVE FIELD VALIDATION
========================================================= */

function initializeLiveValidation() {

    const fieldValidators = [

        [VALIDATION_FIELDS.name, validateName],

        [VALIDATION_FIELDS.phone, validatePhone],

        [VALIDATION_FIELDS.email, validateEmail],

        [VALIDATION_FIELDS.rt, validateRT],

        [VALIDATION_FIELDS.service, validateService],

        [VALIDATION_FIELDS.subject, validateSubject],

        [VALIDATION_FIELDS.description, validateDescription],

        [VALIDATION_FIELDS.location, validateLocation],

        [VALIDATION_FIELDS.attachment, validateAttachment],

        [VALIDATION_FIELDS.consent, validateConsent]

    ];

    fieldValidators.forEach(([selector, validator]) => {

        const element = getValidationElement(selector);

        if (!element) {
            return;
        }

        const eventName =
            element.type === "checkbox" ||
            element.type === "file" ||
            element.tagName === "SELECT"
                ? "change"
                : "blur";

        element.addEventListener(eventName, () => {

            validator();

            clearValidationFeedback();

        });

        if (
            element.type !== "checkbox" &&
            element.type !== "file" &&
            element.tagName !== "SELECT"
        ) {

            element.addEventListener("input", () => {

                if (element.classList.contains("is-invalid")) {
                    validator();
                }

            });

        }

    });

}


/* =========================================================
   19. FORM SUBMIT VALIDATION
========================================================= */

function initializeFormValidation() {

    const form = document.getElementById(
        "submissionForm"
    );

    if (!form) {
        return;
    }

    form.addEventListener("submit", event => {

        const isValid = validateSubmissionForm();

        if (!isValid) {

            event.preventDefault();

            event.stopImmediatePropagation();

        }

    }, true);

    initializeLiveValidation();

}


/* =========================================================
   20. PUBLIC VALIDATION API
========================================================= */

window.PanggilPakRTValidation = Object.freeze({

    validate: validateSubmissionForm,

    validateName: validateName,

    validatePhone: validatePhone,

    validateEmail: validateEmail,

    validateRT: validateRT,

    validateService: validateService,

    validateSubject: validateSubject,

    validateDescription: validateDescription,

    validateLocation: validateLocation,

    validateAttachment: validateAttachment,

    validateConsent: validateConsent,

    clearFieldError: clearFieldError,

    showFeedback: showValidationFeedback,

    clearFeedback: clearValidationFeedback

});


/* =========================================================
   21. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeFormValidation
);
