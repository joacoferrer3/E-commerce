const idCatSeleccionado = localStorage.getItem('catID');
const urlActualizada = `https://japceibal.github.io/emercado-api/cats_products/${idCatSeleccionado}.json`
var listContainer = document.getElementById("product-list-container")

function setProdID(id) {
    localStorage.setItem("prodID", id);
    window.location = "product-info.html"
}
/*var productData = []*/

var listContainer = document.getElementById("product-list-container")
const convertToHtmlElem = (p) =>{
    return `<div onclick="setProdID(${p.id})" class="list-group-item list-group-item-action">
        <div class="row">
            <div class="col-3">
                <img src="${p.image}" alt="product image" class="img-thumbnail">
            </div>
            <div class="col">
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

setInterval(()=>{
    if(searchChange){
        searchTerm = document.getElementById("searchInput").value.toUpperCase()
        showProductList()
        searchChange = false
    }
},400)

document.getElementById("searchInput").addEventListener("input",(e)=>{
    //console.log(document.getElementById("searchInput").value)
    //searchTerm = document.getElementById("searchInput").value.toUpperCase()
    //showProductList()
    searchChange = true
})


const ascendente = "up";
const descendente = "down";
const relevancia = "rel";

let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

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
        if (((minCount == undefined) || (minCount != undefined && parseInt(p.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(p.cost) <= maxCount)) &&
            ((searchTerm == "") || (searchTerm != "" && p.name.toUpperCase().includes(searchTerm)))){
            let newElement = document.createElement('div')
            newElement.classList.add("container")
            newElement.style.opacity = 0
            newElement.style.transition = "opacity 0.7s ease-in"
            newElement.innerHTML = convertToHtmlElem(p)
            if(searchTerm != ''){
                let highlightStart = newElement.getElementsByTagName('h4')[0].innerHTML.toUpperCase().indexOf(searchTerm)
                let highlightEnd = highlightStart + searchTerm.length
                let nameText = newElement.getElementsByTagName('h4')[0].innerHTML
                console.log(highlightStart,highlightEnd)
                newElement.getElementsByTagName('h4')[0].innerHTML = nameText.slice(0,highlightStart) + '<span class="highlighted-search">' + nameText.slice(highlightStart,highlightEnd) + '</span>' + nameText.slice(highlightEnd)
                console.log(newElement.getElementsByTagName('h4')[0].innerHTML)
            }
            listContainer.appendChild(newElement)
        }
    })
    if(listContainer.childNodes.length <= 0){
        let newElement = document.createElement('h3')
        newElement.style.opacity = 0
        newElement.style.transition = "opacity 0.2s"
        newElement.innerText = `No se hallaron productos con nombre ${searchTerm}`
        listContainer.appendChild(newElement)
    }
    for (let i = 0; i < listContainer.childNodes.length; i++) {
        setTimeout(()=>{
            listContainer.childNodes[i].style.opacity = 1
        },500*i)
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

