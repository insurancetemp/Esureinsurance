// ==============================
// TEMP COVER CUSTOMER PORTAL
// APP.JS - PART 1
// ==============================

// ---------------------------------
// SUPABASE CONFIG
// ---------------------------------

const SUPABASE_URL = "https://lvjdaizpaqjnchjvrsni.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fnag8tkEEClWTLVR7fL1sQ_3_rbAzEc";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ---------------------------------
// CHECK USER SESSION
// ---------------------------------

document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) {

        window.location.href = "login.html";
        return;

    }

    loadProfile(user.id);
    loadPolicy(user.id);
    loadActivePolicyCount(user.id);

});


// ---------------------------------
// LOAD CUSTOMER PROFILE
// ---------------------------------

async function loadProfile(userId) {

    const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {

        console.log(error);
        return;

    }

    document.getElementById("profileEmail").textContent =
        data.email || "";

    document.getElementById("profileName").textContent =
        data.full_name || "";

    document.getElementById("profileAddress").textContent =
        data.address || "";

    document.getElementById("profilePhone").textContent =
        data.phone || "";

    document.getElementById("profileLicence").textContent =
        data.driving_license || "";

}


// ---------------------------------
// LOAD ACTIVE POLICY
// ---------------------------------

async function loadPolicy(userId) {

    const { data, error } = await supabaseClient
        .from("policies")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "ACTIVE")
        .single();

    if (error) {

        console.log(error);
        return;

    }

    document.getElementById("vehicleRegistration").textContent =
        data.registration;

    document.getElementById("vehicleName").textContent =
        data.make + " " + data.model;

    document.getElementById("vehicleDetails").textContent =
    data.year + (data.colour ? " " + data.colour : "");

    document.getElementById("coverType").textContent =
        data.cover_type;

    startCountdown(data.expiry_time);

}

// ---------------------------------
// LIVE COUNTDOWN TIMER
// ---------------------------------

let countdownInterval = null;

function startCountdown(expiryTime) {

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {

        const expiry = new Date(expiryTime);
        const now = new Date();

        const difference = expiry - now;

        if (difference <= 0) {

            document.getElementById("timeRemaining").textContent =
                "Policy Expired";

            const badge = document.querySelector(".active-status");

            if (badge) {
                badge.textContent = "EXPIRED";
            }

            clearInterval(countdownInterval);
            return;

        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        document.getElementById("timeRemaining").textContent =
            hours + "hr " + minutes + "m remaining";

    }

    updateCountdown();

    countdownInterval = setInterval(
        updateCountdown,
        60000
    );

}



// ---------------------------------
// PAGE SECTIONS
// ---------------------------------

const detailsSection =
    document.getElementById("policyDetails");

const profileSection =
    document.getElementById("profileSection");

const faqSection =
    document.getElementById("faqSection");



function hideSections() {

    detailsSection.style.display = "none";
    profileSection.style.display = "none";
    faqSection.style.display = "none";

}



// ---------------------------------
// VIEW DETAILS
// ---------------------------------

document
.getElementById("viewDetails")
.addEventListener("click", function () {

    hideSections();

    detailsSection.style.display = "block";

    window.scrollTo({
        top: detailsSection.offsetTop - 20,
        behavior: "smooth"
    });

});



// ---------------------------------
// HOME BUTTON
// ---------------------------------

document
.getElementById("homeButton")
.addEventListener("click", function () {

    hideSections();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});



// ---------------------------------
// PROFILE BUTTON
// ---------------------------------

document
.getElementById("profileButton")
.addEventListener("click", function () {

    hideSections();

    profileSection.style.display = "block";

    window.scrollTo({
        top: profileSection.offsetTop - 20,
        behavior: "smooth"
    });

});



// ---------------------------------
// FAQ BUTTON
// ---------------------------------

document
.getElementById("faqButton")
.addEventListener("click", function () {

    hideSections();

    faqSection.style.display = "block";

    window.scrollTo({
        top: faqSection.offsetTop - 20,
        behavior: "smooth"
    });

});
  
// ---------------------------------
// DOWNLOAD CERTIFICATE
// ---------------------------------

document
.getElementById("downloadCertificate")
.addEventListener("click", function () {

    window.location.href = "certificate.html";

});


// ---------------------------------
// LOGOUT
// ---------------------------------

document
.getElementById("logoutButton")
.addEventListener("click", async function () {

    await supabaseClient.auth.signOut();

    window.location.href = "login.html";

});



// ---------------------------------
// UPDATE ACTIVE STATUS
// ---------------------------------

async function refreshPolicyStatus() {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { data } = await supabaseClient
        .from("policies")
        .select("status")
        .eq("user_id", user.id)
        .single();

    if (!data) return;

    const badge = document.querySelector(".active-status");

    if (badge) {
        badge.textContent = data.status.toUpperCase();
    }

}

refreshPolicyStatus();



// ---------------------------------
// AUTO REFRESH EVERY 60 SECONDS
// ---------------------------------

setInterval(function () {

    refreshPolicyStatus();

}, 60000);
// ---------------------------------
// LOAD ACTIVE POLICY COUNT
// ---------------------------------

async function loadActivePolicyCount(userId) {

    const { data, error } = await supabaseClient
        .from("policies")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .eq("status", "ACTIVE");


    if (error) {

        console.log(error);
        return;

    }


    document.getElementById("activePolicyCount").textContent =
        data.length;

}

