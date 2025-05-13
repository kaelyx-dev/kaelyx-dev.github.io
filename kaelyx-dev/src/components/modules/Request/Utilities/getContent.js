import axios from 'axios'

export default async (base, contentPath) => {

    if(contentPath == "") return
    let res
    try {
        if(base.endsWith("/")) base = base.substring(0, base.length - 1)
        res = await axios(base + ( contentPath ?? ""))
    }catch(error){
        res = error
    }

    if(res.code != undefined && res.code == "ERR_BAD_REQUEST"){
        return ""
    }

    if(res.status != undefined && res.status == 200) {
        return res.data
    }
}