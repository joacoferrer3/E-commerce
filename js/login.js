document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById("correo");
    const password = document.getElementById("password");
    const recuerda = document.getElementById("recuerdame");
    const logBtn = document.getElementById("regBtn");

    if (sessionStorage.getItem("sesionRecordada") === "true" || sessionStorage.getItem("sesionIniciada") === "true") {
        const usuarioActual = sessionStorage.getItem("usuario");
        console.log("Sesión iniciada para el usuario: " + usuarioActual);
        window.location.href = "index.html";
      } else {
        console.log("Sesión no iniciada.");
    }

    logBtn.addEventListener("click", function(event) {
        event.preventDefault()
        const ema = email.value;
        const contra = password.value === '';
        const rec = recuerda.checked;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (ema === '' || contra) {
            showAlertErrorEmpty();
        } else if (!emailPattern.test(ema)) {
            showAlertErrorEmail()
        } else {
            sessionStorage.setItem("sesionIniciada", "true");
            sessionStorage.setItem("usuario", email.value);
            if (rec) {
                iniciarSesion();
            } else {
                window.location.href = "index.html";
            }
        }
    });

    function iniciarSesion (){
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("sesionRecordada", "true");
      
        console.log("Sesión iniciada correctamente.");
        window.location.href = "index.html";
    }
});

function showAlertErrorEmpty() {
    document.getElementById("alert-danger").classList.add("show");
} 

function showAlertErrorEmail() {
    document.getElementById("alert-danger-mail").classList.add("show");
} 