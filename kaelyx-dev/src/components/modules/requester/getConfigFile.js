import axios from 'axios'

import config from '@config/config_requester.json'

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 OPR/117.0.0.0"
}

export default async confLocation => {
    let res
    try {
        res = await axios(config.base + ( confLocation ?? ""), {headers})
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