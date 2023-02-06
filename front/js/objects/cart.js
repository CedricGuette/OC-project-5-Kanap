import { Product } from './product.js'

export class Cart {

    constructor(id) {
        this._id = id
        this._cart = []
        this._colorPicked = ''
        this._quantity = 0
        this._productIndex = 0
        this._price = 0
    }

    get id() {
        return this._id
    }
    get cart() {
        return this._cart
    }
    get colorPicked() {
        return this._colorPicked
    }
    get quantity() {
        return this._quantity
    }
    get productIndex() {
        return this._productIndex
    }
    get price() {
        return this._price
    }

    set id(idOfProduct) {
        this._id = idOfProduct
    }
    set cart(cartInArray) {
        this._cart = cartInArray
    }
    set colorPicked(color) {
        this._colorPicked = color
    }
    set quantity(howMany) {
        this._quantity = howMany
    }
    set productIndex(index) {
        this._productIndex = index
    }
    set price(cost) {
        this._price = cost
    }

    /**
     * 
     *  Method used to put a product in cart
     * 
     */
    addToCart() {
        this.listenToQuantity()
        this.listenToColor()
        // We listen to the add content button
        const addButton = document.querySelector('#addToCart')
        addButton.addEventListener('click', () => {

            if(this.isCartEntryValid() === true) {
                this.setCartFromLocalstorage()

                if(this.isProductAlreadyinCart() === false) {
                    this.cart.push([this.id, this.colorPicked, this.quantity])
                    this.replaceCartInLocalstorage(this.cart)
                    alert('Votre selection a bien été ajoutée au panier')
                }
            }
        })
    }


    /**
     * 
     *  EventListener on color of product selector
     * 
     * @returns {string} colorsOption color picked by customer in this.colorPicked
     */
    listenToColor() {
        const colorsItem = document.querySelector('#colors')
        colorsItem.addEventListener('change', (event) => {
        this.colorPicked = event.target.value
        })
    }

    /**
     * 
     *  EventListener on how many products are selected (quantity)
     * 
     * @returns {string} quantity picked by customer
     */
    listenToQuantity() {
        const quantitySelecter = document.querySelector('#quantity')
        quantitySelecter.addEventListener('change', (event) =>{
        this.quantity = parseInt(event.target.value)
        })
    }

    /**
     * 
     *  Will return if cart entries are valid with alert messages if not
     * 
     * @returns {boolean} 
     */
    isCartEntryValid() {
        if(this.colorPicked === '') {
            alert('Veuillez choisir une couleur svp')
            return false
        }
        else if(this.quantity <= 0 || this.quantity > 100) {
            alert("Veuillez choisir un nombre d'article correcte svp")
            return false
        } 
        else {
            return true
        }
    }

    /**
     * 
     *  First check id, then color
     *  Will return false if he can't finds product in cart or will call isAmountOfProductinCartValide
     * 
     * @returns {boolean} 
     */
    isProductAlreadyinCart() {

        for(let i = 0;  i < this.cart.length; i++) {
            const currentProduct = this.cart[i]

            if(this.id === currentProduct[0]) {

                if(this.colorPicked === currentProduct[1]){  
                    this.isAmountOfProductInCartValide(currentProduct, i)
                    return true
                }
            }
        }

        return false
    }

    /**
     * 
     *  Will add the product in localstorage if the amount in cart is available
     * 
     * @param {array} currentProduct 
     * @param {int} positionInCart position of picked product in the array
     * @returns {boolean}
     */
    isAmountOfProductInCartValide (currentProduct, positionInCart) {
        
        if(this.quantity + currentProduct[2] > 100){ 
            alert("Vous avez dépassé le nombre d'article possible dans votre panier !")
            return false
        } else {
            const newQuantity = this.quantity + currentProduct[2]
            this.cart[positionInCart] = [this.id, this.colorPicked, newQuantity]
            this.replaceCartInLocalstorage(this.cart)
            alert('Votre selection a bien été ajoutée au panier')
        }
    }

    /**
     * 
     *  Main method to render a product card on cart page
     * 
     * @param {object} product 
     */
    getCart(product) {
        const productInCart = new Product(product)
        productInCart.getProductInCart(this.quantity, this.colorPicked, this.productIndex)
        this.deleteButtonListener()
        this.modifyQuantityListener()
        this.setPrice()
    }

    /**
     * 
     *  Will modificate the price on cart page
     * 
     */
    setPrice() {
        const priceSpan = document.querySelector('#totalPrice')
        const articleSpan = document.querySelector('#totalQuantity')
        let totalPrice = priceSpan.innerText
        let totalQuantity = articleSpan.innerText

        totalPrice = parseInt(totalPrice)
        totalQuantity = parseInt(totalQuantity)
        totalPrice = totalPrice + (this.price * this.quantity)
        totalQuantity = totalQuantity + this.quantity

        priceSpan.innerText = totalPrice
        articleSpan.innerText = totalQuantity
    }

    /////////// A MODIFIER /////////////
    modifyPrice(operation, quantity) {
        const normalize = parseInt(quantity)
        const priceSpan = document.querySelector('#totalPrice')
        const articleSpan = document.querySelector('#totalQuantity')

        let totalPrice = priceSpan.innerText
        let totalQuantity = articleSpan.innerText

        totalPrice = parseInt(totalPrice)
        totalQuantity = parseInt(totalQuantity)

        if(operation === 0) {
            totalPrice = totalPrice - (this.price * normalize)
            totalQuantity = totalQuantity - quantity
        } else {
            totalPrice = totalPrice + (this.price * quantity)
            totalQuantity = totalQuantity + quantity
        }

        priceSpan.innerText = totalPrice
        articleSpan.innerText = totalQuantity
    }


    /**
     * 
     *  Will delete a product from localstorage and the element in page
     * 
     * @param {*} domElement 
     */
    deleteFromCart(domElement) {
            this.setCartFromLocalstorage()
            this.deleteProductFromLocalstorage(this.id, this.colorPicked)
            this.cart.splice(this.productIndex, 1)
            this.modifyPrice('SUBSTRACT', this.quantity)
            document.querySelector('#cart__items').removeChild(domElement)
    }

    /**
     * 
     *  AddEventListener on delete button of product to trigger all delete process
     * 
     */
    deleteButtonListener() {
        const elementIdentifier = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]`
        const deleteButton = document.querySelector(`${elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__delete > .deleteItem`)
        const domElement = document.querySelector(`${elementIdentifier}`)
        deleteButton.addEventListener('click', () => { this.deleteFromCart(domElement) })
    }

    //////////// A MODIFIER /////////////
    changeFromCart(event) {
        this.setCartFromLocalstorage()
        let currentValue = event.target.value

        if(currentValue === 0) {
            this.deleteFromCart()
        }
        if(currentValue > 100) {
            alert("Veuillez choisir un nombre d'article correcte svp")
        } else {
            let difference = parseInt(this._quantity) - parseInt(currentValue)
            console.log(difference)

            if(difference >= 0){
                this.modifyPrice(0, difference)
            } else{
                difference = Math.abs(difference)
                console.log(difference)
                this.modifyPrice(1, difference)
            }
            
            this.cart[this.productIndex] = [this.id, this.colorPicked, parseInt(currentValue)]
            this.replaceCartInLocalstorage()
        }
    }
    
    /**
     * 
     *  AddEventListener on quantity of product to trigger all modification process
     * 
     */
    modifyQuantityListener() {
        const elementIdentifier = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]`
        const quantityValue = document.querySelector(`${elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__quantity > .itemQuantity`)
        quantityValue.addEventListener('change', (event) => { this.changeFromCart(event) })
    }

    /**
     * 
     *  Will set cart from localstorage or set it empty
     * 
     */
    setCartFromLocalstorage() {
        if(window.localStorage.getItem('cart') !== null) {
            this.cart = JSON.parse(window.localStorage.getItem('cart'))
            for(let i = 0 ; i < this.cart.length ; i++) {
                (this.cart[i])[2] = parseInt((this.cart[i])[2])
            }
        }
    }

    /**
     * 
     *  Will replace cart in localhost storage
     * 
     */
    replaceCartInLocalstorage() {
        window.localStorage.removeItem('cart')
        window.localStorage.setItem('cart', JSON.stringify(this.cart))
    }

    /**
     * 
     *  will delete a product from localstorage
     * 
     */
    deleteProductFromLocalstorage() {
        const localStorage = JSON.parse(window.localStorage.getItem('cart'))
        for(let i = 0 ; i < localStorage.length ; i++) {
            const currentProduct = localStorage[i] 
            if(currentProduct[0] === this.id) {
                if(currentProduct[1] === this.colorPicked) {
                    localStorage.splice(i, 1)
                }
            }
        }
        this.cart = localStorage
        this.replaceCartInLocalstorage()
    }
}
