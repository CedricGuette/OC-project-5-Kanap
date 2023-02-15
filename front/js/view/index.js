import { App } from '../objects/app.js'
import { ConfigLoader } from '../objects/config.js'

/**
 * Main function of index page calls app object
 * @async
 */
async function main(){
    const config =  new ConfigLoader()
    const host = config.host
    
    const serverRequest = new App(host)
    serverRequest.getAllProducts()

    return
}   

main()
