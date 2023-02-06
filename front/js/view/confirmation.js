import { App } from '../objects/app.js'
import { ConfigLoader } from '../objects/config.js'

async function main(){
    const config =  new ConfigLoader()
    const host = config.host
    
    const serverRequest = new App(host)
    serverRequest.getConfirmation()

    return
}   

main()
