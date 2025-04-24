import config from '@config/config_shortCodes'
import { getComponent } from '@module/shortCode/shortCodes/getShortCode'

export default text => {
    text = "This is a string with a {{<helloworld>}} short code within in and a {{<nonexistant>}} shortcode too, or a {{<helloworld with=props>}} or {{<helloworld with=more props=values>}}"
    let shortCodes = findAllShortCodes(text)

    shortCodes.forEach(code => {
        console.log(code)
    })
}


const regexPattern = () => {
    const s = config.syntax.start
    const e = config.syntax.end
    return new RegExp(`${regexEscape(s)}\\s*(?<shortcode>[^\\s>]+)(?:\\s+(?<args>[^}]+))?\\s*${regexEscape(e)}`,"g")
}

const regexEscape = str => {
    return str.split("").map(e => `\\${e}`).join("")
}

const findAllShortCodes = text => {
    return [...text.matchAll(regexPattern())].map(e => {
        let name = e.groups["shortcode"]
        let _props = {}

        if(e.groups['args']) { 
            e.groups['args'].split(" ").map(e => {
                let _a = e.split("=")
                return _props[_a[0]] = _a[1]
            })
        } else _props = undefined
        return {
            name : name,
            code : e[0],
            props: _props,
            component : createShortCodeComponent(name)
        }
    })//.filter(e => e.component != undefined)
}

const createShortCodeComponent = shortCodeName => {
    const component = getComponent(shortCodeName)
    return component
}