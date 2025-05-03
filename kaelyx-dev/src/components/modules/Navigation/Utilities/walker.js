import getDirectory from '../../Request/Utilities/getDirectory'

let config

export const getDirectoryStructure = async _config => {
    config = _config
    let localConfig = localStorage.getItem(config.getValue("directory.persistence.keyname"))
    let _dir = {}

    if(config.getValue("directory.persistence.forcerefresh") || localConfig == null || hasLocalInvalidated()){
        _dir = await buildDirectory()
        saveToLocal(_dir)
    } else {
        _dir = loadFromLocal()
    }

    return _dir
}

const loadFromLocal = () => {
    return JSON.parse(localStorage.getItem(config.getValue("directory.persistence.keyname")))
}

const saveToLocal = newDir => {
    localStorage.setItem(config.getValue("directory.persitence.timestampkey"), getCurrentTimestamp())
    localStorage.setItem(config.getValue("directory.persistence.keyname"), JSON.stringify(newDir))
}

export const buildDirectory = async () => {
    const base = config.getValue("directory.base")
    const directoryFile = config.getValue("directory.directoryfile")
    const folderChar = config.getValue("directory.foldercharacter")
    const metaChar = config.getValue("directory.metacharacter")

    return await walk(base, directoryFile, folderChar, metaChar)
}

const walk = async (base, directoryFile, folderChar, metaChar) => {
    const dir = await getDirectory(base, directoryFile)

    if (!dir) return

    const parsed = parseDirectoryFile(dir, folderChar, metaChar, base)

    for (const [folderName, folderObj] of Object.entries(parsed.folders)) {
        const subTree = await walk(folderObj.link, directoryFile, folderChar, metaChar)

        if (hasContent(subTree)) {
            parsed.folders[folderName] = {
                ...folderObj,
                ...subTree
            }
        } else {
            delete parsed.folders[folderName]
        }
    }
    return parsed
}

const parseDirectoryFile = (dir, fc, mc, base) => {
    const folders = {}
    const files = {}

    dir.split("\n")
       .filter(e => e.trim().length > 0)
       .forEach(e => {
           if (e.startsWith(fc)) {
               const { name, metaName } = parseFolderMetaName(e, mc, fc)
               folders[name] = {
                   name,
                   metaName,
                   link: generateFolderLink(base, name),
                   folders: {},
                   files: {}
               }
           } else {
               const { name, metaName, fileName } = parseFileMetaName(e, mc)
               files[name] = {
                   name,
                   metaName,
                   link: generateFileLink(base, fileName)
               }
           }
       })

    return { folders, files }
}

const parseFolderMetaName = (entry, mc, fc) => {
    const [name, metaName] = entry.replace(fc, "").split(mc)
    return { name, metaName: metaName ?? name }
}

const parseFileMetaName = (entry, mc) => {
    const [name, metaName] = entry.split(mc)
    const _a = name.split(".")[0]
    return { name: _a, metaName: metaName ?? _a, fileName: name }
}

const generateFolderLink = (base, name) => base + name + "/"
const generateFileLink = (base, name) => base + name

const hasContent = subTree => subTree && (Object.keys(subTree.folders).length > 0 || Object.keys(subTree.files).length > 0)

// Local Storage Cache Invalidation calculation
const getCurrentTimestamp = () => Math.floor(new Date().getTime() / 1000)
const getTimeout          = () => config.getValue("directory.persistence.invalidate")
const hasLocalInvalidated = () => ((+localStorage.getItem(config.getValue("directory.persistence.timestampkey"))) + getTimeout()) < getCurrentTimestamp()