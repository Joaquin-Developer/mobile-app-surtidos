const STORAGE_KEY_SURTIDOS = "all_surtido_products"


class SurtidoProduct {
    constructor(name, price) {
        this.name = name
        this.price = price
    }

    saveProduct(product) {
        let allProducts = this.getAllProducts()

        if (!allProducts)
            allProducts = new Array()

        allProducts.push(product)
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

    insertProduct(product) {
        let liProduct = document.createElement("li")
        let inputCheck = document.createElement("input");
        inputCheck.classList.add("form-check-input")
        inputCheck.type = "checkbox"
        inputCheck.id = "checkbox_" + product.name;
        inputCheck.addEventListener("click", new SurtidoProduct().#event_updateProductStatus);

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = inputCheck.id;
        label.appendChild(document.createTextNode(product.name));
        label.addEventListener("dblclick", new SurtidoProduct().#event_removeProduct);

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
            Product.removeProduct(nameProduct)
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
        Product.updateProductStatus(productName);
    }

    removeProduct(type) {
        const allProducts = getAllProducts(type)

        for (let index in allProducts) {
            if (allProducts[index].name == this.name) {
                allProducts.splice(index, 1)
                break
            }
        }
        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

    static updateProductStatus(productName) {
        const allProducts = this.getAllProducts()
        for (let product of allProducts) {
            if (product.name === productName) {
                product.finished = (!product.finished)
                break
            }
        }

        localStorage.setItem(STORAGE_KEY_SURTIDOS, JSON.stringify(allProducts))
    }

}


const btnInsertProduct = document.getElementById("saveProduct")
const productsList = document.getElementById("products_list")
const productNameImput = document.getElementById("productNameImput")
const productPriceImput = document.getElementById("productPriceImput")


btnInsertProduct.addEventListener("click", (evt) => {
    evt.preventDefault()
    const name = productNameImput.value
    const price = productPriceImput.value

    if (name && price) {
        const product = new SurtidoProduct(name, price, false)
        product.insertProduct(product)
        product.saveProduct(product)

        productNameImput.value = ""
        productPriceImput.value = ""
    }
})


addEventListener("DOMContentLoaded", () => {
    const allProducts = SurtidoProduct.getAllProducts()

    if (allProducts !== null && allProducts.length > 0) {
        allProducts.forEach(product => SurtidoProduct.insertProduct(product))
    }
})

