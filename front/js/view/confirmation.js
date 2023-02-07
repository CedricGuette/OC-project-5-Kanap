import { AppGetByParam } from '../objects/app.js'
import { ConfigLoader } from '../objects/config.js'

async function main(){
    const config =  new ConfigLoader()
    const host = config.host
    const param = 'orderId'
    
    const serverRequest = new AppGetByParam(host, param)
    serverRequest.getConfirmation()

    return
}   

main()
