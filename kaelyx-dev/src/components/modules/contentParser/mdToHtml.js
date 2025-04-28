import { marked } from "marked"
import sanitise from "./sanitise"

export default md => {
    marked.use({
        gfm: true
    })
    
    md = removeZWC(md)
    let html = marked.parse(md)
    let cleanHtml = sanitise(html)
    return cleanHtml
}

const removeZWC = md => md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")