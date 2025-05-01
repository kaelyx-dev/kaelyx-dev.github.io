const metaObj = {
    title        : undefined,
    type         : undefined,
    date         : undefined,
    keywords     : undefined,
    showpermalink: undefined,
    showreadtime : undefined
}

const generateDefaultMetaObj = () => {
    let _obj = {...metaObj}
    let defaultValues = {type: "GENERAL", showpermalink: false, showreadtime: false}

    Object.keys(defaultValues).forEach(e => _obj[e] = defaultValues[e])

    return _obj
}

export const parseMeta = meta => {
    let newMeta = {... generateDefaultMetaObj()}
    if(Object.keys(meta).length == 0) return newMeta

    Object.keys(meta).forEach(e => {
        newMeta[e.toLowerCase()] = meta[e.toLowerCase()]
    })

    if(meta.type.toUpperCase() == "ARTICLE") {
        newMeta.showpermalink = true
        newMeta.showreadtime  = true
    }
    return newMeta
}