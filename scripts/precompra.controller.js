
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


addEventListener("DOMContentLoaded", async () => {
    const tokenData = localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)

    if (!tokenData)
        window.location.href = "login.html"

    await validateToken()

    try {
        const data = JSON.parse(tokenData)
        if (!data.access_token || !data.username)
            window.location.href = "login.html"
    } catch (error) {
        console.error(error)
    }

    const allProducts = PreProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => PreProduct.insertInUI(product))
    }
})
