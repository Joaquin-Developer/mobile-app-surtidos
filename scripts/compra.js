
class SurtidoProduct {
    constructor(name, price) {
        this.id = SurtidoProduct.getNewProductId()
        this.name = name
        this.price = price
    }

    static getAllProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY_SURTIDOS))

    static getNewProductId() {
        const data = SurtidoProduct.getAllProducts()
        return (!data || data.length == 0) ? 1 : data[data.length - 1].id + 1
    }

    static insertInStorage(product) {
        let allProducts = this.getAllProducts()

        if (!allProducts)
            allProducts = new Array()

        allProducts.push(product)
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

    static insertInUI(product) {
        let liProduct = document.createElement("li")
        liProduct.classList.add("list-group-item")
        liProduct.id = "product_" + product.id
        liProduct.innerHTML = `${product.name} <b>  $ ${product.price}</b>`
        // liProduct.appendChild(document.createTextNode(`${product.name} <b>  $ ${product.price}</b>`))

        liProduct.addEventListener("dblclick", new SurtidoProduct().#event_removeProduct);

        document.getElementById("products_list").appendChild(liProduct);
    }

    static insert(product) {
        SurtidoProduct.insertInUI(product)
        SurtidoProduct.insertInStorage(product)
    }

    #event_removeProduct(evt) {
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
        // remover elemento del array:
        allProducts.splice(index, 1)
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
        return true
    }

}
