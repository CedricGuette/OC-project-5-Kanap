import { CartInProductPage } from './cart.js'

/**
 * Methods related to products from db
 * @param {object} product
 */
export class Product {

    _elementIdentifier = ''

    constructor (product) {
        this._product = product
        this._id = product._id
        this._name = product.name
        this._price = product.price
        this._imageUrl = product.imageUrl
        this._description = product.description
        this._altTxt = product.altTxt
        this._colors = product.colors
    }

    get product() {
        return this._product
    }
    get id() {
        return this._id
    }
    get name() {
        return this._name
    }
    get price() {
        return this._price
    }
    get imageUrl() {
        return this._imageUrl
    }
    get description() {
        return this._description
    }
    get altTxt() {
        return this._altTxt
    }
    get colors() {
        return this._colors
    }
    get elementIdentifier() {
        return this._elementIdentifier
    }
  
    /**
     * Will inject a HTMLElement as <tagName class="className"> innerText </tagName>
     * in parent node identified by parentClass
     * 
     * @param {string} tagName <tagName></tagName>
     * @param {string} className can be an empty string !! don't use 'FirstClass' because it's a path to set correctly the FirstClass !!
     * @param {string} innerText can be an empty string
     * @param {string} parentClass !! must use selectors !!
     */
    addElementWithText(tagName, className, innerText, parentClass) {

        // Building the tag for every product and setting parentElement on empty
        const element = document.createElement(tagName)
        let parentElement = ''

        // First element particularity //
        if(className === 'FirstElement') {
            parentElement = document.querySelector(parentClass)
        } else if(parentClass === '') { // Checking if there is a parentClass to add it in selector
            parentElement = document.querySelector(`${this.elementIdentifier}`)
        } else if(parentClass === 'a') { // index page particularity //
            parentElement = document.querySelector(`${parentClass}${this.elementIdentifier}`)
        } else {
            parentElement = document.querySelector(`${this.elementIdentifier} > ${parentClass}`)
        }

        // Checking if there is a className
        if(className !== '') {
            element.classList.add(className)
        } else if(className === 'FirstElement') {
        // Do nothing to prevent adding a class if we set the first element //
        }
        element.innerText = this.innerText
        parentElement.appendChild(element)
    }

    /**
     * Will inject a HTMLElement as 
     * <tagName class="className" attibute-1 = value-1 attibute-2 = value-2 ...> inneText </tagName>
     * in parent node identified by parentClass
     * 
     * @param {string} tagName <tagName></tagName>
     * @param {string} className can be an empty string
     * @param {string} innerText can be an empty string
     * @param {string} parentClass !! must use selectors !!
     * @param {array} attributes !! Array on the model [['attribute','value'],[..,..]..]
     * @param {int} elementIndex set to null if not using an iteration
     */
    addElementWithAttribut(tagName, className, innerText, parentClass, attributes, elementIndex) {
        this.addElementWithText(tagName, className, innerText, parentClass)
        let element = ''
        console.log(this.elementIdentifier)
        // Checking if there is an index //
        if(elementIndex !== null) {
            element = document.querySelectorAll(`${parentClass} > ${tagName}`)[elementIndex]
        } else if(parentClass !== ''){ // Checking if there is a parentClass to set it correctly
            element = document.querySelector(`${this.elementIdentifier} > ${parentClass} > ${tagName}`)
        } else {
            element = document.querySelector(`${this.elementIdentifier} > ${tagName}`)
        }

        // Looping the array to set all attributes
        for(let i = 0 ; i < attributes.length ; i++) {
            const currentAttribute = attributes[i]
            element.setAttribute(currentAttribute[0], currentAttribute[1])
        }  
    }

    /**
     * This method will build an index to be used by other methods addElementWithText() and AddElementWithAttribute()
     * @param {string} tagName <tagName></tagName>
     * @param {string} wrapper To know where we gonna set the index of elements
     * @param {array} attributes array to set the element
     * @param {int} elementIndex must be set by the loop calling all products in the page
     */
    setFirstElement(tagName, wrapper, attributes, elementIndex) {

        // We call what we already use to set elements
        const innerText = ''
        const className = 'FirstElement'
        this.addElementWithAttribut(tagName, className, innerText, wrapper, attributes, elementIndex)
    }
    
    /**
     * Will inject a HTMLElement as 
     * <img src="imageUrl" alt="altTxt">
     * in parent node identified by parentClass 
     * @param {string} imageUrl 
     * @param {string} altTxt 
     * @param {string} parentClass !! must use selectors !!
     */
    addElementImage(imageUrl, altTxt, parentClass) {

        const element = document.createElement('img')
        const parentElement = document.querySelector(`${this.elementIdentifier} > ${parentClass}`)
        element.src = imageUrl
        element.alt = altTxt
        parentElement.appendChild(element)
    }
}

export class ProductCard extends Product {

    constructor(product, productIndex) {
        super(product)
        this._productIndex = productIndex
        this._elementIdentifier = `[href="./product.html?id=${this.id}"]`
    }
    get productIndex(){
        return this._productIndex
    }

    /**
     * 
     *  Will render the product card in index.html usin
     * 
     * @param {int} productIndex The order of the product to be shown
     */
        getProductCard() {
            console.log(this.elementIdentifier)
            this.setFirstElement('a','#items',[['href',`./product.html?id=${this.id}`]], this.productIndex)       
            this.addElementWithText('article', '', '', 'a')
            this.addElementImage(this.imageUrl, `${this.altTxt}, ${this.name}`, 'article')
            this.addElementWithText('h3', 'productName', this.name, 'article')
            this.addElementWithText('p', 'productDescription', this.description, 'article')
        }
}

export class ProductPage extends Product {

    _elementIdentifier = '.item'
    /**
     * Main method in product page, will render a product card
     */
    getOneProduct() {
        document.querySelector('title').innerText = this.name
        this.addElementImage(this.imageUrl, this.altTxt,'article > .item__img')
        document.querySelector('#title').innerText = this.name
        document.querySelector('#price').innerText = this.price
        document.querySelector('#description').innerText = this.description
        const colorsArray = this.colors
        for(let i = 0; i < colorsArray.length; i++) {
            let a = i + 1
            this.addElementWithAttribut('option', '', colorsArray[i], 'article > .item__content > .item__content__settings > .item__content__settings__color > #colors', [['value', colorsArray[i]]], a)
        }
        const cart = new CartInProductPage(this.id)
        cart.addToCart()
    }
}

export class ProductInCart extends ProductCard {

    constructor(product, productIndex, colorPicked, quantity){
        super(product, productIndex)
        this._colorPicked = colorPicked
        this._quantity = quantity
        this._elementIdentifier = `[data-id="${ this.id }"][data-color="${ colorPicked }"]`
    }

    get colorPicked() {
        return this._colorPicked
    }
    get quantity() {
        return this._quantity
    }


    /**
     * 
     *  Will render a product in the cart using the information from localhost and server
     * 
     * @param {int} quantity how many of this product is in the cart
     * @param {string} colorPicked which color of this product is in the cart
     * @param {int} elementIndex the order of the product to be shown
     */
    getProductInCart() {
        console.log(this.colorPicked)
        const attributesArticle = [
            ['class', 'cart__item'],
            ['data-id', this.id],
            ['data-color', this.colorPicked]
        ]
        this.setFirstElement('article', '#cart__items', attributesArticle, this.productIndex)
        this.addElementWithText('div', 'cart__item__img', '', '')
        this.addElementImage(this.imageUrl, this.altTxt, '.cart__item__img') 
        this.addElementWithText('div', 'cart__item__content', '', '')       
        this.addElementWithText('div', 'cart__item__content__description', '', '.cart__item__content')
        this.addElementWithText('h2', '', this.name, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('p', '', this.colorPicked, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('p', '', `${this.price} €`, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('div', 'cart__item__content__settings', '','')
        this.addElementWithText('div', 'cart__item__content__settings__quantity', '', '.cart__item__content__settings')
        this.addElementWithText('p', '', 'Qté : ', '.cart__item__content__settings > .cart__item__content__settings__quantity')
        const attributesInput = [
            ['type','number'],
            ['name','itemQuantity'],
            ['min','1'],
            ['max','100'],
            ['value', this.quantity]
        ]
        this.addElementWithAttribut('input', 'itemQuantity', '', '.cart__item__content__settings > .cart__item__content__settings__quantity', attributesInput, null)
        this.addElementWithText('div', 'cart__item__content__settings__delete', '', '.cart__item__content__settings')
        this.addElementWithText('p', 'deleteItem', 'Supprimer', '.cart__item__content__settings > .cart__item__content__settings__delete')
    }
}
