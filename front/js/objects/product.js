import { CartInProductPage } from './cart.js'
import { Text, Image, Attribute } from './elementAdder.js'

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
     *  Will render the product card in index.html usin
     * @param {int} productIndex The order of the product to be shown
     */
        getProductCard() {
            const firstElement = new Attribute (`#items`, 'a', '', '', [['href',`./product.html?id=${this.id}`]], this.productIndex)
            firstElement.addElementWithAttribut()
            const article = new Text(`a${this.elementIdentifier}`, 'article', '', '')
            article.addElementWithText()
            const image = new Image(`${this.elementIdentifier} > article`, this.imageUrl, `${this.altTxt}, ${this.name}`)
            image.addElementImage()
            const h3 = new Text(`${this.elementIdentifier} > article`, 'h3', 'productName', this.name)
            h3.addElementWithText()
            const p = new Text(`${this.elementIdentifier} > article`, 'p', 'productDescription', this.description)
            p.addElementWithText()
    }
}

export class ProductPage extends Product {

    _elementIdentifier = '.item'
    /**
     * Main method in product page, will render a product card
     */
    getOneProduct() {
        document.querySelector('title').innerText = this.name
        const image = new Image('article > .item__img', this.imageUrl, this.altTxt)
        image.addElementImage()
        document.querySelector('#title').innerText = this.name
        document.querySelector('#price').innerText = this.price
        document.querySelector('#description').innerText = this.description

        let colorsArray = this.colors
        for(let i = 0; i < colorsArray.length; i++) {
            let a = i + 1
            const colorsOption = new Attribute(`${this.elementIdentifier} > article > .item__content > .item__content__settings > .item__content__settings__color > #colors `,
            'option', '', colorsArray[i], [['value', colorsArray[i]]], a)
            colorsOption.addElementWithAttribut()
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
     *  Will render a product in the cart using the information from localhost and server
     * @param {int} quantity how many of this product is in the cart
     * @param {string} colorPicked which color of this product is in the cart
     * @param {int} elementIndex the order of the product to be shown
     */
    getProductInCart() {
        const attributesArticle = [
            ['class', 'cart__item'],
            ['data-id', this.id],
            ['data-color', this.colorPicked]
        ]
        const article = new Attribute('#cart__items','article', '', '', attributesArticle, this.productIndex).addElementWithAttribut()
        const divImg = new Text(`article${this.elementIdentifier}`, 'div', 'cart__item__img','').addElementWithText()
        const image = new Image(`${this.elementIdentifier} > .cart__item__img`, this.imageUrl, this.altTxt).addElementImage()
        const divContent = new Text(`${this.elementIdentifier}`,'div', 'cart__item__content','').addElementWithText()
        const divDescription = new Text(`${this.elementIdentifier} > .cart__item__content`,'div', 'cart__item__content__description','').addElementWithText()
        const h2 = new Text(`${this.elementIdentifier} > .cart__item__content > div`,'h2', '', this.name).addElementWithText()
        const pColor = new Text(`${this.elementIdentifier} > .cart__item__content > div`, 'p','', this.colorPicked).addElementWithText()
        const pPrice = new Text(`${this.elementIdentifier} > .cart__item__content > div`, 'p', '', `${this.price} €`).addElementWithText()
        const divSettings = new Text(`${this.elementIdentifier}`, 'div', 'cart__item__content__settings', '').addElementWithText()
        const divQuantity = new Text(`${this.elementIdentifier} > .cart__item__content__settings`, 'div', 'cart__item__content__settings__quantity', '').addElementWithText()
        const pQuantity = new Text(`${this.elementIdentifier} > .cart__item__content__settings > div`, 'p', '', 'Qté : ').addElementWithText()

        const attributesInput = [
            ['type','number'],
            ['name','itemQuantity'],
            ['min','1'],
            ['max','100'],
            ['value', this.quantity]
        ]
        const inputQuantity = new Attribute(`${this.elementIdentifier} > .cart__item__content__settings > div`, 'input', 'itemQuantity', '',attributesInput, null).addElementWithAttribut()
        const divDelete = new Text(`${this.elementIdentifier} > .cart__item__content__settings`, 'div', 'cart__item__content__settings__delete', '').addElementWithText()
        const pDelete = new Text(`${this.elementIdentifier} > .cart__item__content__settings > .cart__item__content__settings__delete`, 'p', 'deleteItem', 'Supprimer').addElementWithText()
    }
}