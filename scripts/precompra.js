

const btnNewPreProduct = document.getElementById("add_new_pre_product")
const inputNewPreProduct = document.getElementById("newPreProduct")

const showAllPreProducts = () => {
    const allPreProducts = PreProduct.getAllPreProducts()

    if (allPreProducts !== null && allPreProducts.length > 0) {
        allPreProducts.forEach(product => PreProduct.insertPreProduct(product))
    }
}

addEventListener("load", () => {
    // setActiveNavItem()
    showAllPreProducts()
})

const event_newPreProduct = (evt) => {
    if (inputNewPreProduct.value) {
        const product = new PreProduct(inputNewPreProduct.value, false)
        PreProduct.insertPreProduct(product)
        PreProduct.savePreProduct(product)
        inputNewPreProduct.value = ""
    }
}

btnNewPreProduct.addEventListener("click", (evt) => {
    evt.preventDefault()
    event_newPreProduct()
})

inputNewPreProduct.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") event_newPreProduct()
})



