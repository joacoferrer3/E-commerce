const idCatSeleccionado = localStorage.getItem('catID');
const urlActualizada = `https://japceibal.github.io/emercado-api/cats_products/${idCatSeleccionado}.json`
var listContainer = document.getElementById("product-list-container")

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}


var listContainer = document.getElementById("product-list-container")

//Plantilla para la colocacion de los elementos
const convertToHtmlElem = (p) =>{
    return `<div onclick="setProdID(${p.id})" class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col-sm-3 col-md-4 col-lg-3">
                <img src="${p.image}" alt="product image" class="img-thumbnail">
            </div>
            <div class="col-sm-9 col-md-8 col-lg-9">
                <div class="d-flex w-100 justify-content-between">
                    <div class="mb-1">
                    <h4>${p.name} - ${p.currency} ${p.cost}</h4> 
                    <p> ${p.description}</p> 
                    </div>
                    <small class="text-muted">${p.soldCount} vendidos</small>
                </div>
         </div>
        </div>
    </div>`
}

getJSONData(urlActualizada).then((response) => {
    productData = response
    productData.data.products.forEach(p => {
        let newElement = document.createElement('div')
        newElement.classList.add("container")
        newElement.innerHTML = convertToHtmlElem(p)
        listContainer.appendChild(newElement)
    })
    document.getElementById('products-subtitle').innerHTML = `Veras aqui todos los productos de la categoria <strong>${productData.data.catName}</strong>`
})

searchTerm = document.getElementById("searchInput").value.toUpperCase()
var searchChange = false

setInterval(()=>{ //Al ver que refrescar la lista en cada tecla apretada generaba un parpadeo indeseado usamos un intervalo que cada medio segundo evalua si la busqueda cambio y refresca la lista SOLO de ser asi
    if(searchChange){
        searchTerm = document.getElementById("searchInput").value.toUpperCase()
        showProductList()
        searchChange = false
    }
},400)

document.getElementById("searchInput").addEventListener("input",(e)=>{
    searchChange = true
})


const ascendente = "up";
const descendente = "down";
const relevancia = "rel";

let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

//Función para filtrar elementos segun criterio
function sortElements(criteria, array){
    let result = [];
    if (criteria === ascendente)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === descendente){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === relevancia){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount > bCount ){ return -1; }
            if ( aCount < bCount ){ return 1; }
            return 0;
        });
    }
    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showProductList(){
    listContainer.innerHTML = "" //Vacia la lista
    currentProductsArray.forEach(p => {
        //En este IF evaluamos si el producto a procesar cumple con los criterios de Minimo,Maximo y busqueda
        if (((minCount == undefined) || (minCount != undefined && parseInt(p.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(p.cost) <= maxCount)) &&
            ((searchTerm == "") || (searchTerm != "" && p.name.toUpperCase().includes(searchTerm)))){
            //De ser asi creamos un nuevo elemento DOM en la variable newElement
            let newElement = document.createElement('div')
            //Seteamos los estilos del nuevo elemento comenzando con su opacidad a 0 
            newElement.classList.add("container")
            newElement.style.opacity = 0
            newElement.style.transition = "opacity 0.5s ease-in"
            //y le asignamos el texto HTML generado por la funcion a su inner
            newElement.innerHTML = convertToHtmlElem(p)
             //El proximo bloque se encarga de resaltar el texto buscado en el titulo de los resultados, se ejecuta cuando el buscador no esta vacio
            if(searchTerm != ''){
                let highlightStart = newElement.getElementsByTagName('h4')[0].innerHTML.toUpperCase().indexOf(searchTerm)//Hallamos la posicion del titulo donde comienza el searchterm
                let highlightEnd = highlightStart + searchTerm.length //Con el largo del searchterm obtenemos la posicion final
                let nameText = newElement.getElementsByTagName('h4')[0].innerHTML //Obtenemos el nombre del producto
                //La proxima linea se encarga de modificat el texto del h4 para que el texto a resaltar quede en un span de clase "highlighted-search"
                newElement.getElementsByTagName('h4')[0].innerHTML = nameText.slice(0,highlightStart) + '<span class="highlighted-search">' + nameText.slice(highlightStart,highlightEnd) + '</span>' + nameText.slice(highlightEnd)
            }
            listContainer.appendChild(newElement)//Agregamos el producto a la lista
        }
    })
    if(listContainer.childNodes.length <= 0){//El proximo bloque genera un texto informatvo si no hay productos que mostrar
        let newElement = document.createElement('h3')
        newElement.style.opacity = 0
        newElement.style.transition = "opacity 0.1s"
        newElement.innerText = `No se hallaron productos con nombre ${searchTerm}`
        listContainer.appendChild(newElement)
    }
    for (let i = 0; i < listContainer.childNodes.length; i++) { //Finalmente cambiamos la opacidad de todos los resultados a 1 secuencialmente logrando un efecto de animacion
        setTimeout(()=>{
            listContainer.childNodes[i].style.opacity = 1
        },250*i)
    }
}

function sortAndShowProducts(sortCriteria, categoriesArray){
    currentSortCriteria = sortCriteria;

    if(categoriesArray != undefined){
        currentProductsArray = categoriesArray;
    }

    currentProductsArray = sortElements(currentSortCriteria, currentProductsArray);

    //Muestro las categorías ordenadas
    showProductList();
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(urlActualizada).then(function(resultObj){
        if (resultObj.status === "ok"){
            currentProductsArray = resultObj.data.products
            showProductList()
            //sortAndShowProducts(ORDER_ASC_BY_NAME, resultObj.data);
        }
    });

    document.getElementById("priceAsc").addEventListener("click", function(){
        sortAndShowProducts(ascendente);
    });

    document.getElementById("priceDesc").addEventListener("click", function(){
        sortAndShowProducts(descendente);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(relevancia);
    });

    document.getElementById("clearPriceFilter").addEventListener("click", function(){
        document.getElementById("priceFilterCountMin").value = "";
        document.getElementById("priceFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductList();
    });

    document.getElementById("priceFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("priceFilterCountMin").value;
        maxCount = document.getElementById("priceFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }

        showProductList();
    });
});

document.getElementById("sesion").addEventListener("click", () => logout());