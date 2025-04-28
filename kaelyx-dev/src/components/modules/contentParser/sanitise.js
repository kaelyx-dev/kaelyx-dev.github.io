import DOMPurify from 'dompurify'
export default dirtyHtml => {
    let cleanHtml = DOMPurify.sanitize(dirtyHtml)
    return cleanHtml
}