const urlActualizada = `https://japceibal.github.io/emercado-api/user_cart/25801.json`;
const tableBody = document.getElementById("elementos");
var listContainer = document.getElementById("product-cart");
let inputCantidad = document.getElementById("inputCantidad");

function getSubtotal (cantidad, costo) {
  return cantidad * costo
};

//Función para actualizar el subtotal dependiendo de la cantidad que ingrese el usuario.
function updateSubtotal(inputElement, unitCost, currency) {
  const cantidad = inputElement.value;
  const subtotal = getSubtotal(cantidad, unitCost);
  const subtotalElement = inputElement.parentElement.nextElementSibling; 
  subtotalElement.textContent = `${currency} ${unitCost * cantidad}`;
};

const convertToHtmlElem = (p) => {  

    return `<tr onclick="setProdID(${p.id})">
              <td><img src="${p.image}" alt="${p.name}" width=100px ></td>
              <td class="text-center">${p.name}</td>
              <td class="text-center">${p.currency} ${p.unitCost}</td>
              <td class="text-center"><input type="number" class="inputCantidad" value="${p.count}" onchange="updateSubtotal(this, ${p.unitCost}, '${p.currency}')"></td>
              <td class="text-center" style="font-weight: bold;"> ${p.currency} <span class="subtotal">${p.unitCost * p.count}</span></td>
            </tr>`;
  };


document.addEventListener("DOMContentLoaded", () => {
  let cart = localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")) : [];
  getJSONData(urlActualizada).then((response) => {
    try {
      productData = response
      console.log(productData);
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
      cart.forEach((p)=>{
        let newRow = document.createElement('tr');
        newRow.innerHTML = convertToHtmlElem(p);
        tableBody.appendChild(newRow);
      })
    } catch (error) {
      console.log("no catch",error);
    }
  })

});



document.getElementById("sesion").addEventListener("click", () => logout());