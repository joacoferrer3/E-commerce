const url_autos = "https://japceibal.github.io/emercado-api/cats_products/101.json"
let products = []
var listContainer = document.getElementById("product-list-container")
getJSONData(url_autos).then((response) => {
    document.getElementById('products-subtitle').innerHTML = `Veras aqui todos los productos de la categoria <strong>${response.data.catName}</strong>`
    console.log(response.data.products)
    response.data.products.forEach(p => {
        let newElement = document.createElement('div')
        newElement.classList.add("container")
        newElement.innerHTML = `
        <div class="list-group-item list-group-item-action">
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
        listContainer.appendChild(newElement)
    })
})




