import config from '@config/config_shortCodes'
import { getComponent } from '@module/shortCode/shortCodes/getShortCode'
import { h } from 'vue'

const placeholderTagName = config.placeholder

export default (text, removeUnknownShortcode)=> {
    if(!text || text.length <= 0) return ""
    let shortCodes = findAllShortCodes(text)
    
    shortCodes.forEach(shortcode => {

        if(shortcode.component) text = text.replace(shortcode.code, shortcode.placeholder)
        else if(removeUnknownShortcode) text = text.replace(shortcode.code, "")
        
    })

    return {
        text: text,
        placeholder: placeholderTagName,
        map : shortCodes.filter(e => e)
    }
}

const regexPattern = () => {
    const s = config.syntax.start
    const e = config.syntax.end
    return new RegExp(`${regexEscape(s)}\\s*(?<shortcode>\\w+)(?<args>(?:\\s+\\w+=\\w+)*)\\s*${regexEscape(e)}`,"g")
}

const regexEscape = str => {
    return str.split("").map(e => `\\${e}`).join("")
}

const findAllShortCodes = (text) => {
    return [...text.matchAll(regexPattern())].map((e, idx) => {
        let _id = generateShortCodeID(idx)
        let name = e.groups["shortcode"]
        let _props = {}

        let _component = getComponent(name)        

        if(e.groups['args']) {
            e.groups['args'].split(" ").map((e) => {
                let _a = e.split("=")
                return _props[_a[0]] = _a[1]
            })
        } else _props = undefined
        return {
            id          : _id,
            name        : name,
            code        : e[0],
            props       : _props,
            component   : createHyperscriptObject(_component, _props),
            placeholder : generatePlaceholderNode(_id)
        }
    })
}

const createHyperscriptObject = (component, props) => (component) ? props ? h(component, props) : h(component) : undefined

const generateShortCodeID = val => {
    return `sc_${val}_${Math.random().toString(16).slice(4)}`
}

const generatePlaceholderNode = id => `<${placeholderTagName} data-id=\"${id}\"></${placeholderTagName}>`