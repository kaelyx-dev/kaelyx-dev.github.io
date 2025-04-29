import getQueryParams from "@utility/getQueryParams"
import config from '@config/config_contentParser'

export const getPermalinkQueryParam = () => {
    let queryParams = getQueryParams()
    if(Object.keys(queryParams).length == 0) return
    return decodePermalink(queryParams[config.permalink.queryKey])
}

export const decodePermalink = encodedLink => {

    switch(config.permalink.encoding.toUpperCase()){
        case "BASE64": return decodeURIComponent(atob(encodedLink))
        case "PLAIN":
        default: return encodedLink
    }
}

export const encodePermaLink = unencodedLink => {
    switch(config.permalink.encoding.toUpperCase()){
        case "BASE64": return encodeURIComponent(btoa(unencodedLink))
        case "PLAIN":
        default: return unencodedLink
    }
}