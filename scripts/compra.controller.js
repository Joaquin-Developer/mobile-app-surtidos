
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

        SurtidoProduct.insert(product)

        productNameImput.value = ""
        productPriceImput.value = ""
        updateLabelImporteTotal()
    }
})


addEventListener("DOMContentLoaded", () => {
    const allProducts = SurtidoProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => SurtidoProduct.insertInUI(product))
        updateLabelImporteTotal()
    }
})
