const STORAGE_KEY_PRE_COMPRA = "all_pre_products"


class PreProduct {
    constructor(name, finished) {
        this.name = name
        this.finished = finished
    }

    static getAllProducts = () => JSON.parse(localStorage.getItem(STORAGE_KEY_PRE_COMPRA))

    static saveProduct(product) {
        let allProducts = this.getAllProducts()

        if (!allProducts)
            allProducts = new Array()

        allProducts.push(product)
        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
    }

    static insertProduct(product) {
        let liProduct = document.createElement("li")
        let inputCheck = document.createElement("input");
        inputCheck.classList.add("form-check-input")
        inputCheck.type = "checkbox"
        inputCheck.id = "checkbox_" + product.name;
        inputCheck.addEventListener("click", new PreProduct().#event_updateProductStatus);

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = inputCheck.id;
        label.appendChild(document.createTextNode(product.name));
        label.addEventListener("dblclick", new PreProduct().#event_removeProduct);

        if (product.finished) {
            label.classList.add("line-through");
            inputCheck.checked = true;
        }
        liProduct.appendChild(inputCheck);
        liProduct.appendChild(label);
        document.getElementById("all_pre_products").appendChild(liProduct);
    }

    #event_removeProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la lista?")) {
            const label = evt.srcElement
            const nameProduct = label.textContent
            // remove product from Storage:
            PreProduct.removeProduct(nameProduct)
            // remove product from view:
            label.parentElement.parentElement.removeChild(label.parentElement)
        }
    }

    #event_updateProductStatus(evt) {
        const element = evt.srcElement;
        let productName = element.id.split('_')[1];
        // remove line from label:
        const label = element.parentElement.childNodes[1]
        // debugger;
        if (element.checked) {
            label.classList.add("line-through");
        } else {
            label.classList.remove("line-through");
        }
        // updated preProduct in local storage:
        PreProduct.updateProductStatus(productName);
    }

    static removeProduct(productName) {
        const allProducts = this.getAllProducts()

        for (let index in allProducts) {
            if (allProducts[index].name == productName) {
                allProducts.splice(index, 1)
                break
            }
        }
        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
    }

    static updateProductStatus(productName) {
        const allProducts = this.getAllProducts()
        for (let product of allProducts) {
            if (product.name === productName) {
                product.finished = (!product.finished)
                break
            }
        }

        localStorage.setItem(STORAGE_KEY_PRE_COMPRA, JSON.stringify(allProducts))
    }

}


const btnNewPreProduct = document.getElementById("add_new_pre_product")
const inputNewPreProduct = document.getElementById("newPreProduct")


btnNewPreProduct.addEventListener("click", (evt) => {
    evt.preventDefault()
    const name = inputNewPreProduct.value
    const price = inputNewPreProduct.value

    if (name && price) {
        const product = new PreProduct(name, false)
        PreProduct.insertProduct(product)
        PreProduct.saveProduct(product)

        inputNewPreProduct.value = ""
        inputNewPreProduct.value = ""
    }
})


addEventListener("DOMContentLoaded", () => {
    const allProducts = PreProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => PreProduct.insertProduct(product))
    }
})

