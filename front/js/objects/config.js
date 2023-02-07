/**
 * Object that contains configuration of dev environment 
 */
export class ConfigLoader {
    constructor() {
        this._host = 'http://localhost:3000/api/products/'
    }

    get host() {
        return this._host
    }

}
