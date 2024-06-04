
const btnInsertProduct = document.getElementById("saveProduct")
const btnClearList = document.getElementById("clearSurtidosList")
const productNameImput = document.getElementById("productNameImput")
const productPriceImput = document.getElementById("productPriceImput")
const productQuantityInput = document.getElementById("productQuantityInput")
const labelImporteTotal = document.getElementById("importeTotal")


function updateLabelImporteTotal(totalPrice) {
    if (labelImporteTotal.firstChild) {
        labelImporteTotal.removeChild(labelImporteTotal.firstChild)
    }

    labelImporteTotal.appendChild(document.createTextNode(`Importe total: $ ${totalPrice}`))
}


btnInsertProduct.addEventListener("click", async (evt) => {
    evt.preventDefault()
    const name = productNameImput.value
    const quantity = productQuantityInput.value || 1
    const price = productPriceImput.value
    let totalPrice = undefined

    try {
        const product = new SurtidoProduct(name, parseFloat(price), quantity)
        totalPrice = await SurtidoProduct.insert(product)
        updateLabelImporteTotal(totalPrice)

    } catch (error) {
        alert(error.message)
    } finally {
        productNameImput.value = ""
        productPriceImput.value = ""
        productQuantityInput.value = "1"
    }

})


btnClearList.addEventListener("click", async (evt) => {
    evt.preventDefault()
    await SurtidoProduct.clearProductsList()
})


addEventListener("DOMContentLoaded", () => {
    const allProductsJSONData = SurtidoProduct.getAllProducts()

    if (!allProductsJSONData || allProductsJSONData.length === 0)
        return

    const allProducts = allProductsJSONData["json_products"]

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => SurtidoProduct.insertInUI(product))
        updateLabelImporteTotal(allProductsJSONData["total_price"])
    }
})
