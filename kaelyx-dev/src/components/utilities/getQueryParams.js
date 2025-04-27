export default () => {
    let _ = {}
    new URLSearchParams(window.location.search).forEach((value,key) => _[key] = value)
    return _
}