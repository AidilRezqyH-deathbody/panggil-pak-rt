
/* ==========================================
   PANGGIL PAK RT
   STATUS VERIFICATION SYSTEM
   Version: 1.1.0
========================================== */


/* ==========================================
   01. API CONFIGURATION
========================================== */

const STATUS_API_CONFIG = Object.freeze({

    endpoint: window.PANGGIL_PAK_RT_CONFIG?.API_URL || "",

    timeout: 30000,

    version: "1.0",

    codeLength: 6,

    actions: {
        requestVerification: "request_status_verification",
        verifyStatus: "verify_status"
    }

});


/* ==========================================
   02. RUNTIME STATE
========================================== */

let statusIsInitialized = false;
let statusRequestInProgress = false;
let statusVerificationInProgress = false;

// Hanya disimpan selama halaman masih terbuka.
let pendingSubmissionId = "";


/* ==========================================
   03. DOM HELPERS
========================================== */

function getStatusElement(root, selectors) {

    if (!root) return null;

    for (const selector of selectors) {

        const element = root.querySelector(selector);

        if (element) return element;

    }

    return null;

}


function getStatusFormValue(form, selectors) {

    const element = getStatusElement(form, selectors);

    return element
        ? String(element.value || "").trim()
        : "";

}


function getStatusForms() {

    return {

        requestForm: document.querySelector(
            "[data-status-request-form], #statusRequestForm, #requestStatusForm, #cekStatusForm, #statusForm"
        ),

        verificationForm: document.querySelector(
            "[data-status-verify-form], #statusVerificationForm, #verifyStatusForm, #verificationForm"
        )

    };

}


/* ==========================================
   04. FEEDBACK
========================================== */

function showStatusFeedback(form, message, type = "error") {

    const feedback = getStatusElement(form, [
        "[data-status-feedback]",
        "#statusFeedback",
        "#verificationFeedback",
        ".status-feedback"
    ]) || document.querySelector("[data-status-global-feedback]");

    if (!feedback) {

        console[type === "error" ? "error" : "log"](message);

        return;

    }

    feedback.textContent = message;
    feedback.className = "status-feedback " + type;
    feedback.hidden = false;

    feedback.setAttribute(
        "role",
        type === "error" ? "alert" : "status"
    );

    feedback.setAttribute(
        "aria-live",
        type === "error" ? "assertive" : "polite"
    );

}


function clearStatusFeedback(form) {

    if (!form) return;

    const feedback = getStatusElement(form, [
        "[data-status-feedback]",
        "#statusFeedback",
        "#verificationFeedback",
        ".status-feedback"
    ]);

    if (!feedback) return;

    feedback.textContent = "";
    feedback.className = "status-feedback";
    feedback.hidden = true;

}


/* ==========================================
   05. BUTTON LOADING
========================================== */

function setStatusButtonLoading(form, loading) {

    if (!form) return;

    const button = form.querySelector(
        'button[type="submit"], input[type="submit"]'
    );

    if (!button) return;

    if (loading) {

        if (button.dataset.statusOriginalHTML === undefined) {

            button.dataset.statusOriginalHTML =
                button.innerHTML;

            button.dataset.statusOriginalValue =
                button.value || "";

            button.dataset.statusWasDisabled =
                String(button.disabled);

        }

        button.disabled = true;
        button.setAttribute("aria-busy", "true");

        if (button.tagName === "INPUT") {

            button.value = "Memproses...";

        } else {

            button.innerHTML = "Memproses...";

        }

        return;

    }

    button.removeAttribute("aria-busy");

    if (button.dataset.statusOriginalHTML !== undefined) {

        if (button.tagName === "INPUT") {

            button.value = button.dataset.statusOriginalValue;

        } else {

            button.innerHTML = button.dataset.statusOriginalHTML;

            if (window.lucide) {
                window.lucide.createIcons();
            }

        }

        button.disabled =
            button.dataset.statusWasDisabled === "true";

        delete button.dataset.statusOriginalHTML;
        delete button.dataset.statusOriginalValue;
        delete button.dataset.statusWasDisabled;

    }

}


/* ==========================================
   06. API ENDPOINT VALIDATION
========================================== */

function validateStatusAPIEndpoint() {

    if (!STATUS_API_CONFIG.endpoint) {

        throw new Error(
            "Alamat API belum dikonfigurasi. Periksa API_URL pada public-config.js."
        );

    }

    let endpoint;

    try {

        endpoint = new URL(STATUS_API_CONFIG.endpoint);

    } catch (error) {

        throw new Error(
            "Alamat API tidak valid. Periksa konfigurasi API_URL."
        );

    }

    if (
        endpoint.protocol !== "https:" &&
        !(
            endpoint.protocol === "http:" &&
            endpoint.hostname === "localhost"
        )
    ) {

        throw new Error(
            "Endpoint API harus menggunakan koneksi HTTPS."
        );

    }

    return endpoint;

}


/* ==========================================
   07. API REQUEST
========================================== */

async function sendStatusAPIRequest(payload) {

    validateStatusAPIEndpoint();

    const controller = new AbortController();

    const timeoutId = setTimeout(
        () => controller.abort(),
        STATUS_API_CONFIG.timeout
    );

    try {

        const response = await fetch(
            STATUS_API_CONFIG.endpoint,
            {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
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
                result?.message ||
                "Server gagal memproses permintaan."
            );

        }

        if (!result || result.success !== true) {

            throw new Error(
                result?.message ||
                "Permintaan tidak berhasil diproses."
            );

        }

        return result;

    } catch (error) {

        if (error.name === "AbortError") {

            throw new Error(
                "Waktu permintaan habis. Silakan coba kembali."
            );

        }

        if (error instanceof TypeError) {

            throw new Error(
                "Tidak dapat menghubungi server. Periksa koneksi internet dan konfigurasi API."
            );

        }

        throw error;

    } finally {

        clearTimeout(timeoutId);

    }

}


/* ==========================================
   08. API PAYLOAD
========================================== */

function buildStatusRequestPayload(submissionId, email) {

    return {

        action: STATUS_API_CONFIG.actions.requestVerification,

        version: STATUS_API_CONFIG.version,

        data: {
            submission_id: submissionId,
            email: email.toLowerCase()
        }

    };

}


function buildStatusVerificationPayload(submissionId, code) {

    return {

        action: STATUS_API_CONFIG.actions.verifyStatus,

        version: STATUS_API_CONFIG.version,

        data: {
            submission_id: submissionId,
            code: code
        }

    };

}


/* ==========================================
   09. INPUT VALIDATION
========================================== */

function validateStatusRequestInput(submissionId, email) {

    if (!submissionId) {

        return {
            valid: false,
            message: "Nomor pengajuan wajib diisi."
        };

    }

    if (!/^PPR-\d{4}-\d{6}$/i.test(submissionId)) {

        return {
            valid: false,
            message: "Format nomor pengajuan tidak sesuai. Contoh: PPR-2026-000001."
        };

    }

    if (!email) {

        return {
            valid: false,
            message: "Alamat email wajib diisi."
        };

    }

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

        return {
            valid: false,
            message: "Format alamat email tidak valid."
        };

    }

    return {
        valid: true,
        message: ""
    };

}


function validateStatusVerificationInput(submissionId, code) {

    if (!submissionId) {

        return {
            valid: false,
            message: "Nomor pengajuan tidak ditemukan. Silakan minta kode verifikasi kembali."
        };

    }

    if (!/^PPR-\d{4}-\d{6}$/i.test(submissionId)) {

        return {
            valid: false,
            message: "Format nomor pengajuan tidak valid."
        };

    }

    if (!code) {

        return {
            valid: false,
            message: "Kode verifikasi wajib diisi."
        };

    }

    const pattern = new RegExp(
        "^\\d{" + STATUS_API_CONFIG.codeLength + "}$"
    );

    if (!pattern.test(code)) {

        return {
            valid: false,
            message: "Kode verifikasi harus terdiri dari enam angka."
        };

    }

    return {
        valid: true,
        message: ""
    };

}


/* ==========================================
   10. SECTION VISIBILITY
========================================== */

function showStatusVerificationSection() {

    const section = document.querySelector(
        "[data-status-verification-section], #statusVerificationSection, #verificationSection"
    );

    if (!section) return;

    section.hidden = false;

    section.setAttribute("aria-hidden", "false");

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function hideStatusVerificationSection() {

    const section = document.querySelector(
        "[data-status-verification-section], #statusVerificationSection, #verificationSection"
    );

    if (!section) return;

    section.hidden = true;

    section.setAttribute("aria-hidden", "true");

}


function hideStatusResult() {

    const container = document.querySelector(
        "[data-status-result], #statusResult, #submissionStatusResult"
    );

    if (!container) return;

    container.hidden = true;

    container.setAttribute("aria-hidden", "true");

}


/* ==========================================
   11. REQUEST VERIFICATION CODE
========================================== */

async function handleStatusVerificationRequest(form) {

    if (!form || statusRequestInProgress) return null;

    statusRequestInProgress = true;

    clearStatusFeedback(form);

    setStatusButtonLoading(form, true);

    try {

        const submissionId = getStatusFormValue(form, [
            "#submissionId",
            "#statusSubmissionId",
            "#nomorPengajuan",
            '[name="submission_id"]',
            '[name="nomor_pengajuan"]'
        ]).toUpperCase();

        const email = getStatusFormValue(form, [
            "#statusEmail",
            "#guestEmail",
            "#verificationEmail",
            '[name="email"]'
        ]).toLowerCase();

        const validation = validateStatusRequestInput(
            submissionId,
            email
        );

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        showStatusFeedback(
            form,
            "Sedang memeriksa data pengajuan dan mengirim kode verifikasi...",
            "info"
        );

        const result = await sendStatusAPIRequest(
            buildStatusRequestPayload(submissionId, email)
        );

        // Simpan ID sementara hanya di memori.
        pendingSubmissionId = submissionId;

        const verificationForm =
            getStatusForms().verificationForm;

        if (verificationForm) {

            const hiddenInput = getStatusElement(
                verificationForm,
                [
                    "#verificationSubmissionId",
                    "#verifySubmissionId",
                    '[name="submission_id"]'
                ]
            );

            if (hiddenInput) {
                hiddenInput.value = submissionId;
            }

            const codeInput = getStatusElement(
                verificationForm,
                [
                    "#verificationCode",
                    "#statusCode",
                    "#verification-code",
                    '[name="code"]',
                    '[name="verification_code"]'
                ]
            );

            // Hapus kode lama jika meminta kode baru.
            if (codeInput) {
                codeInput.value = "";
            }

            clearStatusFeedback(verificationForm);

        }

        hideStatusResult();

        showStatusVerificationSection();

        showStatusFeedback(
            form,
            result.message ||
            "Permintaan kode berhasil diproses. Silakan periksa email Anda.",
            "success"
        );

        if (verificationForm) {

            const codeInput = getStatusElement(
                verificationForm,
                [
                    "#verificationCode",
                    "#statusCode",
                    "#verification-code",
                    '[name="code"]',
                    '[name="verification_code"]'
                ]
            );

            if (codeInput) {
                codeInput.focus();
            }

        }

        return result;

    } catch (error) {

        console.error(
            "[PANGGIL PAK RT STATUS REQUEST]",
            error
        );

        showStatusFeedback(
            form,
            error.message || "Permintaan kode verifikasi gagal diproses.",
            "error"
        );

        return null;

    } finally {

        statusRequestInProgress = false;

        setStatusButtonLoading(form, false);

    }

}


/* ==========================================
   12. STATUS DATA HELPERS
========================================== */

function getPublicStatusValue(data, keys) {

    if (!data || typeof data !== "object") return "";

    for (const key of keys) {

        const value = data[key];

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {

            return String(value).trim();

        }

    }

    return "";

}


function formatStatusDate(value) {

    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return new Intl.DateTimeFormat(
        "id-ID",
        {
            dateStyle: "long",
            timeStyle: "short"
        }
    ).format(date);

}


function getStatusLabel(status) {

    const normalized = String(status || "")
        .trim()
        .toUpperCase();

    const labels = {

        MENUNGGU: "Menunggu",

        DIPROSES: "Sedang Diproses",

        SELESAI: "Selesai",

        PERLU_PERBAIKAN: "Perlu Perbaikan"

    };

    return labels[normalized] || normalized || "-";

}


/* ==========================================
   13. RENDER PUBLIC STATUS
========================================== */

function renderPublicSubmissionStatus(data) {

    if (
        !data ||
        typeof data !== "object" ||
        Array.isArray(data)
    ) {

        throw new Error(
            "Data status pengajuan tidak tersedia."
        );

    }

    const container = document.querySelector(
        "[data-status-result], #statusResult, #submissionStatusResult"
    );

    if (!container) {

        throw new Error(
            "Elemen hasil status tidak ditemukan."
        );

    }

    const rawStatus = getPublicStatusValue(
        data,
        ["status"]
    );

    if (!rawStatus) {

        throw new Error(
            "Informasi status belum tersedia pada respons server."
        );

    }

    const publicFields = [

        {
            label: "Nomor Pengajuan",
            value: getPublicStatusValue(
                data,
                ["submission_id", "nomor_pengajuan"]
            )
        },

        {
            label: "Layanan",
            value: getPublicStatusValue(
                data,
                ["layanan", "service_name", "service"]
            )
        },

        {
            label: "Perihal",
            value: getPublicStatusValue(
                data,
                ["perihal", "subject"]
            )
        },

        {
            label: "Status",
            value: getStatusLabel(rawStatus)
        },

        {
            label: "Tanggal Pengajuan",
            value: formatStatusDate(
                getPublicStatusValue(
                    data,
                    ["created_at", "tanggal_pengajuan"]
                )
            )
        },

        {
            label: "Terakhir Diperbarui",
            value: formatStatusDate(
                getPublicStatusValue(
                    data,
                    ["updated_at", "tanggal_diperbarui"]
                )
            )
        }

    ];

    const contentTarget = getStatusElement(
        container,
        ["[data-status-result-content]"]
    ) || container;

    contentTarget.replaceChildren();

    const heading = document.createElement("h3");

    heading.textContent = "Informasi Pengajuan";

    contentTarget.appendChild(heading);

    const introduction = document.createElement("p");

    introduction.textContent =
        "Berikut adalah informasi status pengajuan Anda.";

    contentTarget.appendChild(introduction);

    const definitionList = document.createElement("dl");

    definitionList.className = "status-result-list";

    publicFields.forEach((field) => {

        if (!field.value) return;

        const wrapper = document.createElement("div");

        wrapper.className = "status-result-item";

        const term = document.createElement("dt");

        term.textContent = field.label;

        const description = document.createElement("dd");

        description.textContent = field.value;

        if (field.label === "Status") {

            description.classList.add("status-value");

            description.dataset.status = rawStatus.toLowerCase();

        }

        wrapper.appendChild(term);

        wrapper.appendChild(description);

        definitionList.appendChild(wrapper);

    });

    contentTarget.appendChild(definitionList);

    container.hidden = false;

    container.setAttribute("aria-hidden", "false");

    container.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ==========================================
   14. VERIFY STATUS CODE
========================================== */

async function handleStatusCodeVerification(form) {

    if (!form || statusVerificationInProgress) return null;

    statusVerificationInProgress = true;

    clearStatusFeedback(form);

    setStatusButtonLoading(form, true);

    try {

        const enteredSubmissionId = getStatusFormValue(
            form,
            [
                "#verificationSubmissionId",
                "#verifySubmissionId",
                "#submissionId",
                '[name="submission_id"]'
            ]
        ).toUpperCase();

        const submissionId =
            enteredSubmissionId || pendingSubmissionId;

        const code = getStatusFormValue(
            form,
            [
                "#verificationCode",
                "#statusCode",
                "#verification-code",
                '[name="code"]',
                '[name="verification_code"]'
            ]
        );

        if (
            pendingSubmissionId &&
            enteredSubmissionId &&
            enteredSubmissionId !== pendingSubmissionId
        ) {

            throw new Error(
                "Nomor pengajuan berbeda dengan permintaan kode verifikasi."
            );

        }

        const validation = validateStatusVerificationInput(
            submissionId,
            code
        );

        if (!validation.valid) {
            throw new Error(validation.message);
        }

        showStatusFeedback(
            form,
            "Sedang memverifikasi kode...",
            "info"
        );

        const result = await sendStatusAPIRequest(
            buildStatusVerificationPayload(submissionId, code)
        );

        const statusData =
            result.data ||
            result.statusData ||
            result.submission ||
            null;

        if (!statusData) {

            throw new Error(
                "Verifikasi berhasil, tetapi informasi status tidak ditemukan."
            );

        }

        renderPublicSubmissionStatus(statusData);

        showStatusFeedback(
            form,
            result.message ||
            "Verifikasi berhasil. Status pengajuan berhasil ditampilkan.",
            "success"
        );

        const codeInput = getStatusElement(
            form,
            [
                "#verificationCode",
                "#statusCode",
                "#verification-code",
                '[name="code"]',
                '[name="verification_code"]'
            ]
        );

        if (codeInput) {
            codeInput.value = "";
        }

        pendingSubmissionId = "";

        return result;

    } catch (error) {

        console.error(
            "[PANGGIL PAK RT STATUS VERIFICATION]",
            error
        );

        showStatusFeedback(
            form,
            error.message || "Kode verifikasi tidak dapat diproses.",
            "error"
        );

        return null;

    } finally {

        statusVerificationInProgress = false;

        setStatusButtonLoading(form, false);

    }

}


/* ==========================================
   15. RESET WORKFLOW
========================================== */

function resetStatusWorkflow() {

    // Jangan mereset state ketika request masih berjalan.
    if (
        statusRequestInProgress ||
        statusVerificationInProgress
    ) {

        return false;

    }

    pendingSubmissionId = "";

    const forms = getStatusForms();

    if (forms.requestForm) {

        forms.requestForm.reset();

        clearStatusFeedback(forms.requestForm);

    }

    if (forms.verificationForm) {

        forms.verificationForm.reset();

        clearStatusFeedback(forms.verificationForm);

    }

    hideStatusVerificationSection();

    hideStatusResult();

    const requestInput = document.querySelector("#submissionId");

    if (requestInput) {
        requestInput.focus();
    }

    return true;

}


/* ==========================================
   16. FORM INITIALIZATION
========================================== */

function initializeStatusRequestForm(form) {

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }

        handleStatusVerificationRequest(form);

    });

}


function initializeStatusVerificationForm(form) {

    if (!form) return;

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }

        handleStatusCodeVerification(form);

    });

    const codeInput = getStatusElement(
        form,
        [
            "#verificationCode",
            "#statusCode",
            "#verification-code",
            '[name="code"]',
            '[name="verification_code"]'
        ]
    );

    if (codeInput) {

        codeInput.setAttribute("inputmode", "numeric");

        codeInput.setAttribute("autocomplete", "one-time-code");

        codeInput.setAttribute(
            "maxlength",
            String(STATUS_API_CONFIG.codeLength)
        );

        codeInput.addEventListener("input", function () {

            this.value = this.value
                .replace(/\D/g, "")
                .slice(0, STATUS_API_CONFIG.codeLength);

        });

    }

}


/* ==========================================
   17. RESET BUTTON
========================================== */

function initializeStatusResetButton() {

    const buttons = document.querySelectorAll(
        "[data-status-reset], #resetStatusButton"
    );

    buttons.forEach((button) => {

        button.addEventListener("click", function () {

            const resetSuccessful = resetStatusWorkflow();

            if (!resetSuccessful) {

                console.info(
                    "[PANGGIL PAK RT] Proses masih berjalan."
                );

            }

        });

    });

}


/* ==========================================
   18. MAIN INITIALIZATION
========================================== */

function initializeStatusPage() {

    if (statusIsInitialized) return;

    const forms = getStatusForms();

    if (
        !forms.requestForm &&
        !forms.verificationForm
    ) {

        console.info(
            "[PANGGIL PAK RT] Formulir pemeriksaan status tidak ditemukan."
        );

        return;

    }

    initializeStatusRequestForm(forms.requestForm);

    initializeStatusVerificationForm(forms.verificationForm);

    initializeStatusResetButton();

    hideStatusVerificationSection();

    hideStatusResult();

    statusIsInitialized = true;

    console.info(
        "[PANGGIL PAK RT] Status system initialized."
    );

}


/* ==========================================
   19. PUBLIC API
========================================== */

window.PanggilPakRTStatus = Object.freeze({

    initialize: initializeStatusPage,

    requestVerification: handleStatusVerificationRequest,

    verify: handleStatusCodeVerification,

    send: sendStatusAPIRequest,

    buildRequestPayload: buildStatusRequestPayload,

    buildVerificationPayload: buildStatusVerificationPayload,

    render: renderPublicSubmissionStatus,

    reset: resetStatusWorkflow

});


/* ==========================================
   20. DOM INITIALIZATION
========================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStatusPage
    );

} else {

    initializeStatusPage();

}
