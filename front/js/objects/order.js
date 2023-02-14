import { AppSend } from '../objects/app.js'
import { ConfigLoader } from '../objects/config.js'
import { CartInOrderPage } from './cart.js'

/**
 *  This object has to collect all the infos from the order and customer to send a correct request to server
 * @param {object} products  list of products from db
 */
export class Order {

    _productsInOrder = []
    _contactInfo = {}
    
    constructor(products) {
        this._products = products
    }
    
    get products() {
        return this._products
    }
    get productsInOrder() {
        return this._productsInOrder
    }
    get contactInfo() {
        return this._contactInfo
    }

    set productsInOrder(product) {
        this._productsInOrder = product
    }
    set contactInfo(info) {
        this._contactInfo = info
    }

    /**
     * This method is called to render cart resume 
     */
    getOrderResume(){
        this.initTotalPrice()
        let productsInCart = JSON.parse(localStorage.getItem('cart'))

        if(!productsInCart) {
            productsInCart = []
        }
        let productIndex = 0

        for(let i = 0 ; i < this.products.length ; i++) {
            
            const currentProductInData = this.products[i]

            for(let i = 0 ; i < productsInCart.length ; i++){

                const currentProductInCart = productsInCart[i]
                if(currentProductInCart[0] === currentProductInData._id) {
                    const cart = new CartInOrderPage(currentProductInData._id, currentProductInCart[1], currentProductInCart[2], currentProductInData.price)
                    cart.getCart(currentProductInData, productIndex)
                    productIndex++
                }
            }
        }
        this.submit()
    }

    /**
     *  Method that iniate price countainer on HTML
     *  Required to make all operation of price rendering possible (we get the int into quantity and price element to calculate it)
     */
    initTotalPrice() {
        document.querySelector('#totalQuantity').innerText = 0
        document.querySelector('#totalPrice').innerText = 0
    }

    // Check the validity of all form inputs
    checkValidityForm() {
        this.addErrorMessageSimplified('firstName','prénom')
        this.addErrorMessageSimplified('lastName','nom')
        this.addErrorMessageSimplified('address','addresse')
        this.addErrorMessageSimplified('city','ville')
        this.addErrorMessage('email','Veuillez renseigner une addresse email valide')
    }

    /**
     *  Will render errorMessage in right HTMLElement if the input of parentTag is not valid
     * @param {string} parentTag 
     * @param {string} errorMessage 
     */
    addErrorMessage(parentTag, errorMessage) {
        const field = document.querySelector(`#${parentTag}`)
        const errorElement = document.querySelector(`#${parentTag}ErrorMsg`)
        if(!field.checkValidity()){
            errorElement.innerText = errorMessage
        } else {
            errorElement.innerText = ''
        }
    }

    /**
     *  Will call previous method to add 'veuillez renseigner votre' at fieldName string
     * @param {string} parentTag 
     * @param {string} fieldName 
     */
    addErrorMessageSimplified(parentTag, fieldName) {
        let errorMessage = 'Veuillez renseigner votre'
        errorMessage = errorMessage + ` ${fieldName}`
        this.addErrorMessage(parentTag, errorMessage)
    }

    // Main method to submit the order
    submit() {

        const form = document.querySelector('form')
        form.setAttribute('novalidate','true')
        form.addEventListener('submit', (event) =>{
            event.preventDefault()
            this.checkValidityForm()

            if(form.checkValidity()) {
                this.getProductList()
                if (this.productsInOrder == false){
                    alert('Votre panier est vide !')
                }
                 else {
                    const contact = this.getContactObject()
                    const config = new ConfigLoader()
                    const serverRequest = new AppSend(config.host, contact)
                    serverRequest.sendOrder()
                }
            }
        })
    }

    // initialize and make order list of products id or return false if localstorage is empty
    getProductList() {
        this.productsInOrder = []
        const currentLocalStorage = JSON.parse(localStorage.getItem('cart'))

        if(currentLocalStorage) {

            for(let i = 0 ; i < currentLocalStorage.length ; i++){
                const currentArray = currentLocalStorage[i]
                this.productsInOrder.push(currentArray[0])
            }
        } else {
            return false
        }
    }

    /**
     *  Will return the order object from all inputs and this.productsInOrder
     * @returns {object} order 
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
}
