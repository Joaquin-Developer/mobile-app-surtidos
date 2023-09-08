
const btnNewPreProduct = document.getElementById("add_new_pre_product")
const inputNewPreProduct = document.getElementById("newPreProduct")


btnNewPreProduct.addEventListener("click", (evt) => {
    evt.preventDefault()
    const name = inputNewPreProduct.value

    if (name) {
        const product = new PreProduct(name, false)
        PreProduct.insert(product)

        inputNewPreProduct.value = ""
        inputNewPreProduct.value = ""
    }
})


addEventListener("DOMContentLoaded", () => {
    const allProducts = PreProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => PreProduct.insertInUI(product))
    }
})
