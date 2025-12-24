// ------------------- DEMO LOGIN -------------------
function login() {
    const avalonFlowID = document.getElementById("AvalonFlowID").value;
    const password = document.getElementById("password").value;

    const demoAvalonFlowID = "AVF-2739XG-LUX78";
    const demoPassword = "avalon123";

    if (avalonFlowID === demoAvalonFlowID && password === demoPassword) {
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("loginError").innerText =
            "Access details not recognized. Please check and try again.";
    }
}

// ------------------- DEMO LOGOUT -------------------
function logout() {
    window.location.href = "index.html";
}

// ------------------- YOUR EXISTING JS -------------------
// Add your old JS code below this line
// For example:
// function oldFeature() {
//     console.log("Old feature working");
// }
