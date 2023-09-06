
class PreProduct {
    constructor(name, finished) {
        this.name = name
        this.finished = finished
    }

    static savePreProduct(product) {
        let allPreProducts = this.getAllPreProducts()

        if (!allPreProducts)
            allPreProducts = new Array()

        allPreProducts.push(product)
        localStorage.setItem('all_pre_products', JSON.stringify(allPreProducts))
    }

    static getAllPreProducts = () => JSON.parse(localStorage.getItem('all_pre_products'))

    static insertPreProduct(product) {
        let liPreProduct = document.createElement("li")
        let inputCheck = document.createElement("input");
        inputCheck.classList.add("form-check-input")
        inputCheck.type = "checkbox"
        inputCheck.id = "checkbox_" + product.name;
        inputCheck.addEventListener("click", new PreProduct().#event_updatePreProductStatus);

        let label = document.createElement("label");
        label.classList.add("form-check-label");
        label.for = inputCheck.id;
        label.appendChild(document.createTextNode(product.name));
        label.addEventListener("dblclick", new PreProduct().#event_removePreProduct);

        if (product.finished) {
            label.classList.add("line-through");
            inputCheck.checked = true;
        }
        liPreProduct.appendChild(inputCheck);
        liPreProduct.appendChild(label);
        document.getElementById("all_pre_products").appendChild(liPreProduct);
    }

    #event_removePreProduct(evt) {
        if (confirm("¿Seguro que deseas eliminar el producto de la pre-compra?")) {
            const label = evt.srcElement
            const namePreProduct = label.textContent
            // remove preProduct from Storage:
            PreProduct.removePreProduct(namePreProduct)
            // remove preProduct from view:
            label.parentElement.parentElement.removeChild(label.parentElement)
        }
    }

    #event_updatePreProductStatus(evt) {
        const element = evt.srcElement;
        let preProductName = element.id.split('_')[1];
        // remove line from label:
        const label = element.parentElement.childNodes[1]
        // debugger;
        if (element.checked) {
            label.classList.add("line-through");
        } else {
            label.classList.remove("line-through");
        }
        // updated preProduct in local storage:
        PreProduct.updatePreProductStatus(preProductName);
    }

    static removePreProduct(productName) {
        const allPreProducts = this.getAllPreProducts()

        for (let index in allPreProducts) {
            if (allPreProducts[index].name == productName) {
                allPreProducts.splice(index, 1)
                break
            }
        }
        localStorage.setItem('all_pre_products', JSON.stringify(allPreProducts))
    }

    static updatePreProductStatus(productName) {
        const allPreProducts = this.getAllPreProducts()
        for (let product of allPreProducts) {
            if (product.name === productName) {
                product.finished = (!product.finished)
                break
            }
        }

        localStorage.setItem('all_pre_products', JSON.stringify(allPreProducts))
    }

}
