const urlActualizada = `https://japceibal.github.io/emercado-api/user_cart/25801.json`;
const tableBody = document.getElementById("elementos");
var listContainer = document.getElementById("product-cart");
let inputCantidad = document.getElementById("inputCantidad");
let formaDePagoSeleccionada = 0;
let cart = localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")) : [];

//Función para actualizar el subtotal dependiendo de la cantidad que ingrese el usuario.
function updateSubtotal(inputElement, id) {
  const cantidad = parseInt(inputElement.value);
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === id && cantidad > 0) {
      cart[i].count = cantidad
    }   
  }
  localStorage.setItem("cart",JSON.stringify(cart))
  refreshCartItems()
};

//Función para actualizar los elementos en el carrito
function refreshCartItems(){
  tableBody.innerHTML = ''
  cart.forEach((p)=>{
    let newRow = document.createElement('tr');
    newRow.innerHTML = convertToHtmlElem(p);
    tableBody.appendChild(newRow);
  })
  getSubtotalGeneral();
  getCostoTotalDeCompra();
};

//Función para eliminar elementos del carrito
function removeItemFromCart(id){
  let prodInCart = cart.filter((elem) => elem.id === id)
  if (prodInCart.length > 0) {
    cart = cart.filter((elem) => elem.id !== id)
  }
  localStorage.setItem("cart",JSON.stringify(cart))
  refreshCartItems()
}

//Función para darle formato a los elementos incrustados
const convertToHtmlElem = (p) => {  

    return `<tr onclick="setProdID(${p.id})">
              <td><img src="${p.image}" alt="${p.name}" width=100px ></td>
              <td class="text-center">${p.name}</td>
              <td class="text-center">${p.currency} ${p.unitCost}</td>
              <td class="text-center"><input type="number" class="inputCantidad" min="1" value="${p.count}" onchange="updateSubtotal(this, ${p.id})"></td>
              <td class="text-center" style="font-weight: bold;"> ${p.currency} <span class="subtotal">${p.unitCost * p.count}</span></td>
              <td class="text-center"><button class="btn btn-outline-danger btn-lg" type="button" onclick="removeItemFromCart(${p.id})" title="Remover articulo del carrito"><i class="fa-regular fa-trash-can fa-lg"></i></button></td
            </tr>`;
  };

const subtotalGeneral = document.getElementById("subtotal-general");
const costoEnvio = document.getElementById("costo-envio");
const costoTotal = document.getElementById("total-compra");

costoEnvio.innerHTML = 0;

//Función para obtener el subtotal general en moneda USD
function getSubtotalGeneral () {
 
 let costoTotal = 0
 for (let i = 0; i < cart.length; i++) {
  let objeto = cart[i];
  let cantidad = objeto.count;
  let costoUnitario = objeto.unitCost;


  if (objeto.currency != 'USD') {
    costoUnitario = (objeto.unitCost / 40).toFixed(2);
  } else {
    costoUnitario = objeto.unitCost;
  }
  costoTotal += (cantidad * costoUnitario);
 }

  subtotalGeneral.innerHTML = costoTotal;
  getCostoEnvio(costoTotal);
};

//Función para actualizar el % del costo del envio
function getCostoEnvio (subtotal) {
  let porcentaje = 0
  let radios = document.querySelectorAll('input[type="radio"]');
  
  // Agregar un evento change a cada elemento input de tipo radio
  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      
      let valor = this.value;
      
      if (valor === '1') {
        porcentaje = 0.15;
      } else if (valor === '2') {
        porcentaje = 0.07;
      } else if (valor === '3') {
        porcentaje = 0.05;
      }
      
      let total = (subtotal *  porcentaje).toFixed(2);
      
      costoEnvio.innerHTML = total;
      getCostoTotalDeCompra();
    });
  });
};

//Función para obtener el total del costo de la compra
function getCostoTotalDeCompra() {
  let sub = parseFloat(subtotalGeneral.innerHTML);
  console.log(sub)
  let envio = parseFloat(costoEnvio.innerHTML);
  console.log(envio)

  let total = (sub + envio).toFixed(2);

  costoTotal.innerHTML = total;
};

//Fetch Carrito
document.addEventListener("DOMContentLoaded", () => {
  getJSONData(urlActualizada).then((response) => {
    try {
      productData = response
      console.log(productData);
      if (localStorage.getItem("agregoCarritoAPI") === null) {
        productData.data.articles.forEach(fetchedProd => {
          if (cart.filter((elem) => elem.id === fetchedProd.id).length > 0) { //chequeo si el producto ya esta en el carrito
            cart.forEach(p => {
                if (p.id === fetchedProd.id) {
                    p.count += fetchedProd.count //De ser asi lo buscamos por id y solo aumentamos la cantidad
                }
            })
          }else{
            cart.push(fetchedProd);
          }
        });
        localStorage.setItem("cart",JSON.stringify(cart))
        localStorage.setItem("agregoCarritoAPI",true)
      }
      refreshCartItems()

    } catch (error) {
      console.log("no catch",error);
    }
  })
  formaDePago();
});



document.getElementById("sesion").addEventListener("click", () => logout());

var numTarj = document.getElementById("NumTarjeta");
var codSeg = document.getElementById("CodSeguridad");
var venc = document.getElementById("vencimiento");
var cuenta = document.getElementById("NumCuenta");
var formaPago = document.getElementById('pago');

//Controles para mostrar elementos habilitados o deshabilitados segun forma de pago
document.getElementById("credito").addEventListener("click", function(e) {
  cuenta.disabled = true;
  numTarj.disabled = false;
  codSeg.disabled = false;
  venc.disabled = false;
})

document.getElementById("transferencia").addEventListener("click", function(e) {
  numTarj.disabled = true;
  codSeg.disabled = true;
  venc.disabled = true;
  cuenta.disabled = false;
})

//Función para controlar forma de pago
function formaDePago() {
  let radiosPago = document.querySelectorAll('input[name="pago"]');
  radiosPago.forEach(function(radio) {
    radio.addEventListener('change', function() {
      formaDePagoSeleccionada = this.value;
    }
  )
})

var myModalEl = document.getElementById('modalPago')

//Función para mostrar un modal segun forma de pago
myModalEl.addEventListener('hidden.bs.modal', function () {
  if (formaDePagoSeleccionada === '1') {
    formaPago.innerHTML = "Se seleccionó pagar con tarjeta de crédito.";
    feedbackMessage.innerHTML = ''
    } else if (formaDePagoSeleccionada === '2') {
    formaPago.innerHTML = "Se seleccionó pagar con transferencia bancaria."  ;
    feedbackMessage.innerHTML = ''
    } else {
    formaPago.innerHTML = "No se seleccionó una forma de pago."
    }
})
}

//Función para validaciones en modal
 function validarModal() {
  const feedbackMessage = document.getElementById('feedbackMessage');
  console.log(formaDePagoSeleccionada)
  if (formaDePagoSeleccionada === 0) {
    feedbackMessage.innerHTML = 'Debes seleccionar una forma de pago';
    return false;
  } else {
    feedbackMessage.innerHTML = '';
    return true
  }
}

//Función para checkear si el carrito es valido, es decir, no vacio
function validarCarrito() {
  const alertaCarrito = document.getElementById('alertaCarritoVacio');
  if (cart.length == 0) {
    alertaCarrito.innerHTML = `<div class="alert alert-danger alert-dismissible show fade" role="alert">
    <div class="text-center"> <strong>Carrito Vacio!</strong> </div>
     <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
    return false;
  } else {
    alertaCarrito.innerHTML = '';
    return true
  }
}

//Función para checkear que todas las condiciones se cumplen al momento de enviar la compra
(function () {
  'use strict'

  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        validarModal()
        validarCarrito()
        if (!form.checkValidity() || !validarModal() || !validarCarrito()) {
          event.preventDefault()
          event.stopPropagation()
        }
        else {
          alert("Has comprado con éxito")
        }
        form.classList.add('was-validated');
      }, false)
    })
})()