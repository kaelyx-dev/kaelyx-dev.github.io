import { useConfigStore } from "@/stores/ConfigStore"
import getQueryParams from "@utility/getQueryParams"


export const getPermalinkQueryParam = () => {
    const config = useConfigStore()
    let queryParams = getQueryParams()
    if(Object.keys(queryParams).length == 0) return
    return decodePermalink(queryParams[config.getValue("content.permalink.querykey")])
}

export const decodePermalink = encodedLink => {
    const config = useConfigStore()
    switch(config.getValue("content.permalink.encoding").toUpperCase()){
        case "BASE64": return decodeURIComponent(atob(encodedLink))
        case "PLAIN":
        default: return encodedLink
    }
}

export const encodePermaLink = unencodedLink => {
    const config = useConfigStore()
    switch(config.getValue("content.permalink.encoding").toUpperCase()){
        case "BASE64": return encodeURIComponent(btoa(unencodedLink))
        case "PLAIN":
        default: return unencodedLink
    }
}