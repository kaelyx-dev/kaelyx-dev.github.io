import { marked } from "marked"
import sanitise from "./sanitise"
import { useConfigStore } from "@store/ConfigStore"
import { useDirectoryStore } from "@/stores/DirectoryStore"

export default md => {
    const renderer = new marked.Renderer();

    renderer.code  = code => highlightCode(code)
    renderer.image = image => makeImageSrcAbsolute(image)
    renderer.link  = link => handleLinksIfInShortcodes(link)

    marked.use({
        gfm: true,
        renderer: renderer
    })

    md = removeZWC(md)
    let html = marked.parse(md)
    let cleanHtml = sanitise(html)

    return cleanHtml
}

const removeZWC = md => md.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,"")

const makeImageSrcAbsolute = (token) => {
    const config = useConfigStore()
    const directory = useDirectoryStore()

    let href = token.href;

    if (href && href.startsWith('./')) {
        let base = config.getValue("site.base")
        if(base.endsWith("/")) base = base.substring(0, base.length - 1)
        href = base + directory.getActiveContentDirectory() + href.slice(1)
    }

    const alt = `alt="${token.text}"` || '';
    const title = token.title ? `title="${token.title}"` : '';

    if(config.getValue("content.shortcodes.enabled")) {
        const s = config.getValue("content.shortcodes.syntax.start")
        const e = config.getValue("content.shortcodes.syntax.end")
        return `${s}image source=${href} ${alt} ${title}${e}`
    }else {
        if(!title) return `<img src="${href}" alt="${alt}"/>`
        else return `<div class="image-wrapper"><figure><img src="${href}" alt="${alt}"${title}/><figcaption>${title}</figcaption></figure></div>`;
    }
};

const highlightCode = code => {
    return `<pre><code class="${code.lang ? `language-${code.lang}` :""}">${code.text}</code></pre>`;
}

const handleLinksIfInShortcodes = link => {
    if(linkIsText(link)) return link.raw

    let href = `href="${link.href}"`
    let text = `${link.text || link.href}`
    return `<a ${href}>${text}</a>`
}

const linkIsText = link => link.raw == link.text && link.raw == link.href