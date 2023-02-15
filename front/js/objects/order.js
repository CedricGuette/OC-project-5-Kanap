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
     * Main method is called to render cart resume 
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
    /**
     * Check the validity of all form inputs and 
     * @returns {boolean} true if form is valid
     */
    checkValidityForm() {
        this.addErrorMessageSimplified('firstName','prénom', 0)
        this.addErrorMessageSimplified('lastName','nom', 1) // allows spaces in case of multiple last names
        this.addErrorMessageSimplified('address','addresse', 2)
        this.addErrorMessageSimplified('city','ville', 0)
        this.addErrorMessage('email','Veuillez renseigner une addresse email valide', 3)

        if(this.regexer('firstName', 0)
            && this.regexer('lastName', 1) 
            && this.regexer('address', 2)
            && this.regexer('city', 0)
            && this.regexer('email', 3)) {
            return true
        } else {
            return false
        }
    }

    /**
     *  Will render errorMessage in right HTMLElement if the input of parentTag is not valid
     * @param {string} fieldName 
     * @param {string} errorMessage 
     */
    addErrorMessage(fieldName, errorMessage, indexRegex) {

        const errorElement = document.querySelector(`#${fieldName}ErrorMsg`)

        if(!this.regexer(fieldName, indexRegex)){
            errorElement.innerText = errorMessage
        } else {
            errorElement.innerText = ''
        }
    }

    /**
     *  Will check if entries are valid and return true or false
     *
     * @param {string} fieldName Wich field it gonna test
     * @param {int} indexRegex will select the regex rules in typeOfRegex array
     * @returns {boolean} true if test is valid
     */
    regexer(fieldName, indexRegex) {
        const typeOfRegex = [
            "^[a-zA-ZâàéèëêöôûùüïîÂÀÉÈËÊÖÛÙÜÏÎ'\-]{2,20}$", // First name and City fields
            "^[a-zA-ZâàéèëêöôûùüïîÂÀÉÈËÊÖÛÙÜÏÎ'\-'\ ]{2,20}$", // Last name allows space           
            "^[a-zA-Z0-9âàéèëêöôûùüïîÂÀÉÈËÊÖÛÙÜÏÎ'\-'\ ]{2,60}$", // Address field
            "^[a-zA-Z0-9.'\-_]{1,64}[@]{1}[a-zA-Z0-9.'\-_]{2,255}[.]{1}[a-z]{2,10}$" // Email field
        ]

        const field = document.querySelector(`#${fieldName}`)
        const regExp = new RegExp(typeOfRegex[indexRegex], 'g')
        return regExp.test(field.value)
    }

    /**
     *  Will call previous method to add 'veuillez renseigner votre' at fieldName string
     * @param {string} parentTag tag in form field
     * @param {string} fieldName 
     * @param {int} indexRegex will be used to select a regex rule in array
     */
    addErrorMessageSimplified(parentTag, fieldName, indexRegex) {
        let errorMessage = 'Veuillez renseigner votre'
        errorMessage = errorMessage + ` ${fieldName}`
        this.addErrorMessage(parentTag, errorMessage, indexRegex)
    }

    // Main method to submit the order
    submit() {
        const form = document.querySelector('form')
        form.setAttribute('novalidate','true') // to block submit field
        form.addEventListener('submit', (event) =>{
            event.preventDefault()

            if(this.checkValidityForm()) { // test all fields to allow submission
                this.getProductList()
                if (this.productsInOrder == false){ // check if cart is empty
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

    /**
     * Initialize and make order list of products id
     */
    getProductList() {
        this.productsInOrder = []
        const currentLocalStorage = JSON.parse(localStorage.getItem('cart'))

        if(currentLocalStorage) {

            for(let i = 0 ; i < currentLocalStorage.length ; i++){
                const currentArray = currentLocalStorage[i]
                this.productsInOrder.push(currentArray[0])
            }
        }
    }

    /**
     *  Will return the order object from all inputs and this.productsInOrder
     * @returns {object} order object for server request
     */
    getContactObject() {

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
