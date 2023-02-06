import { App } from '../objects/app.js'
import { ConfigLoader } from '../objects/config.js'
import { Cart } from './cart.js'
export class Order {

    _totalPrice = 0
    _totalProduct = 0
    _productsInOrder = []
    _contactInfo = {}
    
    get totalPrice() {
        return this._totalPrice
    }
    get totalProduct() {
        return this._totalProduct
    }
    get productsInOrder() {
        return this._productsInOrder
    }
    get contactInfo() {
        return this._contactInfo
    }

    set totalPrice(price) {
        this._totalPrice = price
    }
    set totalProduct(total) {
        this._totalProduct = total
    }
    set productsInOrder(product) {
        this._productsInOrder = product
    }
    set contactInfo(info) {
        this._contactInfo = info
    }

    /**
     *  Main method of the object will render cart page
     * 
     * @param {object} data 
     */
    getOrderResume(data){
        this.initTotalPrice()
        let productsInCart = JSON.parse(window.localStorage.getItem('cart'))

        if(productsInCart === null) {
            productsInCart = []
        }
        let productIndex = 0

        for(let product of data) {

            for(let i = 0 ; i < productsInCart.length ; i++){

                const currentProductInCart = productsInCart[i]

                if(currentProductInCart[0] == product._id) {
                    this.renderOneProductInCart(product, currentProductInCart[1], currentProductInCart[2], productIndex, product.price)
                    productIndex++
                }
            }
        }

        this.submit()
    }

    /**
     *  Will set all product to order on the cart pager
     * 
     * @param {object} product object from API to render
     * @param {string} colorPicked color picked by customer
     * @param {int} quantity quantity picked by customer
     * @param {int} productIndex index of product in localStorage
     * @param {int} productPrice price of the product
     */
    renderOneProductInCart(product, colorPicked, quantity, productIndex) {
        const cart = new Cart (product._id)
        cart.colorPicked = colorPicked
        cart.quantity = quantity
        cart.productIndex = productIndex
        cart.price = product.price
        cart.getCart(product)
    }

    /**
     * 
     *  Method that iniate price countainer on HTML
     *  Required to make all operation of price rendering possible
     * 
     */
    initTotalPrice() {
        document.querySelector('#totalQuantity').innerText = 0
        document.querySelector('#totalPrice').innerText = 0
    }

    /**
     * 
     *  Check the validity of all form inputs
     * 
     */
    checkValidityForm() {
        this.addErrorMessageSimplified('firstName','prénom')
        this.addErrorMessageSimplified('lastName','nom')
        this.addErrorMessageSimplified('address','addresse')
        this.addErrorMessageSimplified('city','ville')
        this.addErrorMessage('email','Veuillez renseigner une addresse email valide')
    }

    /**
     * 
     *  Will render errorMessage in right HTMLElement if the input of parentTag is not valid
     * 
     * @param {string} parentTag 
     * @param {string} errorMessage 
     */
    addErrorMessage(parentTag, errorMessage) {
        const field = document.querySelector(`#${parentTag}`)
        const errorElement = document.querySelector(`#${parentTag}ErrorMsg`)
        if(field.checkValidity()==! true){
            errorElement.innerText = errorMessage
        } else {
            errorElement.innerText = ''
        }
    }

    /**
     * 
     *  Will call previous method to add 'veuillez renseigner votre' at fieldName string
     * 
     * @param {string} parentTag 
     * @param {string} fieldName 
     */
    addErrorMessageSimplified(parentTag, fieldName) {
        let errorMessage = 'Veuillez renseigner votre'
        errorMessage = errorMessage + ` ${fieldName}`
        this.addErrorMessage(parentTag, errorMessage)
    }

    /**
     * 
     *  Main method to submit the order
     * 
     */
    submit() {

        const form = document.querySelector('form')
        const submitButton = document.querySelector('input[type=button]')
        submitButton.addEventListener('click', () =>{

            this.checkValidityForm()

            if(form.checkValidity() !== false) {
                this.getProductList()
                const contact = this.getContactObject()
                const config = new ConfigLoader()
                const api = new App(config.host)
                api.sendOrder(contact)
            }
        })
    }

    /**
     * 
     *  initialize and make order list of products id
     * 
     */
    getProductList() {
        this.productsInOrder = []
        const localStorage = JSON.parse(window.localStorage.getItem('cart'))

        for(let i = 0 ; i < localStorage.length ; i++){
            const currentArray = localStorage[i]
            this.productsInOrder.push(currentArray[0])
        }
    }

    /**
     * 
     *  Will return the order object from all inputs and this.productsInOrder
     * 
     * @returns 
     */
    getContactObject() {
        this.getProductList()

        const firstName = document.querySelector('#firstName').value
        const lastName = document.querySelector('#lastName').value
        const address = document.querySelector('#address').value
        const city = document.querySelector('#city').value
        const email = document.querySelector('#email').value

        const order = {
            contact: {
                firstName: `${ firstName }`,
                lastName: `${ lastName }`,
                address: `${ address }`,
                city: `${ city }`,
                email: `${ email }`
            },
            products: this.productsInOrder
        }

        return order
    }

    /**
     * 
     *  Will render the orderId in confirmation page
     * 
     * @param {string} orderId 
     */
    getConfirmationMessage(orderId) {
        const orderSpan = document.querySelector('#orderId')
        orderSpan.innerText = orderId
        window.localStorage.removeItem('cart')
    }
}
