
/* =========================================================
   PANGGIL PAK RT
   STAFF AUTHENTICATION
   Version: 1.2.0

   Features:
   - Request Staff Login OTP
   - Verify Staff Login OTP
   - Validate Staff Session
   - Staff Logout
   - Session Storage Management
   - Get Staff Dashboard Data
   - Update Staff Submission Status
========================================================= */


/* =========================================================
   01. CONFIGURATION
========================================================= */

const STAFF_AUTH_CONFIG = Object.freeze({

    endpoint:
        window.PANGGIL_PAK_RT_CONFIG?.API_URL || "",

    timeout: 30000,

    storageKey: "panggilpakrt_staff_session",

    version: "1.2.0"

});


/* =========================================================
   02. RUNTIME STATE
========================================================= */

let staffAuthInitialized = false;


/* =========================================================
   03. GENERAL HELPERS
========================================================= */

function staffAuthNormalizeEmail(email) {

    return String(email || "")
        .trim()
        .toLowerCase();

}


function staffAuthValidateEmail(email) {

    const normalizedEmail =
        staffAuthNormalizeEmail(email);

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(normalizedEmail);

}


function staffAuthGetStorage() {

    try {

        return window.sessionStorage;

    } catch (error) {

        throw new Error(
            "Penyimpanan sesi tidak tersedia pada browser."
        );

    }

}


function staffAuthGetStoredToken() {

    try {

        const storage = staffAuthGetStorage();

        return storage.getItem(
            STAFF_AUTH_CONFIG.storageKey
        ) || "";

    } catch (error) {

        return "";

    }

}


function staffAuthSaveToken(token) {

    if (
        typeof token !== "string" ||
        token.length < 32 ||
        token.length > 128
    ) {

        throw new Error(
            "Token sesi yang diterima tidak valid."
        );

    }

    const storage = staffAuthGetStorage();

    storage.setItem(
        STAFF_AUTH_CONFIG.storageKey,
        token
    );

}


function staffAuthClearToken() {

    try {

        const storage = staffAuthGetStorage();

        storage.removeItem(
            STAFF_AUTH_CONFIG.storageKey
        );

    } catch (error) {

        console.error(
            "[PANGGIL PAK RT STAFF AUTH] Gagal membersihkan sesi lokal."
        );

    }

}


/* =========================================================
   04. API REQUEST
========================================================= */

async function staffAuthSendRequest(action, data = {}) {

    if (!STAFF_AUTH_CONFIG.endpoint) {

        throw new Error(
            "Endpoint API belum dikonfigurasi."
        );

    }

    let endpoint;

    try {

        endpoint = new URL(
            STAFF_AUTH_CONFIG.endpoint
        );

    } catch (error) {

        throw new Error(
            "Alamat API tidak valid."
        );

    }


    if (
        endpoint.protocol !== "https:" &&
        endpoint.hostname !== "localhost"
    ) {

        throw new Error(
            "Endpoint API harus menggunakan HTTPS."
        );

    }


    const controller = new AbortController();

    const timeoutId = setTimeout(
        function() {

            controller.abort();

        },
        STAFF_AUTH_CONFIG.timeout
    );


    try {

        const response = await fetch(
            STAFF_AUTH_CONFIG.endpoint,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body: JSON.stringify({

                    action: action,

                    version: STAFF_AUTH_CONFIG.version,

                    data: data

                }),

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


        if (
            !result ||
            typeof result !== "object"
        ) {

            throw new Error(
                "Format respons server tidak valid."
            );

        }


        if (result.success !== true) {

            throw new Error(
                result.message ||
                "Permintaan tidak berhasil."
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
                "Tidak dapat menghubungi server. Periksa koneksi internet."
            );

        }


        throw error;

    } finally {

        clearTimeout(timeoutId);

    }

}


/* =========================================================
   05. REQUEST LOGIN OTP
========================================================= */

async function requestStaffLoginCode(email) {

    const normalizedEmail =
        staffAuthNormalizeEmail(email);


    if (!staffAuthValidateEmail(normalizedEmail)) {

        throw new Error(
            "Format alamat email tidak valid."
        );

    }


    const result = await staffAuthSendRequest(

        "request_staff_login",

        {

            email: normalizedEmail

        }

    );


    return {

        success: true,

        message:
            result.message ||
            "Permintaan kode verifikasi berhasil diproses."

    };

}


/* =========================================================
   06. VERIFY LOGIN OTP
========================================================= */

async function verifyStaffLoginCode(email, code) {

    const normalizedEmail =
        staffAuthNormalizeEmail(email);

    const normalizedCode =
        String(code || "").trim();


    if (!staffAuthValidateEmail(normalizedEmail)) {

        throw new Error(
            "Format alamat email tidak valid."
        );

    }


    if (!/^\d{6}$/.test(normalizedCode)) {

        throw new Error(
            "Kode OTP harus terdiri dari 6 angka."
        );

    }


    const result = await staffAuthSendRequest(

        "verify_staff_login",

        {

            email: normalizedEmail,

            code: normalizedCode

        }

    );


    const responseData = result.data || {};

    const token = responseData.token || "";

    const staff = responseData.staff || null;


    if (
        !token ||
        !staff ||
        typeof staff !== "object"
    ) {

        throw new Error(
            "Respons login tidak memiliki informasi sesi yang lengkap."
        );

    }


    staffAuthSaveToken(token);


    return {

        success: true,

        message:
            result.message ||
            "Login petugas berhasil.",

        expiresIn: responseData.expires_in || 0,

        staff: staff

    };

}


/* =========================================================
   07. VALIDATE STAFF SESSION
========================================================= */

async function validateStaffSession() {

    const token = staffAuthGetStoredToken();


    if (!token) {

        return {

            success: false,

            authenticated: false,

            message: "Sesi petugas tidak ditemukan."

        };

    }


    try {

        const result = await staffAuthSendRequest(

            "validate_staff_session",

            {

                token: token

            }

        );


        const responseData = result.data || {};

        const staff = responseData.staff || null;


        if (
            responseData.authenticated !== true ||
            !staff
        ) {

            staffAuthClearToken();

            return {

                success: false,

                authenticated: false,

                message: "Sesi petugas tidak valid."

            };

        }


        return {

            success: true,

            authenticated: true,

            staff: staff,

            message:
                result.message ||
                "Sesi petugas masih aktif."

        };

    } catch (error) {

        return {

            success: false,

            authenticated: false,

            networkError: true,

            message:
                error.message ||
                "Validasi sesi gagal."

        };

    }

}


/* =========================================================
   08. GET STAFF DASHBOARD DATA
========================================================= */

async function getStaffDashboardData(page = 1, pageSize = 10) {

    const token = staffAuthGetStoredToken();


    if (!token) {

        throw new Error(
            "Sesi petugas tidak ditemukan. Silakan login kembali."
        );

    }


    const normalizedPage =
        Math.max(1, Math.floor(Number(page) || 1));

    const normalizedPageSize =
        Math.min(
            50,
            Math.max(1, Math.floor(Number(pageSize) || 10))
        );


    const result = await staffAuthSendRequest(

        "get_staff_dashboard",

        {

            token: token,

            page: normalizedPage,

            pageSize: normalizedPageSize

        }

    );


    if (
        !result.data ||
        typeof result.data !== "object"
    ) {

        throw new Error(
            "Data dashboard tidak ditemukan dalam respons server."
        );

    }


    return {

        success: true,

        message:
            result.message ||
            "Data dashboard berhasil dimuat.",

        data: result.data

    };

}


/* =========================================================
   09. UPDATE STAFF SUBMISSION STATUS
========================================================= */

async function updateStaffSubmissionStatus(
    submissionId,
    newStatus
) {

    // 01. Validate local session

    const token = staffAuthGetStoredToken();

    if (!token) {

        throw new Error(
            "Sesi petugas tidak ditemukan. Silakan login kembali."
        );

    }


    // 02. Validate submission ID

    const normalizedSubmissionId = String(
        submissionId || ""
    ).trim();

    if (!normalizedSubmissionId) {

        throw new Error(
            "ID pengajuan wajib disertakan."
        );

    }


    // 03. Validate new status

    const allowedStatuses = [

        "MENUNGGU",

        "DIPROSES",

        "PERLU_PERBAIKAN",

        "SELESAI"

    ];

    const normalizedStatus = String(
        newStatus || ""
    ).trim().toUpperCase();


    if (!allowedStatuses.includes(normalizedStatus)) {

        throw new Error(
            "Status pengajuan tidak valid."
        );

    }


    // 04. Send update request to backend

    const result = await staffAuthSendRequest(

        "update_staff_submission_status",

        {

            token: token,

            submission_id: normalizedSubmissionId,

            new_status: normalizedStatus

        }

    );


    // 05. Validate response data

    if (
        !result.data ||
        typeof result.data !== "object" ||
        Array.isArray(result.data)
    ) {

        throw new Error(
            "Respons perubahan status tidak valid."
        );

    }


    // 06. Return update result

    return {

        success: true,

        message:
            result.message ||
            "Status pengajuan berhasil diperbarui.",

        data: result.data

    };

}


/* =========================================================
   10. STAFF LOGOUT
========================================================= */

async function logoutStaff() {

    const token = staffAuthGetStoredToken();


    if (!token) {

        staffAuthClearToken();

        return {

            success: true,

            message: "Tidak ada sesi aktif."

        };

    }


    try {

        const result = await staffAuthSendRequest(

            "logout_staff",

            {

                token: token

            }

        );


        return {

            success: true,

            message:
                result.message ||
                "Sesi petugas telah diakhiri."

        };

    } finally {

        staffAuthClearToken();

    }

}


/* =========================================================
   11. SESSION INFORMATION
========================================================= */

function isStaffLoggedInLocally() {

    return Boolean(
        staffAuthGetStoredToken()
    );

}


function clearStaffLocalSession() {

    staffAuthClearToken();

}


/* =========================================================
   12. INITIALIZATION
========================================================= */

function initializeStaffAuth() {

    if (staffAuthInitialized) {

        return;

    }

    staffAuthInitialized = true;

    console.info(
        "[PANGGIL PAK RT] Staff authentication initialized."
    );

}


/* =========================================================
   13. PUBLIC AUTHENTICATION API
========================================================= */

window.PanggilPakRTStaffAuth = Object.freeze({

    initialize: initializeStaffAuth,

    requestLoginCode: requestStaffLoginCode,

    verifyLoginCode: verifyStaffLoginCode,

    validateSession: validateStaffSession,

    getDashboardData: getStaffDashboardData,

    updateSubmissionStatus: updateStaffSubmissionStatus,

    logout: logoutStaff,

    isLoggedInLocally: isStaffLoggedInLocally,

    clearLocalSession: clearStaffLocalSession

});


/* =========================================================
   14. AUTO INITIALIZATION
========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeStaffAuth
    );

} else {

    initializeStaffAuth();

}


/* =========================================================
   END OF STAFF AUTHENTICATION
   Version: 1.2.0
========================================================= */
