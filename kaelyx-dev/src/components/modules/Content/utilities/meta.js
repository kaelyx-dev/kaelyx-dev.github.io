const metaObj = {
    title        : undefined,
    type         : undefined,
    date         : undefined,
    keywords     : undefined,
    showpermalink: undefined,
    showreadtime : undefined,
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

    // if the type is article or blog, show permalink and read time
    if(meta.type.toUpperCase() == "ARTICLE") {
        newMeta.showpermalink = true
        newMeta.showreadtime  = true
    }

    return newMeta
}
// Template for meta data in markdown files
//<!-- Title: Readme.md -->
//<!-- Type: ARTICLE -->
//<!-- Date: 24/04/2025 -->
//<!-- Keywords: a,b,c,d,e-->
//<!-- ShowPermalink: true -->
//<!-- ShowReadTime: true -->