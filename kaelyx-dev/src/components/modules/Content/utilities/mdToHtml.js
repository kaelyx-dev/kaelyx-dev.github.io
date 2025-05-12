import { marked } from "marked"
import sanitise from "./sanitise"
import { useConfigStore } from "@store/ConfigStore"
import { useDirectoryStore } from "@/stores/DirectoryStore"

export default md => {
    const renderer = new marked.Renderer();

    renderer.code = code => highlightCode(code)
    renderer.image  = image => makeImageSrcAbsolute(image)

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
    console.log(token)
    const config = useConfigStore()
    const directory = useDirectoryStore()

    let href = token.href;

    if (href && href.startsWith('./')) href = config.getValue("site.base") + directory.getActiveContentDirectory() + href.slice(1)

    const alt = token.text || '';

    const title = token.title ? `${token.title}` : '';

    if(!title) return `<img src="${href}" alt="${alt}"/>`
    else return `<div class="image-wrapper"><figure><img src="${href}" alt="${alt}"${title}/><figcaption>${title}</figcaption></figure></div>`;

};

const highlightCode = code => {
    return `<pre><code class="${code.lang ? `language-${code.lang}` :""}">${code.text}</code></pre>`;
}