import { Product } from './product.js'
import { Order } from './order.js'

export class App {
    constructor(url) {
        this._url = url
    }

    get url() {
        return this._url
    }

    /**
     *  Main method in index.html
     */
    getAllProducts() {

        fetch(`${ this.url }`)
        .then(res => res.json())
        .then(data => { 
    
            for(let i = 0 ; i<data.length ; i++){
                const productCard = new Product(data[i])
                productCard.getProductCard(i)
            }
    
            return
        })
        .catch(error => console.log( error ))
    }

    /**
     *  Main method in product.html
     */
    getOneProduct() {
        const productId = this.getParamInUrl('id')

        fetch(`${ this.url }${productId}`)
        .then(res => res.json())
        .then(data => { 
                const product = new Product(data)
                product.getOneProduct()
    
            return
        })
        .catch(error => console.log( error ))
    }

    /**
     *  Main method in cart.html
     */
    getCart() {
        fetch(`${ this.url }`)
        .then(res => res.json())
        .then(data => { 
            const order = new Order()
            order.getOrderResume(data)
        })
        .catch(error => console.log( error ))
    }

    /**
     * 
     *  Will send the order in POST method to server and get 
     * 
     * @param {*} customerList 
     */
    sendOrder(customerList) {
        fetch(`${ this.url }order`,{
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(customerList)
        })
        .then(res => res.json())
        .then(data => { 

            const orderId = data.orderId
            window.location.href = `./confirmation.html?orderId=${orderId}`
        })
        .catch(error => console.log( error ))
    }

    getConfirmation() {
        const orderId = this.getParamInUrl('orderId')
        const order = new Order()
        order.getConfirmationMessage(orderId)
    }

    getParamInUrl (param) {
        const url = (new URL (document.location)).searchParams
        const paramInUrl = url.get(param)
        return paramInUrl
    }
}
