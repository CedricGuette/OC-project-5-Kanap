import { ProductInCart } from './product.js'

/**
* All these object are used to set the cart in local storage and in order page
*/

/**
 * This object will be used to add products in cart
 * 
 * @param {string} id id of the product in cart
 */
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
    
    /**
     * Main method calling all event listeners to trigger the adding in cart process
     */
    addToCart() {
        this.listenToQuantity() // will set this.quantity
        this.listenToColor() // will set this.colorPicked

        const addButton = document.querySelector('#addToCart')
        addButton.addEventListener('click', () => { // if add to cart button is clicked

            if(this.isCartEntryValid()) { // checking validity of eventListeners color and quantity
                this.setCartFromLocalstorage() // set this.cart to localstorage 'cart' value
                const currentProductInCart = this.isProductAlreadyinCart()

                if(!currentProductInCart) { // if false, will push it in cart array
                    this.cart.push([this.id, this.colorPicked, this.quantity])
                    this.productAddedToCart()
                } else {

                    const currentProduct = currentProductInCart[1] // we extract the array of product [id, colorPicked, quantity]
                    const positionOfProductInCart = currentProductInCart[0] // we extract position int
                    const amountValid = this.isAmountOfProductInCartValide(currentProduct) 

                    if(!amountValid) { // test if new quantity is not availaible
                        alert("Vous avez dépassé le nombre d'article possible dans votre panier !")
                    } else {
                        this.cart[positionOfProductInCart] = [this.id, this.colorPicked, amountValid] // updating quantity in this.cart
                        this.productAddedToCart() // uploading localstorage and giving the customer an alert and redirect to index.html
                    }
                }
            }
        })
    }

    /**
    *  EventListener on color of product selector will set the right color picked by customer
    */
    listenToColor() {
        const colorsItem = document.querySelector('#colors')
        colorsItem.addEventListener('change', (event) => {
        this.colorPicked = event.target.value
        })
    }

    /**
     *  EventListener on how many products are selected (quantity) will set this.quantity
     */
    listenToQuantity() {
        const quantitySelecter = document.querySelector('#quantity')
        quantitySelecter.addEventListener('change', (event) =>{
        this.quantity = parseInt(event.target.value)
        })
    }

    /**
     *  Will return false if cart entries are not valid with alert messages, else will return true
     * @returns {boolean} false if color is not picked, if quantity is not valid and true if it pass all tests
     */
    isCartEntryValid() {
        if(!this.colorPicked) {
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
     * @returns {array} false if product is not in cart position of the product in cart plus currentproduct array if product is already in cart [positionInCart, [id, colorPicked, quantity]] 
     */
    isProductAlreadyinCart() {

        for(let i = 0;  i < this.cart.length; i++) {
            const currentProduct = this.cart[i]

            if(this.id === currentProduct[0] && this.colorPicked === currentProduct[1]) {
                const resolution = [i, currentProduct]
                return resolution
            }
        }
        return false
    }

    /**
     *  Will say if the amount of product in cart added to selection is available
     * @param {array} currentProduct single product used to be compared
     * @returns {int} if product is already in cart and added to new selection is over 100 returns false else will returns newQuantity as validQuantity
     */
    isAmountOfProductInCartValide (currentProduct) {
        const newQuantity = this.quantity + currentProduct[2] // we add new quantity to existing
        if(newQuantity > 100){ 
            return false
        } else {
            return newQuantity
        }
    }
    /**
     * Simple method to be called if adding a new product or adding more product already in cart to cart
     */
    productAddedToCart() {
        this.replaceCartInLocalstorage()
        alert('Votre selection a bien été ajoutée au panier')
        location.href = `./index.html`
    }
    /**
     * Will set cart from localstorage or set it empty
     */
    setCartFromLocalstorage() {
        if(localStorage.getItem('cart')) {
            this.cart = JSON.parse(localStorage.getItem('cart'))
            for(let i = 0 ; i < this.cart.length ; i++) {
                (this.cart[i])[2] = parseInt((this.cart[i])[2])
            }
        }
    }

    /**
     * Will replace cart in localhost storage
     */ 
    replaceCartInLocalstorage() {
        localStorage.removeItem('cart')
        localStorage.setItem('cart', JSON.stringify(this.cart))
    }
}

/**
 *  This object is used or order page
 * @param {string} id id of the product (from local storage)
 * @param {string} colorPicked color picked by the customer (from local storage)
 * @param {int} quantity how many of this product (from local storage)
 * @param {int} price price of the product (from json object)
 */
export class CartInOrderPage extends CartInProductPage {

    constructor (id, colorPicked, quantity, price) {
        super(id)
        this._colorPicked = colorPicked
        this._quantity = quantity
        this._price = price
    }

    get price() {
        return this._price
    }
    get elementIdentifier() {
        const elementMarker = `[data-id="${ this.id }"][data-color="${ this.colorPicked }"]`
        return elementMarker
    }

    /**
     *  Main method to render a product card on cart page
     * @param {object} product product to be called in cart page
     * @param {int} productIndex in which position to add HTML element
     */
    getCart(product, productIndex) {
        const productInCart = new ProductInCart(product, productIndex, this.colorPicked, this.quantity)
        productInCart.getProductInCart()
        this.deleteButtonListener()
        this.modifyQuantityListener()
        this.setPrice() // initialize price and quantity
    }

    /**
     * AddEventListener on delete button of product to trigger all delete process
     */ 
    deleteButtonListener() {
        const deleteButton = document.querySelector(`${this.elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__delete > .deleteItem`)
        deleteButton.addEventListener('click', () => { this.deleteFromCart() })
    }

    /**
     * AddEventListener on quantity of product to trigger all modification process
     */
    modifyQuantityListener() {
        const quantityValue = document.querySelector(`${this.elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__quantity > .itemQuantity`)
        quantityValue.addEventListener('change', (event) => { this.changeFromCart(event) })
    }

    /**
     * If gap not set, will initialize price and quantity, else will modificate the price on cart page
     * @param {int} gap difference to apply 
     */
    setPrice(gap) {
        const priceSpan = document.querySelector('#totalPrice')
        const articleSpan = document.querySelector('#totalQuantity')
        let totalPrice = priceSpan.innerText
        let totalQuantity = articleSpan.innerText
        totalPrice = parseInt(totalPrice)
        totalQuantity = parseInt(totalQuantity)

        if(!gap){
            totalPrice = totalPrice + (this.price * this.quantity)
            totalQuantity = totalQuantity + this.quantity
        } else {
            this.quantity = this.quantity + gap
            totalPrice = totalPrice + (this.price * gap)
            totalQuantity = totalQuantity + gap
        }

        priceSpan.innerText = totalPrice
        articleSpan.innerText = totalQuantity
    }

    /**
     * Will check quantity validity, if over 100 returns an alert, if 0 will delete product from cart, else will replace quantity
     * @param {int} event new quantity selected by customer
     */
    changeFromCart(event) {
        this.setCartFromLocalstorage()
        let currentValue = parseInt(event.target.value)

        if(currentValue > 100) {
            alert("Veuillez choisir un nombre d'article correcte svp")
        }else if(currentValue === 0){
            this.deleteFromCart()
        } else {
            this.modifyCartQuantity(currentValue)
        }
    }

    /**
     * This one will replace the quantity in local storage and refresh total quantity and price
     * @param {int} currentValue
     */
    modifyCartQuantity(currentValue) {
        const gap = currentValue - this.quantity 
        this.setPrice(gap)
        const currentProductInCart = this.isProductAlreadyinCart() // call method to get position in cart
        const positionOfProductInCart = currentProductInCart[0]
        this.cart[positionOfProductInCart] = [this.id, this.colorPicked, currentValue]
        this.replaceCartInLocalstorage()
    }

    /**
     * Will delete a product from localstorage and the element in page
     */
    deleteFromCart() {
        const domElement = document.querySelector(this.elementIdentifier)
        this.setCartFromLocalstorage() // set this.cart
        this.modifyCartQuantity(0) // called to refresh price
        this.deleteProductFromLocalstorage() // delete product in local storage
        alert('Le produit a bien été retiré de votre panier')
        document.querySelector('#cart__items').removeChild(domElement)
    }
    /**
     * Will delete a product from localstorage with matching id and color
     */
    deleteProductFromLocalstorage() {
        const currentLocalStorage = JSON.parse(localStorage.getItem('cart'))
        for(let i = 0 ; i < currentLocalStorage.length ; i++) {
            const currentProduct = currentLocalStorage[i] 
            if(currentProduct[0] === this.id && currentProduct[1] === this.colorPicked) {
                currentLocalStorage.splice(i, 1)
            }
        }
        this.cart = currentLocalStorage
        this.replaceCartInLocalstorage()
    }

}
