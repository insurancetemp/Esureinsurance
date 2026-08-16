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
    
});

async function loadProfile(userId) {

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.log("User error:", userError);
        return;
    }

    console.log("AUTH USER ID:", user.id);


    const {
        data: profile,
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();


    console.log("CUSTOMER PROFILE:", profile);
    console.log("PROFILE ERROR:", profileError);


    if (profileError) {

        console.error(
            "Could not load profile:",
            profileError
        );

        document.getElementById("profileEmail").textContent =
            user.email || "Not provided";

        document.getElementById("profileName").textContent =
            "Not provided";

        document.getElementById("profileAddress").textContent =
            "Not provided";

        document.getElementById("profileLicence").textContent =
            "Not provided";

        document.getElementById("profilePhone").textContent =
            "Not provided";

        return;
    }


    if (!profile) {

        console.log(
            "No profile found for:",
            user.id
        );

        document.getElementById("profileEmail").textContent =
            user.email || "Not provided";

        document.getElementById("profileName").textContent =
            user.user_metadata?.full_name || "Not provided";

        document.getElementById("profileAddress").textContent =
            "Not provided";

        document.getElementById("profileLicence").textContent =
            "Not provided";

        document.getElementById("profilePhone").textContent =
            "Not provided";

        return;
    }


    // EMAIL

    document.getElementById("profileEmail").textContent =
        profile.email ||
        user.email ||
        "Not provided";


    // NAME

    document.getElementById("profileName").textContent =
        profile.full_name ||
        user.user_metadata?.full_name ||
        "Not provided";


    // ADDRESS

    document.getElementById("profileAddress").textContent =
        profile.address ||
        "Not provided";


    // DRIVING LICENCE

    document.getElementById("profileLicence").textContent =
        profile.driving_licence ||
        "Not provided";


    // PHONE

    document.getElementById("profilePhone").textContent =
        profile.phone ||
        "Not provided";

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
    data.colour + " " + data.year;

document.getElementById("coverType").textContent =
    data.cover_type;

const policyPrice =
    document.getElementById("policyPrice");

console.log("POLICY PRICE FROM SUPABASE:", data.price);
console.log("FULL POLICY DATA:", data);

if (policyPrice) {

    policyPrice.textContent =
        "£" + Number(data.price).toFixed(2);

}

// Save policy for certificate
window.currentPolicy = data;


startCountdown(data.expiry_time, data.start_time);

}

// ---------------------------------
// LIVE COUNTDOWN TIMER
// ---------------------------------

let countdownInterval = null;

function startCountdown(expiryTime, startTime) {

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    function updateCountdown() {

        const expiry = new Date(expiryTime);
        const start = new Date(startTime);
        const now = new Date();

        const difference = expiry - now;

        if (difference <= 0) {

            document.getElementById("timeRemaining").textContent =
                "Policy Expired";

            const badge =
                document.querySelector(".active-status");

            if (badge) {
                badge.textContent = "EXPIRED";
            }

            clearInterval(countdownInterval);
            return;
        }

        // Work out the ORIGINAL policy length
        const policyLength =
            expiry.getTime() - start.getTime();

        // 7 days = 168 hours
        const isSevenDayPolicy =
            policyLength >= (6 * 24 * 60 * 60 * 1000);

        const totalMinutes = Math.floor(
            difference / (1000 * 60)
        );

        const days = Math.floor(
            totalMinutes / (60 * 24)
        );

        const hours = Math.floor(
            (totalMinutes % (60 * 24)) / 60
        );

        const minutes =
            totalMinutes % 60;

        if (isSevenDayPolicy) {

            document.getElementById("timeRemaining").textContent =
                days + "days " +
                hours + "hrs " +
                minutes + "m remaining";

        } else {

            document.getElementById("timeRemaining").textContent =
                hours + "hr " +
                minutes + "m remaining";

        }

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

    // Hide the main dashboard sections
    document.querySelector(".dashboard-header").style.display = "none";
    document.querySelector(".policy-summary").style.display = "none";
    document.querySelector(".trust-grid").style.display = "none";
    document.querySelector(".vehicle-heading-row").style.display = "none";
    document.querySelector(".policy-card").style.display = "none";

    // Show policy details screen
    hideSections();

    detailsSection.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

document
.getElementById("backToDashboard")
.addEventListener("click", function () {

    // Hide policy details
    detailsSection.style.display = "none";

    // Show dashboard again
    document.querySelector(".dashboard-header").style.display = "flex";
    document.querySelector(".policy-summary").style.display = "block";
    document.querySelector(".trust-grid").style.display = "grid";
    document.querySelector(".vehicle-heading-row").style.display = "flex";
    document.querySelector(".policy-card").style.display = "block";

    window.scrollTo({
        top: 0,
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
.addEventListener("click", async function () {

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    if (!user) return;

    const { data, error } = await supabaseClient
        .from("policies")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .single();

    if (error || !data) {
        alert("No active policy found.");
        return;
    }

    console.log("Certificate data:", data);

sessionStorage.setItem("certificateData", JSON.stringify(data));

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

    const { data, error } = await supabaseClient
        .from("policies")
        .select("status, expiry_time")
        .eq("user_id", user.id)
        .order("expiry_time", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error || !data) {
        console.log("Policy status error:", error);
        return;
    }

    const now = new Date();
    const expiry = new Date(data.expiry_time);

    const badge = document.querySelector(".active-status");
    const vehicleCount = document.querySelector(".vehicle-count");
    const activePolicyCount =
        document.getElementById("activePolicyCount");

    if (expiry <= now) {

        if (badge) {
            badge.textContent = "EXPIRED";
        }

        if (activePolicyCount) {
            activePolicyCount.textContent = "0";
        }

        if (vehicleCount) {
            vehicleCount.textContent = "0 active";
        }

        return;
    }

    if (badge) {
        badge.textContent = "ACTIVE";
    }

    if (activePolicyCount) {
        activePolicyCount.textContent = "1";
    }

    if (vehicleCount) {
        vehicleCount.textContent = "1 active";
    }
}


// Check policy status every minute

refreshPolicyStatus();

setInterval(function () {
    refreshPolicyStatus();
}, 60000);

// ---------------------------------
// OPEN CERTIFICATE
// ---------------------------------

async function openCertificate(){

    const {
        data: { user }
    } = await supabaseClient.auth.getUser();


    if(!user){
        alert("Please login again.");
        return;
    }


    const { data, error } = await supabaseClient
        .from("policies")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .single();


    if(error || !data){

        alert("No active policy found.");
        console.log(error);
        return;

    }


    console.log("Certificate data:", JSON.stringify(data));


    sessionStorage.setItem(
        "certificateData",
        JSON.stringify(data)
    );


    window.location.href = "certificate.html";

}
