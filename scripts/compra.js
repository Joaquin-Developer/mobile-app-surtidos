const STORAGE_KEY_SURTIDOS = "all_surtido_products"


class SurtidoProduct {
    constructor(name, price) {
        this.name = name
        this.price = price
    }

    static getAllProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY_SURTIDOS))

    static saveProduct(product) {
        let allProducts = this.getAllProducts()

        if (!allProducts)
            allProducts = new Array()

        allProducts.push(product)
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

    static insertProduct(product) {
        let liProduct = document.createElement("li")
        liProduct.classList.add("list-group-item")
        liProduct.id = product.name
        liProduct.innerHTML = `${product.name} <b>  $ ${product.price}</b>`
        // liProduct.appendChild(document.createTextNode(`${product.name} <b>  $ ${product.price}</b>`))

        liProduct.addEventListener("dblclick", new SurtidoProduct().#event_removeProduct);

        document.getElementById("products_list").appendChild(liProduct);
    }

    #event_removeProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la lista?")) {
            const liElement = evt.srcElement
            const nameProduct = liElement.id
            // remove product from Storage:
            SurtidoProduct.removeProduct(nameProduct)
            // remove product from view:
            liElement.parentElement.removeChild(liElement)
            updateLabelImporteTotal()
        }
    }

    static removeProduct(productName) {
        const allProducts = this.getAllProducts()

        for (let index in allProducts) {
            if (allProducts[index].name == productName) {
                allProducts.splice(index, 1)
                break
            }
        }
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

}


const btnInsertProduct = document.getElementById("saveProduct")
const productNameImput = document.getElementById("productNameImput")
const productPriceImput = document.getElementById("productPriceImput")
const labelImporteTotal = document.getElementById("importeTotal")


function updateLabelImporteTotal() {

    let total = 0
    SurtidoProduct.getAllProducts().forEach(prod => total += prod.price)

    if (labelImporteTotal.firstChild) {
        labelImporteTotal.removeChild(labelImporteTotal.firstChild)
    }

    labelImporteTotal.appendChild(document.createTextNode(`Importe total: $ ${total}`))
}


btnInsertProduct.addEventListener("click", (evt) => {
    evt.preventDefault()
    const name = productNameImput.value
    const price = productPriceImput.value

    if (name && price) {
        const product = new SurtidoProduct(name, parseFloat(price), false)

        SurtidoProduct.insertProduct(product)
        SurtidoProduct.saveProduct(product)

        productNameImput.value = ""
        productPriceImput.value = ""
        updateLabelImporteTotal()
    }
})


addEventListener("DOMContentLoaded", () => {
    const allProducts = SurtidoProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => SurtidoProduct.insertProduct(product))
        updateLabelImporteTotal()
    }
})

