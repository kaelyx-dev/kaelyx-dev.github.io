import { useConfigStore } from "@/stores/ConfigStore"
import { findShortcode, generateShortcodeMap } from "./shortcode"

import { h } from "vue"


export default htmlString => {
    const config = useConfigStore()
    const content = config.getValue("content.shortcodes.enabled") ? generateShortcodeMap(htmlString, config.getValue("content.shortcodes.removeunknown")) : htmlString

    const vnodes = parseHtmlToVNodes(content.text, content.placeholder, content.map)
    return vnodes.filter(e => (typeof e) === "object" )
}

const convertNodeToVNode = (node, placeholder, shortcodes) => {

    if(node.nodeType === 3) return node.textContent

    if(node.nodeType !== 1) return null

    let tag = node.tagName.toLowerCase()

    // shortcode placeholder parsing
    if(tag === placeholder) {
        const id = node.getAttribute('data-id')
        const sc = findShortcode(id, shortcodes)
        if(sc && sc.component) return sc.component
    }

    const attrs = {}
    for (const attr of node.attributes) {
        attrs[attr.name] = attr.value
    }

    const children = Array.from(node.childNodes).map(e => convertNodeToVNode(e, placeholder, shortcodes))
    return h(tag, attrs, children)
}

const parseHtmlToVNodes = (html, placeholder, shortcodes) => {
    const parser = new DOMParser()
    const file = parser.parseFromString(html, 'text/html')
    return Array.from(file.body.childNodes).map(e => convertNodeToVNode(e, placeholder, shortcodes))
}