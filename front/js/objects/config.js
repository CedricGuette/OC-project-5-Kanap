/**
 * Object that contains dev environment configuration
 */
export class ConfigLoader {
    constructor() {
        this._host = 'http://localhost:3000/api/products/'
    }

    get host() {
        return this._host
    }

}
