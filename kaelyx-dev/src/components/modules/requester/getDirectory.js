import axios from 'axios'
import config from '@config/config_requester.json'

export default async (directoryPath, dirFileName) => {
    let res
    try {

        if(directoryPath == "/") directoryPath = ""
        let getReqPath = config.base + (directoryPath ?? "") + dirFileName
        res = await axios(getReqPath)
    }catch(error){
        console.log("OOPS")
        console.log(error)
        res = error
    }

    if(res.code != undefined && res.code == "ERR_BAD_REQUEST"){
        console.log("Bad Request")
        return undefined
    }

    if(res.status != undefined && res.status == 200) {
        return res.data
    }

    return res
}