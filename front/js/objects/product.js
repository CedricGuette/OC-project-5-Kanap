import { Cart } from './cart.js'

export class Product {

    _elementIdentifier = null

    constructor (product) {
        this._id = product._id
        this._name = product.name
        this._price = product.price
        this._imageUrl = product.imageUrl
        this._description = product.description
        this._altTxt = product.altTxt
        this._colors = product.colors
    }

// Setting all getters
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

    // Set an identifier to all render methods depending of what kind of page the object is rendering
    set elementIdentifier(elementTag) {
        this._elementIdentifier = elementTag
    }

    /**
     * 
     *  Will render the product card in index.html usin
     * 
     * @param {int} productIndex The order of the product to be shown
     */
    getProductCard(productIndex) {
        this.elementIdentifier = `[href="./product.html?id=${this.id}"]`
        this.setFirstElement('a','#items',[['href',`./product.html?id=${this.id}`]], productIndex)       
        this.addElementWithText('article', '', '', 'a')
        this.addElementImage(this.imageUrl, `${this.altTxt}, ${this.name}`, 'article')
        this.addElementWithText('h3', 'productName', this.name, 'article')
        this.addElementWithText('p', 'productDescription', this.description, 'article')
    }

    /**
     * 
     *  Main method in product page, will render a product card
     * 
     */
    getOneProduct() {
        this.elementIdentifier = '.item'
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
        const cart = new Cart(this.id)
        cart.addToCart()
    }

    /**
     * 
     *  Will render a product in the cart using the information from localhost and server
     * 
     * @param {int} quantity how many of this product is in the cart
     * @param {string} colorPicked which color of this product is in the cart
     * @param {int} elementIndex the order of the product to be shown
     */
    getProductInCart(quantity, colorPicked, elementIndex) {
        this.elementIdentifier = `[data-id="${ this.id }"][data-color="${ colorPicked }"]`
        const attributesArticle = [
            ['class', 'cart__item'],
            ['data-id', this.id],
            ['data-color', colorPicked]
        ]
        this.setFirstElement('article', '#cart__items', attributesArticle, elementIndex)
        this.addElementWithText('div', 'cart__item__img', '', '')
        this.addElementImage(this.imageUrl, this.altTxt, '.cart__item__img') 
        this.addElementWithText('div', 'cart__item__content', '', '')       
        this.addElementWithText('div', 'cart__item__content__description', '', '.cart__item__content')
        this.addElementWithText('h2', '', this.name, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('p', '', colorPicked, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('p', '', `${this.price} €`, '.cart__item__content > .cart__item__content__description')
        this.addElementWithText('div', 'cart__item__content__settings', '','')
        this.addElementWithText('div', 'cart__item__content__settings__quantity', '', '.cart__item__content__settings')
        this.addElementWithText('p', '', 'Qté : ', '.cart__item__content__settings > .cart__item__content__settings__quantity')
        const attributesInput = [
            ['type','number'],
            ['name','itemQuantity'],
            ['min','1'],
            ['max','100'],
            ['value', quantity]
        ]
        this.addElementWithAttribut('input', 'itemQuantity', '', '.cart__item__content__settings > .cart__item__content__settings__quantity', attributesInput, null)
        this.addElementWithText('div', 'cart__item__content__settings__delete', '', '.cart__item__content__settings')
        this.addElementWithText('p', 'deleteItem', 'Supprimer', '.cart__item__content__settings > .cart__item__content__settings__delete')
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
        element.innerText = innerText
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
        let parentElement = '' 
        // Checking if there is a parentClass
        if(parentClass !== ''){  
            parentElement = document.querySelector(`${this.elementIdentifier} > ${parentClass}`)
        }
        else {
            parentElement = document.querySelector(`${this.elementIdentifier}`)
        }

        element.src = imageUrl
        element.alt = altTxt
        parentElement.appendChild(element)
    }

    setElementIdentifier(colorPicked, option) {
        this.elementIdentifier = `[href="./product.html?id=${this.id}"]`
        this.elementIdentifier = `[data-id="${ this.id }"][data-color="${ colorPicked }"]`
        this.elementIdentifier = '.item'
    }
}
