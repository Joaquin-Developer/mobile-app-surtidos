
class PreProduct {
    constructor(name, finished) {
        this.id = PreProduct.getNewProductId()
        this.name = name
        this.finished = finished
    }

    static getAllProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY_PRE_COMPRA))

    static getNewProductId() {
        const data = PreProduct.getAllProducts()
        return (!data || data.length == 0) ? 1 : data[data.length - 1].id + 1
    }

    static insertInStorage(product) {
        let allProducts = this.getAllProducts()

        if (!allProducts)
            allProducts = new Array()

        allProducts.push(product)
        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
    }

    static insertInUI(product) {
        let liProduct = document.createElement("li")
        let inputCheck = document.createElement("input")
        inputCheck.classList.add("form-check-input")
        inputCheck.type = "checkbox"
        inputCheck.id = "checkbox_" + product.id
        inputCheck.addEventListener("click", new PreProduct().#event_updateProductStatus)

        let label = document.createElement("label")
        label.classList.add("form-check-label")
        label.for = inputCheck.id
        label.appendChild(document.createTextNode(product.name))
        label.addEventListener("dblclick", new PreProduct().#event_removeProduct)

        if (product.finished) {
            label.classList.add("line-through")
            inputCheck.checked = true
        }
        liProduct.appendChild(inputCheck)
        liProduct.appendChild(label)
        document.getElementById("all_pre_products").appendChild(liProduct)
    }

    static insert(product) {
        PreProduct.insertInUI(product)
        PreProduct.insertInStorage(product)
    }

    #event_removeProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la lista?")) {
            const label = evt.srcElement
            const checkElement = label.parentElement.childNodes[0]
            const productId = checkElement.id.split('_')[1]
            // remove product from Storage:
            const status = PreProduct.removeProduct(productId)
            // remove product from view:
            if (status) {
                label.parentElement.parentElement.removeChild(label.parentElement)
            }
        }
    }

    async #event_updateProductStatus(evt) {
        const element = evt.srcElement
        let productId = element.id.split('_')[1]
        // remove line from label:
        const label = element.parentElement.childNodes[1]
        // updated preProduct in local storage:
        const statusUpdate = PreProduct.updateProductStatus(productId)

        if (!statusUpdate)
            return

        if (element.checked) {
            label.classList.add("line-through")
            await PreProduct.insertInSurtidosList(label.textContent)
        } else {
            label.classList.remove("line-through")
        }
    }

    static async insertInSurtidosList(productName) {
        if (confirm("¿Desea agregar el producto en la lista del surtido actual?")) {
            const price = parseFloat(prompt("Ingrese precio en $$  (Usar el punto para decimales)"))

            if (isNaN(price)) {
                alert("Error: Debe ingresar un precio válido!")
                return
            }

            const surtidoProduct = new SurtidoProduct(productName, price, 1)

            await SurtidoProduct.insert(surtidoProduct, false)
        }
    }

    static removeProduct(productId) {
        const allProducts = this.getAllProducts()
        const index = binarySearch(allProducts, parseInt(productId))

        if (index == null) {
            alert("Error: No se encontró el producto")
            return false
        }
        // remover elemento del array:
        allProducts.splice(index, 1)
        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
        return true
    }

    static updateProductStatus(productId) {
        const allProducts = this.getAllProducts()
        const index = binarySearch(allProducts, parseInt(productId))

        if (index == null) {
            alert("Error: No se encontró el producto")
            return false
        }
        // cambiar status y guardar:
        allProducts[index].finished = !allProducts[index].finished
        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
        return true
    }

}
