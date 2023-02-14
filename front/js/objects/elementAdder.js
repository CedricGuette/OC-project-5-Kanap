
class ElementAdder {
    constructor(parentClass) {
        this._parentClass = parentClass
    }
    get parentClass() {
        return this._parentClass
    }
}

export class Image extends ElementAdder {
    constructor(parentClass, imageUrl, altTxt) {
        super(parentClass)
        this._imageUrl = imageUrl
        this._altTxt = altTxt
    }
    get altTxt() {
        return this._altTxt
    }
    get imageUrl() {
        return this._imageUrl
    }

    // Will add image in parentClass
    addElementImage() {
        const element = document.createElement('img')
        const parentElement = document.querySelector(`${this.parentClass}`)
        element.src = this.imageUrl
        element.alt = this.altTxt
        parentElement.appendChild(element)
    }
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
export class Text extends ElementAdder {
    constructor(parentClass, tagName, className, innerText) {
        super(parentClass)
        this._tagName = tagName
        this._className = className
        this._innerText = innerText
    }

    get tagName() {
        return this._tagName
    }
    get className() {
        return this._className
    }
    get innerText() {
        return this._innerText
    }

    addElementWithText() {
        const element = document.createElement(this.tagName)
        const parentElement = document.querySelector(`${this.parentClass}`)
        if(this.className) {
            element.classList.add(this.className)
        }
        element.innerText = this.innerText
        parentElement.appendChild(element)
    }
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
export class Attribute extends Text {
    constructor(parentClass, tagName, className, innerText, attributes, elementIndex) {
        super(parentClass, tagName, className, innerText)
        this._attributes = attributes
        this._elementIndex = elementIndex
    }
    get attributes() {
        return this._attributes
    }
    get elementIndex() {
        return this._elementIndex
    }


    addElementWithAttribut() {
        this.addElementWithText()
        let element = ''

        if(this.elementIndex){
        element = document.querySelectorAll(`${this.parentClass} > ${this.tagName}`)[this.elementIndex]
        } else {
        element = document.querySelector(`${this.parentClass} > ${this.tagName}`)
        }

        for(let i = 0 ; i < this.attributes.length ; i++) {

            const currentAttribute = this.attributes[i]
            element.setAttribute(currentAttribute[0], currentAttribute[1])
        }  
    }
}