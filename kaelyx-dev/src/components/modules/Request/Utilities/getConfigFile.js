import axios from 'axios'

import config from '@config/config_requester.json'


export default async confLocation => {
    let res
    try {
        res = await axios(config.base + ( confLocation ?? ""))
    }catch(error){
        res = error
    }

    if(res.code != undefined && res.code == "ERR_BAD_REQUEST"){
        console.log("Bad Request")
        return ""
    }

    if(res.status != undefined && res.status == 200) {
        return res.data
    }
}