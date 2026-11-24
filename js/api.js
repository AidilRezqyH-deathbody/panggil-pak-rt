
/* ==========================================
   PANGGIL PAK RT
   API INTEGRATION
   Version: 1.1.0
========================================== */


/* ==========================================
   01. API CONFIGURATION
========================================== */

const API_CONFIG = Object.freeze({

    endpoint:
        window.PANGGIL_PAK_RT_CONFIG?.API_URL || "",

    timeout: 30000,

    maxFileSize: 5 * 1024 * 1024,

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
    ],

    action: "submit",

    version: "1.0"

});


/* ==========================================
   02. API RUNTIME STATE
========================================== */

let apiIsInitialized = false;
let apiIsSubmitting = false;


/* ==========================================
   03. GENERAL HELPERS
========================================== */

function getAPIElement(form, selectors) {

    for (const selector of selectors) {

        const element = form.querySelector(selector);

        if (element) {
            return element;
        }

    }

    return null;

}


function getAPIFieldValue(form, selectors) {

    const element = getAPIElement(form, selectors);

    if (!element) {
        return "";
    }

    return String(element.value || "").trim();

}


function getAPIFileExtension(filename) {

    const parts = String(filename || "").split(".");

    return parts.length > 1
        ? parts.pop().toLowerCase()
        : "";

}


function getAPIMimeType(file) {

    if (file.type) {
        return file.type;
    }

    const extension = getAPIFileExtension(file.name);

    const mimeTypes = {
        pdf: "application/pdf",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png"
    };

    return mimeTypes[extension] || "";

}


/* ==========================================
   04. FORM DATA COLLECTION
========================================== */

function collectSubmissionData(form) {

    if (!form) {
        throw new Error(
            "Formulir pengajuan tidak ditemukan."
        );
    }

    const consentElement = getAPIElement(form, [
        "#guestConsent",
        "#consent",
        '[name="persetujuan"]',
        '[name="consent"]'
    ]);

    const attachmentElement = getAPIElement(form, [
        "#submissionAttachment",
        '[name="lampiran"]',
        '[name="attachment"]'
    ]);

    const data = {

        nama: getAPIFieldValue(form, [
            "#guestName",
            '[name="nama"]',
            '[name="name"]'
        ]),

        nomor_telepon: getAPIFieldValue(form, [
            "#guestPhone",
            '[name="nomor_telepon"]',
            '[name="telepon"]',
            '[name="phone"]'
        ]),

        email: getAPIFieldValue(form, [
            "#guestEmail",
            '[name="email"]'
        ]).toLowerCase(),

        rt: getAPIFieldValue(form, [
            "#guestRT",
            '[name="rt"]'
        ]),

        layanan: getAPIFieldValue(form, [
            "#serviceSelect",
            "#serviceCategory",
            "#jenisLayanan",
            '[name="layanan"]'
        ]),

        perihal: getAPIFieldValue(form, [
            "#submissionSubject",
            "#guestSubject",
            '[name="perihal"]',
            '[name="subject"]'
        ]),

        deskripsi: getAPIFieldValue(form, [
            "#submissionDescription",
            "#guestDescription",
            '[name="deskripsi"]',
            '[name="description"]'
        ]),

        lokasi: getAPIFieldValue(form, [
            "#submissionLocation",
            "#guestLocation",
            '[name="lokasi"]',
            '[name="location"]'
        ]),

        persetujuan: Boolean(
            consentElement?.checked
        ),

        attachment: null

    };

    return {
        data,
        attachmentElement
    };

}


/* ==========================================
   05. ATTACHMENT VALIDATION
========================================== */

function validateAPIAttachment(file) {

    if (!file) {
        return {
            valid: true,
            message: ""
        };
    }

    const extension = getAPIFileExtension(file.name);

    if (
        !API_CONFIG.allowedExtensions.includes(extension)
    ) {

        return {
            valid: false,
            message:
                "Format lampiran harus PDF, JPG, JPEG, atau PNG."
        };

    }

    if (file.size > API_CONFIG.maxFileSize) {

        return {
            valid: false,
            message:
                "Ukuran lampiran tidak boleh melebihi 5 MB."
        };

    }

    if (file.size === 0) {

        return {
            valid: false,
            message:
                "File lampiran kosong dan tidak dapat digunakan."
        };

    }

    const mimeType = getAPIMimeType(file);

    if (
        !API_CONFIG.allowedMimeTypes.includes(mimeType)
    ) {

        return {
            valid: false,
            message:
                "Jenis file lampiran tidak dikenali."
        };

    }

    return {
        valid: true,
        message: ""
    };

}


/* ==========================================
   06. FILE TO BASE64
========================================== */

function convertFileToBase64(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function () {

            const result = reader.result;

            if (
                typeof result !== "string" ||
                !result.includes(",")
            ) {

                reject(
                    new Error(
                        "File tidak dapat diproses menjadi Base64."
                    )
                );

                return;

            }

            const base64Data = result.split(",")[1];

            resolve({
                name: file.name,
                mimeType: getAPIMimeType(file),
                size: file.size,
                data: base64Data
            });

        };


        reader.onerror = function () {

            reject(
                new Error(
                    "Terjadi kesalahan ketika membaca lampiran."
                )
            );

        };


        reader.onabort = function () {

            reject(
                new Error(
                    "Pembacaan lampiran dibatalkan."
                )
            );

        };


        reader.readAsDataURL(file);

    });

}


/* ==========================================
   07. BUILD SUBMISSION PAYLOAD
========================================== */

async function buildSubmissionPayload(form) {

    const collected = collectSubmissionData(form);

    const data = collected.data;

    const attachmentElement =
        collected.attachmentElement;

    const file = attachmentElement?.files?.[0] || null;


    if (file) {

        const validation =
            validateAPIAttachment(file);

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        data.attachment =
            await convertFileToBase64(file);

    }


    return {

        action: API_CONFIG.action,

        version: API_CONFIG.version,

        data: data

    };

}


/* ==========================================
   08. API REQUEST
========================================== */

async function sendAPIRequest(payload) {

    if (!API_CONFIG.endpoint) {

        throw new Error(
            "Alamat API belum dikonfigurasi. " +
            "Pengiriman belum dapat dilakukan."
        );

    }


    let endpoint;

    try {

        endpoint = new URL(API_CONFIG.endpoint);

    } catch (error) {

        throw new Error(
            "Alamat API tidak valid. Periksa konfigurasi API_URL."
        );

    }


    if (
        endpoint.protocol !== "https:" &&
        endpoint.hostname !== "localhost"
    ) {

        throw new Error(
            "Endpoint API harus menggunakan koneksi HTTPS."
        );

    }


    const controller = new AbortController();

    const timeoutId = setTimeout(() => {

        controller.abort();

    }, API_CONFIG.timeout);


    try {

        const response = await fetch(
            API_CONFIG.endpoint,
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(payload),

                redirect: "follow",

                credentials: "omit",

                signal: controller.signal

            }
        );


        const responseText = await response.text();

        let result;

        try {

            result = JSON.parse(responseText);

        } catch (error) {

            throw new Error(
                "Server memberikan respons yang tidak dapat dibaca."
            );

        }


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Server gagal memproses permintaan."
            );

        }


        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result?.message ||
                result?.error ||
                "Pengajuan tidak berhasil diproses."
            );

        }


        return result;

    } catch (error) {

        if (error.name === "AbortError") {

            throw new Error(
                "Waktu pengiriman habis. Silakan coba kembali."
            );

        }


        if (
            error instanceof TypeError
        ) {

            throw new Error(
                "Tidak dapat menghubungi server. " +
                "Periksa koneksi internet dan konfigurasi API."
            );

        }


        throw error;

    } finally {

        clearTimeout(timeoutId);

    }

}


/* ==========================================
   09. FORM FEEDBACK
========================================== */

function showAPIFeedback(message, type = "error") {

    const feedback = document.querySelector(
        "#formFeedback, " +
        "#submissionFeedback, " +
        "[data-form-feedback]"
    );

    if (!feedback) {

        console[type === "error" ? "error" : "log"](
            message
        );

        return;

    }


    feedback.textContent = message;

    feedback.className =
        "form-feedback " + type;

    feedback.hidden = false;

    feedback.setAttribute(
        "role",
        type === "error" ? "alert" : "status"
    );


    feedback.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


function clearAPIFeedback() {

    const feedback = document.querySelector(
        "#formFeedback, " +
        "#submissionFeedback, " +
        "[data-form-feedback]"
    );

    if (!feedback) {
        return;
    }

    feedback.textContent = "";

    feedback.hidden = true;

}


/* ==========================================
   10. SUBMIT BUTTON STATE
========================================== */

function setAPISubmitButtonState(form, loading) {

    const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    if (!submitButton) {
        return;
    }


    if (loading) {

        submitButton.dataset.apiOriginalText =
            submitButton.tagName === "INPUT"
                ? submitButton.value
                : submitButton.textContent;

        submitButton.disabled = true;

        if (submitButton.tagName === "INPUT") {

            submitButton.value = "Mengirim...";

        } else {

            submitButton.textContent = "Mengirim...";

        }

        submitButton.setAttribute(
            "aria-busy",
            "true"
        );

        return;

    }


    submitButton.disabled = false;

    submitButton.removeAttribute("aria-busy");


    const originalText =
        submitButton.dataset.apiOriginalText;

    if (originalText !== undefined) {

        if (submitButton.tagName === "INPUT") {

            submitButton.value = originalText;

        } else {

            submitButton.textContent = originalText;

        }

        delete submitButton.dataset.apiOriginalText;

    }

}


/* ==========================================
   11. SUBMISSION HANDLER
========================================== */

async function handleAPISubmission(form) {

    if (!form || apiIsSubmitting) {
        return;
    }


    apiIsSubmitting = true;

    clearAPIFeedback();

    setAPISubmitButtonState(form, true);


    try {

        if (!form.checkValidity()) {

            form.reportValidity();

            throw new Error(
                "Mohon periksa kembali data formulir."
            );

        }


        showAPIFeedback(
            "Sedang mempersiapkan data pengajuan...",
            "info"
        );


        const payload =
            await buildSubmissionPayload(form);


        showAPIFeedback(
            "Sedang mengirim pengajuan ke server...",
            "info"
        );


        const result =
            await sendAPIRequest(payload);


        const submissionId =
            result.submission_id ||
            result.data?.submission_id ||
            result.nomor_pengajuan ||
            "";


        let successMessage =
            result.message ||
            "Pengajuan berhasil dikirim.";


        if (submissionId) {

            successMessage +=
                " Nomor pengajuan: " + submissionId + ".";

        }


        showAPIFeedback(
            successMessage,
            "success"
        );


        form.dispatchEvent(
            new CustomEvent(
                "panggilpakrt:submission-success",
                {
                    bubbles: true,
                    detail: {
                        result: result,
                        submissionId: submissionId
                    }
                }
            )
        );


        console.info(
            "[PANGGIL PAK RT] Pengajuan berhasil dikirim."
        );


        return result;

    } catch (error) {

        console.error(
            "[PANGGIL PAK RT API]",
            error
        );


        showAPIFeedback(
            error.message ||
            "Terjadi kesalahan ketika mengirim pengajuan.",
            "error"
        );


        return null;

    } finally {

        apiIsSubmitting = false;

        setAPISubmitButtonState(form, false);

    }

}


/* ==========================================
   12. API EVENT LISTENER
========================================== */

function initializeAPI() {

    if (apiIsInitialized) {
        return;
    }


    const submissionForm = document.querySelector(
        "#submissionForm, " +
        "#pengajuanForm, " +
        "form[data-submission-form]"
    );


    if (!submissionForm) {

        console.info(
            "[PANGGIL PAK RT] Formulir pengajuan tidak ditemukan pada halaman ini."
        );

        return;

    }


    document.addEventListener(
        "panggilpakrt:form-submit",
        function (event) {

            const form =
                event.detail?.form ||
                submissionForm;


            if (form !== submissionForm) {
                return;
            }


            handleAPISubmission(form);

        }
    );


    apiIsInitialized = true;


    console.info(
        "[PANGGIL PAK RT] API integration initialized."
    );

}


/* ==========================================
   13. PUBLIC API
========================================== */

window.PanggilPakRTAPI = Object.freeze({

    initialize: initializeAPI,

    send: sendAPIRequest,

    buildPayload: buildSubmissionPayload,

    collectData: collectSubmissionData,

    validateAttachment: validateAPIAttachment

});


/* ==========================================
   14. INITIALIZATION
========================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAPI
    );

} else {

    initializeAPI();

}
