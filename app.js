// Temp Cover Dashboard
// Uses existing supabaseClient


document.addEventListener("DOMContentLoaded", async function(){


    const {
        data: { user }
    } = await supabaseClient.auth.getUser();



    if(!user){

        window.location.href = "login.html";
        return;

    }



    // LOAD PROFILE DATA

    async function loadProfile(){


        const { data, error } = await supabaseClient
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();



        if(error){

            console.log(error);
            return;

        }



        document.getElementById("profileEmail").textContent =
        data.email || user.email;


        document.getElementById("profileName").textContent =
        data.full_name || "Not provided";


        document.getElementById("profileAddress").textContent =
        data.address || "Not provided";


        document.getElementById("profilePhone").textContent =
        data.phone || "Not provided";


        document.getElementById("profileLicence").textContent =
        data.driving_licence || "Not provided";


    }





    // LOAD POLICY DATA

    async function loadPolicy(){


        const { data, error } = await supabaseClient
        .from("policies")
        .select("*")
        .eq("user_id", user.id)
        .single();



        if(error){

            console.log(error);
            return;

        }



        document.getElementById("vehicleRegistration").textContent =
        data.registration || "NO REG";


        document.getElementById("vehicleName").textContent =
        data.make + " " + data.model;


        document.getElementById("vehicleDetails").textContent =
        data.year + " " + (data.colour || "");



        document.getElementById("coverType").textContent =
        data.cover_type || "Fully Comprehensive";



        if(data.expiry_time){

            startCountdown(data.expiry_time);

        }


    }





    // COUNTDOWN TIMER

    function startCountdown(expiry){


        function updateTimer(){


            const now = new Date().getTime();

            const end = new Date(expiry).getTime();


            const difference = end - now;



            if(difference <= 0){

                document.getElementById("timeRemaining").textContent =
                "Cover expired";

                return;

            }



            const hours = Math.floor(
                difference / (1000 * 60 * 60)
            );


            const minutes = Math.floor(
                (difference % (1000 * 60 * 60)) /
                (1000 * 60)
            );



            document.getElementById("timeRemaining").textContent =
            hours + "hr " + minutes + "m remaining";


        }



        updateTimer();

        setInterval(updateTimer,60000);


    }







    // NAVIGATION


    function hideSections(){

        document.getElementById("policyDetails").style.display="none";

        document.getElementById("profileSection").style.display="none";

        document.getElementById("faqSection").style.display="none";

    }



    document.getElementById("homeButton")
    .addEventListener("click",function(){

        hideSections();

    });



    document.getElementById("viewDetails")
    .addEventListener("click",function(){

        hideSections();

        document.getElementById("policyDetails").style.display="block";

    });



    document.getElementById("faqButton")
    .addEventListener("click",function(){

        hideSections();

        document.getElementById("faqSection").style.display="block";

    });



    document.getElementById("profileButton")
    .addEventListener("click",function(){

        hideSections();

        document.getElementById("profileSection").style.display="block";

    });






    // LOGOUT


    document.getElementById("logoutButton")
    .addEventListener("click", async function(){


        await supabaseClient.auth.signOut();

        window.location.href="login.html";


    });





    loadProfile();

    loadPolicy();



});
