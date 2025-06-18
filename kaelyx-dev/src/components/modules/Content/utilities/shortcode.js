import { h } from 'vue'

import HelloWorld from "@module/Content/components/shortcodes/HelloWorld.vue"
import Icon from "@module/Content/components/shortcodes/Icon.vue"
import { useConfigStore } from '@/stores/ConfigStore'
import Link from '@module/Content/components/shortcodes/Link.vue'
import Image from '@module/Content/components/shortcodes/Image.vue'
import Console from '@module/Content/components/shortcodes/Console.vue'
import Project from '@module/Content/components/shortcodes/Project.vue'
import ProjectTechStack from '@module/Content/components/shortcodes/ProjectTechStack.vue'

const shortCodes = {
    "HELLOWORLD": HelloWorld,
    "ICON": Icon,
    "LINK": Link,
    "IMAGE": Image,
    "CONSOLE" : Console,
    "PROJECT" : Project,
    "PROJECTTECHSTACK" : ProjectTechStack
}

const regexPattern = () => {
    const config = useConfigStore()

    const s = config.getValue("content.shortcodes.syntax.start")
    const e = config.getValue("content.shortcodes.syntax.end")
    return new RegExp(`${regexEscape(s)}\\s*(?<shortcode>\\w+)(?<args>(?:\\s+\\w+=(?:"[^"]*"|\\S+))*)\\s*${regexEscape(e)}`,"g")
}

const regexEscape = str => {
    return str.split("").map(e => `\\${e}`).join("")
}

export const generateShortcodeMap = (text, removeUnknownShortcodes) => {
    const config = useConfigStore()

    if(!text || text.length <= 0) return ""
    let shortCodes = findAllShortCodes(text)
    const placeholderTagName = config.getValue("content.shortcodes.placeholder")

    shortCodes.forEach(shortcode => {

        if(shortcode.component) text = text.replace(shortcode.code, shortcode.placeholder)
        else if(removeUnknownShortcodes) text = text.replace(shortcode.code, "")

    })

    return {
        text: text,
        placeholder: placeholderTagName,
        map : shortCodes.filter(e => e)
    }
}

const findAllShortCodes = (text) => {
    return [...text.matchAll(regexPattern())].map((e, idx) => {
        let _id = `sc_${idx}_${Math.random().toString(16).slice(4)}`
        let name = e.groups["shortcode"]
        let _props = {}

        let _component = getComponent(name)




        if (e.groups['args']){
            const argRegex = /\b(\w+)=("([^"]*)"|(\S+))/g;
            let argMatch;
            while ((argMatch = argRegex.exec(e.groups['args'])) !== null) {
                _props[argMatch[1]] = argMatch[3] || argMatch[4];
            }
        }else _props = undefined

        // if(e.groups['args']) {
        //     e.groups['args'].split(" ").map((e) => {
        //         let _a = e.split("=")
        //         return _props[_a[0]] = _a[1]
        //     })
        // } else _props = undefined
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
const generatePlaceholderNode = id => {
    const config = useConfigStore()
    const placeholderTagName = config.getValue("content.shortcodes.placeholder")
    return `<${placeholderTagName} data-id=\"${id}\"></${placeholderTagName}>`

}

export const findShortcode = (id, list) => {
    return list.filter(e => e.id == id)[0]
}

export const getComponent = componentName => {
    return shortCodes[Object.keys(shortCodes).filter(e => e.toUpperCase() == componentName.toUpperCase())[0]]
}