import getQueryParams from "@utility/getQueryParams"
import config from '@config/config_permalink'

export const getPermalinkQueryParam = () => {
    let queryParams = getQueryParams()
    if(Object.keys(queryParams).length == 0) return
    return decodePermalink(queryParams[config.QueryKey])
}

export const decodePermalink = encodedLink => {

    switch(config.Encoding.toUpperCase()){
        case "BASE64": return decodeURIComponent(atob(encodedLink))
        case "PLAIN":
        default: return encodedLink
    }
}

export const encodePermaLink = unencodedLink => {
    switch(config.Encoding.toUpperCase()){
        case "BASE64": return encodeURIComponent(btoa(unencodedLink))
        case "PLAIN":
        default: return unencodedLink
    }
}