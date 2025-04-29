import htmlToVNode from "./htmlToVNode";
import mdToHtml from "./mdToHtml";

const startChar = "<!--"
const endChar   = "-->"
const regexPattern = () => new RegExp(`${startChar}(?<meta>.*?)${endChar}`, "g")


export default md => {

    let _content = {meta: {}, content: [], length: md.trim().split(/\s+/).length}
    if (!md || md.length == 0) return _content

    getAllMetaFields(md).forEach(e => {
        _content.meta[e.name] = e.value
    })

    _content.content = htmlToVNode(mdToHtml(md))
    return _content
}


const getAllMetaFields = md => {
    let x = [...md.matchAll(regexPattern())].map(e => {
        let [name, value] = e.groups.meta.split(":")
        return {name: name.toLowerCase().trim(), value: interpretValue(value.trim())}
    })
    return x
}

const interpretValue = val => {
    if(val.indexOf(",") != -1) return val.split(",")
    return val
}