import { marked } from "marked"
import sanitise from "./sanitise"

export default md => {
    marked.use({
        gfm: true,
        renderer: {}
    })
    
    md = removeZWC(md)
    let html = marked.parse(md)
    let cleanHtml = sanitise(html)
    return cleanHtml
}

const removeZWC = md => md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")

const makeImageSrcAbsolute = (href, title, text) => {
    (href)  ? href  = `alt="${href}"`  : href  = ""
    (title) ? title = `alt="${title}"` : title = ""
    (text)  ? text  = `alt="${text}"`  : text  = ""

    return `<img ${href} ${title} ${text} /><p>HELLO WORLD</p>`
}

const highlightCode = (code, infostring) => {
    return "<h1>"+code + "</h1>"
}