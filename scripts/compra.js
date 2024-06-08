
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
        try {
            const response = await fetch(`${API_URL}/save_surtido_data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([allProductsData])
            })

            if (!response.ok)
                throw new Error("Network response was not ok " + response.statusText)

            console.log(await response.json())
        } catch (error) {
            console.error(error)
        }
    }

    static calculateTotalPrice(productsJsonData) {
        let total = 0
        productsJsonData.forEach(prod => total += (prod.price * prod.quantity))
        return total
    }

    static getTotalPrice() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_SURTIDOS))["total_price"]
    }

    static insertInStorage(product) {
        let allProducts = this.getAllProducts()

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

        allProducts["total_price"] = SurtidoProduct.calculateTotalPrice(jsonProductsList)
        allProducts["json_products"] = jsonProductsList

        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))

        return allProducts
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

    static async insert(product, insertInUI = true) {
        const allProducts = SurtidoProduct.insertInStorage(product)

        if (insertInUI)
            SurtidoProduct.insertInUI(product)

        await SurtidoProduct.persistProduct(allProducts)
        return allProducts["total_price"]
    }

    static async #event_removeProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la lista?")) {
            const liElement = evt.srcElement
            const idProduct = liElement.id.split('_')[1]
            // remove product from Storage:
            const status = await SurtidoProduct.removeProduct(idProduct)
            // remove product from view:
            if (status) {
                liElement.parentElement.removeChild(liElement)
                updateLabelImporteTotal()
            }
        }
    }

    static async removeProduct(productId) {
        const allProducts = this.getAllProducts()
        const index = binarySearch(allProducts["json_products"], parseInt(productId))

        if (index == null) {
            alert("Error: No se encontró el producto")
            return false
        }
        // remove element from array:
        allProducts["json_products"].splice(index, 1)
        allProducts["total_price"] = SurtidoProduct.calculateTotalPrice(allProducts["json_products"])
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
        // update data in API:
        await SurtidoProduct.persistProduct(allProducts)
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
