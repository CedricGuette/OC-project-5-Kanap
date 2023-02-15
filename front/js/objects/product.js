import { CartInProductPage } from './cart.js'
import { Text, Image, Attribute } from './elementAdder.js'

/**
 * All these objects will be called to render products in each pages
 */

/**
 * Methods related to products from db
 * @param {object} product one object from GET request
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
}

/**
 * Will be called to render a product card in index page
 * 
 * @param {object} product one object from GET request
 * @param {int} productIndex used to put the HTML element in the right place
 */
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
    *  Will render the product card in index.html 
    */
    getProductCard() {
        new Attribute (`#items`, 'a', '', '', [['href',`./product.html?id=${this.id}`]], this.productIndex).addElementWithAttribut()
        new Text(`a${this.elementIdentifier}`, 'article', '', '').addElementWithText()
        new Image(`${this.elementIdentifier} > article`, this.imageUrl, `${this.altTxt}, ${this.name}`).addElementImage()
        new Text(`${this.elementIdentifier} > article`, 'h3', 'productName', this.name).addElementWithText()
        new Text(`${this.elementIdentifier} > article`, 'p', 'productDescription', this.description).addElementWithText()
    }
}

/**
 * Will be called to render a single product in product.html
 * 
 * @param {object} product one object from GET request
 */
export class ProductPage extends Product {
    
    /**
     * Main method in product page, will render the product page
     */
    getOneProduct() {
        document.title = this.name
        new Image('article > .item__img', this.imageUrl, this.altTxt).addElementImage()
        document.querySelector('#title').innerText = this.name
        document.querySelector('#price').innerText = this.price
        document.querySelector('#description').innerText = this.description

        let colorsArray = this.colors
        for(let i = 0; i < colorsArray.length; i++) {
            let a = i + 1
            new Attribute(`#colors `, 'option', '', colorsArray[i], [['value', colorsArray[i]]], a).addElementWithAttribut()
        }
        new CartInProductPage(this.id).addToCart()
    }
}

/**
 * @param {object} product one object from GET request
 * @param {int} productIndex used to put the HTML element in the right place
 * @param {sting} colorPicked wich color was picked by customer
 * @param {int} quantity how much of this product in cart
 */
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
     *  Will render a product in the cart using the information from localhost and server
     */
    getProductInCart() {
        const attributesArticle = [
            ['class', 'cart__item'],
            ['data-id', this.id],
            ['data-color', this.colorPicked]
        ]
        new Attribute('#cart__items','article', '', '', attributesArticle, this.productIndex).addElementWithAttribut()
        new Text(`article${this.elementIdentifier}`, 'div', 'cart__item__img','').addElementWithText()
        new Image(`${this.elementIdentifier} > .cart__item__img`, this.imageUrl, this.altTxt).addElementImage()
        new Text(`${this.elementIdentifier}`,'div', 'cart__item__content','').addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content`,'div', 'cart__item__content__description','').addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content > div`,'h2', '', this.name).addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content > div`, 'p','', this.colorPicked).addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content > div`, 'p', '', `${this.price} €`).addElementWithText()
        new Text(`${this.elementIdentifier}`, 'div', 'cart__item__content__settings', '').addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content__settings`, 'div', 'cart__item__content__settings__quantity', '').addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content__settings > div`, 'p', '', 'Qté : ').addElementWithText()
        const attributesInput = [
            ['type','number'],
            ['name','itemQuantity'],
            ['min','1'],
            ['max','100'],
            ['value', this.quantity]
        ]
        new Attribute(`${this.elementIdentifier} > .cart__item__content__settings > div`, 'input', 'itemQuantity', '',attributesInput, null).addElementWithAttribut()
        new Text(`${this.elementIdentifier} > .cart__item__content__settings`, 'div', 'cart__item__content__settings__delete', '').addElementWithText()
        new Text(`${this.elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__delete`, 'p', 'deleteItem', 'Supprimer').addElementWithText()
    }
}
