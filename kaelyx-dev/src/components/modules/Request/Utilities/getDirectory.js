import axios from 'axios'
import { useConfigStore } from '@/stores/ConfigStore'


export default async (directoryPath, dirFileName) => {
    const config = useConfigStore()

    let res
    try {
        if(directoryPath == "/") directoryPath = ""

        let getReqPath = config.getValue("site.base") + (directoryPath ?? "") + dirFileName

        res = await axios(getReqPath)

    }catch(error){
        res = error
    }

    if(res.code != undefined && res.code == "ERR_BAD_REQUEST"){
        return undefined
    }

    if(res.status != undefined && res.status == 200) {
        return res.data
    }

    return res
}