import config from '@config/config_shortCodes'
import { getComponent } from '@module/shortCode/shortCodes/getShortCode'
import { h } from 'vue'

const placeholderTagName = config.placeholder

// TODO : Test text with no shortcodes

// MD2HTML -> Sanitize -> shortCodes -> vnodeParser

export default text => {
    if(!text || text.length <= 0) return ""
    let shortCodes = findAllShortCodes(text)

    shortCodes.forEach(shortcode => {
        text = text.replace(shortcode.code, shortcode.placeholder)
    })

    return {
        text: text,
        placeholder: placeholderTagName,
        map : shortCodes
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

const findAllShortCodes = text => {
    return [...text.matchAll(regexPattern())].map((e, idx) => {
        let _id = generateShortCodeID(idx)
        let name = e.groups["shortcode"]
        let _props = {}

        let _component = getComponent(name)
        if(_component == undefined) return

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
    }).filter(e => e)
}

const createHyperscriptObject = (component, props) => (component) ? props ? h(component, props) : h(component) : undefined

const generateShortCodeID = val => {
    return `sc_${val}_${Math.random().toString(16).slice(4)}`
}

const generatePlaceholderNode = id => `<${placeholderTagName} data-id=\"${id}\"></${placeholderTagName}>`