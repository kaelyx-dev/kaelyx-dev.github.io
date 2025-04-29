const metaObj = {
    Title        : undefined,
    Type         : undefined,
    Date         : undefined,
    Keywords     : undefined,
    showPermalink: undefined,
    showReadTime : undefined
}

const generateDefaultMetaObj = () => {
    let _obj = structuredClone(metaObj)
    let defaultValues = {Type: "GENERAL", showPermalink: false, showReadTime: false}

    Object.keys(defaultValues).forEach(e => _obj[e] = defaultValues[e])

    return _obj
}

export const parseMeta = meta => {


    let newMeta = generateDefaultMetaObj()
    if(Object.keys(meta).length == 0) return newMeta

    Object.keys(meta).forEach(e => newMeta[e] = meta[e])
    console.log(meta)
    if(meta.type.toUpperCase() == "ARTICLE") {
        newMeta.showPermalink = true
        newMeta.showReadTime  = true
    }
    
    return newMeta
}