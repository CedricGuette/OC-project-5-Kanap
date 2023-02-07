import { ProductInCart } from './product.js'

export class CartInProductPage {

    _cart = []
    _colorPicked = ''
    _quantity = 0

    constructor(id) {
        this._id = id
    }

    get id() {
        return this._id
    }
    get colorPicked() {
        return this._colorPicked
    }
    get quantity() {
        return this._quantity
    }
    get cart() {
        return this._cart
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
    

    // Method used to put a product in cart
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
     *  EventListener on color of product selector
     * @returns {string} colorsOption color picked by customer in this.colorPicked
     */
    listenToColor() {
        const colorsItem = document.querySelector('#colors')
        colorsItem.addEventListener('change', (event) => {
        this.colorPicked = event.target.value
        })
    }

    /**
     *  EventListener on how many products are selected (quantity)
     * @returns {string} quantity picked by customer
     */
    listenToQuantity() {
        const quantitySelecter = document.querySelector('#quantity')
        quantitySelecter.addEventListener('change', (event) =>{
        this.quantity = parseInt(event.target.value)
        })
    }

    /**
     *  Will return if cart entries are valid with alert messages if not
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
     *  First check id, then color
     *  Will return false if he can't finds product in cart or will call isAmountOfProductinCartValide
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
     *  Will add the product in localstorage if the amount in cart is available
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
            return true
        }
    }
    
    // AddEventListener on quantity of product to trigger all modification process
    modifyQuantityListener() {
        const elementIdentifier = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]`
        const quantityValue = document.querySelector(`${elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__quantity > .itemQuantity`)
        quantityValue.addEventListener('change', (event) => { this.changeFromCart(event) })
    }

    // Will set cart from localstorage or set it empty
    setCartFromLocalstorage() {
        if(window.localStorage.getItem('cart') !== null) {
            this.cart = JSON.parse(window.localStorage.getItem('cart'))
            for(let i = 0 ; i < this.cart.length ; i++) {
                (this.cart[i])[2] = parseInt((this.cart[i])[2])
            }
        }
    }

    // Will replace cart in localhost storage
    replaceCartInLocalstorage() {
        window.localStorage.removeItem('cart')
        window.localStorage.setItem('cart', JSON.stringify(this.cart))
    }

    // Will delete a product from localstorage
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

export class CartInOrderPage extends CartInProductPage {

    constructor (id, colorPicked, quantity, productIndex, price, products) {
        super(id)
        this._colorPicked = colorPicked
        this._quantity = quantity
        this._productIndex = productIndex
        this._price = price
        this._products = products
    }

    get productIndex() {
        return this._productIndex
    }
    get price() {
        return this._price
    }
    get products() {
        return this._products
    }
    

    set productIndex(index) {
        this._productIndex = index
    }
    set price(cost) {
        this._price = cost
    }

    /**
     *  Main method to render a product card on cart page
     * @param {object} product 
     */
    getCart() {
        const productInCart = new ProductInCart(this.products, this.productIndex, this.colorPicked, this.quantity)
        productInCart.getProductInCart()
        this.deleteButtonListener()
        this.modifyQuantityListener()
        this.setPrice()
    }

    // Will modificate the price on cart page
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

    // Will calculate the price using the gap between quantities before/after operation
    modifyPrice(gap) {
        const priceSpan = document.querySelector('#totalPrice')
        const articleSpan = document.querySelector('#totalQuantity')

        let totalPrice = priceSpan.innerText
        let totalQuantity = articleSpan.innerText

        totalPrice = parseInt(totalPrice)
        totalQuantity = parseInt(totalQuantity)
        this.quantity = this.quantity + gap

        totalPrice = totalPrice + (this.price * gap)
        totalQuantity = totalQuantity + gap
        console.log('totalPrice : ', totalPrice)
        console.log('totalQuantity : ', totalQuantity)

        priceSpan.innerText = totalPrice
        articleSpan.innerText = totalQuantity
        // if(this.quantity === 0){
        //     const elementIdentifier = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]`
        //     const productElement = document.querySelector(`${elementIdentifier}`)
        //     this.deleteFromCart(productElement)
        // }  bugging when I select 0 (not deleting from localstorage)
    }

    // Will calculte the gap between initial quantity and quantity in addEventListener
    changeFromCart(event) {
        this.setCartFromLocalstorage()
        let currentValue = parseInt(event.target.value)
        console.log('currentValue: ', currentValue)
        console.log('this.quantity: ', this.quantity)

        if(currentValue == 0||currentValue > 100) {
            alert("Veuillez choisir un nombre d'article correcte svp")
            return false

        } else {

                const gap = currentValue - this.quantity 
                console.log(gap)
                this.modifyPrice(gap)

            this.cart[this.productIndex] = [this.id, this.colorPicked, currentValue]
            this.replaceCartInLocalstorage()
        }
    }    

    /**
     *  Will delete a product from localstorage and the element in page
     * @param {HTMLElement} domElement 
     */
    deleteFromCart(domElement) {
        this.setCartFromLocalstorage()
        this.deleteProductFromLocalstorage()
        this.cart.splice(this.productIndex, 1)
        document.querySelector('#cart__items').removeChild(domElement)
    }

    // AddEventListener on delete button of product to trigger all delete process
    deleteButtonListener() {
        const elementIdentifier = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]` /// MARKER
        const deleteButton = document.querySelector(`${elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__delete > .deleteItem`)
        const domElement = document.querySelector(`${elementIdentifier}`)
        deleteButton.addEventListener('click', () => { this.deleteFromCart(domElement) })
    }
}
