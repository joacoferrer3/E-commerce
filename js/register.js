document.addEventListener("DOMContentLoaded", function() {
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellidos");
    const email = document.getElementById("correo");
    const passw1 = document.getElementById("password1");
    const passw2 = document.getElementById("password2");
    const terminos = document.getElementById("terminos");
    const regisBtn = document.getElementById("registerBtn");

    regisBtn.addEventListener("click", function(event){
        event.preventDefault();
        const nom = nombre.value === '';
        const ape = apellido.value === '';
        const ema = email.value;
        const term = terminos.checked;
        const contra = passw1.value.length < 6;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nom || ape || ema=== ''|| !term || contra || (passw1.value !== passw2.value)) {
        showAlertError();
    } else if (!emailPattern.test(ema)) {
        showAlertErrorEmail()
    }else{
        window.location.href = "login.html";
    }
})
})

function showAlertError() {
    document.getElementById("alert-danger").classList.add("show");
};

function showAlertErrorEmail() {
    document.getElementById("alert-danger-mail").classList.add("show");
}; 
