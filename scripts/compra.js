
class SurtidoProduct {
    constructor(name, price, quantity) {
        if (!name || !price || price < 1 || !quantity || quantity < 1) {
            throw new RangeError("Errores en los valores.")
        }

        this.id = SurtidoProduct.getNewProductId()
        this.name = name
        this.price = price
        this.quantity = quantity
    }

    /**
     * {
            "username": username,
            "json_products": [productsJsonData],
            "total_price": 0.0
        }
     */
    static getAllProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY_SURTIDOS))

    static getNewProductId() {
        const data = SurtidoProduct.getAllProducts()

        if (!data)
            return 1
        const jsonProducts = data["json_products"]
        return (!jsonProducts || jsonProducts.length == 0) ? 1 : jsonProducts[jsonProducts.length - 1].id + 1
    }

    static async persistProduct(allProductsData) {
        console.log("data enviada:", JSON.stringify([allProductsData]))

        try {
            const response = await fetch(`${API_URL}/save_surtido_data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([allProductsData])
            })

            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)

            const jsonResponse = await response.json()
            console.log(jsonResponse)
            console.log("Data saved/updated on Servidor.")
        } catch (error) {
            console.error(error)
        }
    }

    static insertInStorage(product) {
        let allProducts = this.getAllProducts()
        let totalPrice = 0

        if (!allProducts) {
            allProducts = {}
            const username = prompt("Ingrese su nombre:")
            if (!username) {
                // throw error
            }
            allProducts["username"] = username
        }

        let jsonProductsList = allProducts["json_products"] || new Array()

        jsonProductsList.push(product)
        jsonProductsList.forEach(prod => totalPrice += (prod.price * prod.quantity))

        allProducts["total_price"] = totalPrice
        allProducts["json_products"] = jsonProductsList

        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))

        return [allProducts, totalPrice]
    }

    static insertInUI(product) {
        let liProduct = document.createElement("li")
        liProduct.classList.add("list-group-item")
        liProduct.id = "product_" + product.id
        liProduct.innerHTML = `${product.name} <b>  $ ${product.price * product.quantity}</b>`
        // liProduct.appendChild(document.createTextNode(`${product.name} <b>  $ ${product.price}</b>`))

        liProduct.addEventListener("dblclick", SurtidoProduct.#event_removeProduct);

        document.getElementById("products_list").appendChild(liProduct);
    }

    static async insert(product) {
        SurtidoProduct.insertInUI(product)
        const [allProducts, totalPrice] = SurtidoProduct.insertInStorage(product)
        await SurtidoProduct.persistProduct(allProducts)
        return totalPrice
    }

    static #event_removeProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la lista?")) {
            const liElement = evt.srcElement
            const idProduct = liElement.id.split('_')[1]
            // remove product from Storage:
            const status = SurtidoProduct.removeProduct(idProduct)
            // remove product from view:
            if (status) {
                liElement.parentElement.removeChild(liElement)
                updateLabelImporteTotal()
            }
        }
    }

    static removeProduct(productId) {
        const allProducts = this.getAllProducts()
        const index = binarySearch(allProducts, parseInt(productId))

        if (index == null) {
            alert("Error: No se encontró el producto")
            return false
        }
        // remove element from array:
        allProducts.splice(index, 1)
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
        return true
    }

    static async clearProductsList() {
        // remove all elements in Surtidos list
        const data = SurtidoProduct.getAllProducts()
        data["json_products"] = []
        data["total_price"] = 0
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(data))
        await SurtidoProduct.persistProduct(data)
        location.reload()
    }

}
