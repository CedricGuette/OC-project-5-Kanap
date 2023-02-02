/**
 * Setting index views
 */

import { Product } from '../models/product.js'
// import { loadConfig } from './config.js'

// const config = await loadConfig()
// const host = config.host

// console.log(host)

/**
 * Inject all products from API in HTMLElement with .items class
 */
async function main() {
    await fetch(`http://localhost:3000/api/products`)
    .then(res => res.json())
    .then(products => {       
        generateAllProducts(products)
    })
    .catch(error => console.log( error ))
}

/**
 * Will generate all products from API in DOM
 * @param {json} products 
 */
function generateAllProducts(products) {

    for(let jsonProduct of products) {

        const product = new Product(jsonProduct)

        const itemsSection = document.querySelector('.items')

        const productLink = document.createElement('a')
        productLink.setAttribute('href', `./product.html?id=${product.id}`)
        itemsSection.appendChild(productLink)            

        const productElement = document.createElement('article')
        productLink.appendChild(productElement)

        const imageElement = document.createElement('img')
        imageElement.src = product.imageUrl
        imageElement.alt = `${product.altTxt}, ${product.name}`
        productElement.appendChild(imageElement)

        createElementWithText('h3', 'productName', product.name, productElement)
        createElementWithText('p', 'productDescription', product.description, productElement)

    }
}

/**
 * Will return in HTMLElement selected by containdeBy => <tagName class="className"> text </tagName>
 * @param {string} tagName 
 * @param {string} className 
 * @param {string} text 
 * @param {HTMLElement} containedBy 
 */
function createElementWithText (tagName, className, text, containedBy){
    const element = document.createElement(tagName)
    element.classList.add(className)
    element.innerText = text
    containedBy.appendChild(element)
}

main()
