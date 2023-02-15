import { ProductCard, ProductPage } from './product.js'
import { Order } from './order.js'

/**
 * Will send GET requests
 * @param {string} url in config settings
 */
export class App {
    constructor(url) {
        this._url = url
    }

    get url() {
        return this._url
    }
    /**
     * GET all products
     * @async
     */
    async getAllProducts() {

        await fetch(`${ this.url }`)
        .then(res => res.json())
        .then(data => { 
    
            for(let i = 0 ; i<data.length ; i++){
                const productCard = new ProductCard(data[i], i)
                productCard.getProductCard()
            }
    
            return
        })
        .catch(error => console.log( error ))
    }

    /**
     * GET products in cart
     * @async
     */
    async getCart() {
        await fetch(`${ this.url }`)
        .then(res => res.json())
        .then(products => { 
            const order = new Order(products)
            order.getOrderResume()
        })
        .catch(error => console.log( error ))
    }
}

/**
 * Will send GET request by param in url
 * @param {string} url in config settings
 * @param {string} param to pick in url
 */
export class AppGetByParam extends App {
    constructor(url, param) {
        super (url)
        this._param = param
    }

    get param() {
        return this._param
    }

    /**
     * Retrieving param from url
     * @returns {string} param in url
     */
    getParamInUrl () {
        const url = (new URL (document.location)).searchParams
        const paramInUrl = url.get(this.param)
        return paramInUrl
    }

    /**
     * GET one product by Id in url
     * @async
     */
    async getOneProduct() {
        await fetch(`${ this.url }${ this.getParamInUrl() }`)
        .then(res => res.json())
        .then(data => { 
                const product = new ProductPage(data)
                product.getOneProduct()
    
            return
        })
        .catch(error => console.log( error ))
    }

    /**
     * Will send confirmation order to customer
     */
    getConfirmation() {
        const orderId = this.getParamInUrl(this.param)
        const orderSpan = document.querySelector('#orderId')
        orderSpan.innerText = orderId
        localStorage.removeItem('cart')
    }
}

/**
 *  Will send the order in POST method to server
 * @param {string} url from config
 * @param {object} customerOrder 
 */
export class AppSend extends App {
    constructor(url, customerOrder) {
        super(url)
        this._customerOrder = customerOrder
    }

    get customerOrder() {
        return this._customerOrder
    }

    /**
     * POST order to server
     * @async
     */
    async sendOrder() {
        await fetch(`${ this.url }order`,{
            method: "POST",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify(this.customerOrder)
        })
        .then(res => res.json())
        .then(data => { 

            const orderId = data.orderId
            location.href = `./confirmation.html?orderId=${orderId}`
        })
        .catch(error => console.log( error ))
    }
}
