/**
 * Creating product model
 */

export class Product {
    constructor (jsonProduct) {
        this.id = jsonProduct._id
        this.name = jsonProduct.name
        this.price = jsonProduct.price
        this.imageUrl = jsonProduct.imageUrl
        this.description = jsonProduct.description
        this.altTxt = jsonProduct.altTxt
        this.colors = jsonProduct.colors
    }
}
