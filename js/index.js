document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    if (sessionStorage.getItem("sesionIniciada") === "true") {
        const usuarioActual = sessionStorage.getItem("usuario");
        console.log("Sesión iniciada para el usuario: " + usuarioActual);
      } else {
        window.location.href = "login.html";
        console.log("Sesión no iniciada.");
      }
});
