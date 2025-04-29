const metaObj = {
    Title    : undefined,
    Type     : undefined,
    Date     : undefined,
    Keywords : undefined
}

const generateDefaultMetaObj = () => {
    let metaObj = structuredClone(metaObj)
    let defaultValues = {Type: "GENERAL"}

    Object.keys(defaultValues).forEach(e => metaObj[e] = defaultValues[e])
    return metaObj
}

export const parseMeta = meta => {
    let meta = generateDefaultMetaObj()


    // do the meta parsing stuff here


    return meta
}