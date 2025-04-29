const metaObj = {
    Title        : undefined,
    Type         : undefined,
    Date         : undefined,
    Keywords     : undefined,
    showPermalink: undefined,
    showReadTime : undefined
}

const generateDefaultMetaObj = () => {
    let metaObj = structuredClone(metaObj)
    let defaultValues = {Type: "GENERAL", showPermalink: false, showReadTime: false}

    Object.keys(defaultValues).forEach(e => metaObj[e] = defaultValues[e])

    return metaObj
}

export const parseMeta = meta => {
    let newMeta = generateDefaultMetaObj()

    Object.keys(meta).forEach(e => newMeta[e] = metaObj[e])

    if(meta.type.toUpperCase() == "ARTICLE") {
        newMeta.showPermalink = true
        newMeta.showReadTime  = true
    }
    
    return meta
}