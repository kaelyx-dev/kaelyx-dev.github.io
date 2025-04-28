import config from '@config/config_directoryWalker'
import getDirectory from '../../Request/Utilities/getDirectory'


export const getDirectoryStructure = async () => {
    let localConfig = localStorage.getItem(config.persistence.key_name)
    let _dir = {}

    if(config.persistence.force_refresh || localConfig == null || hasLocalInvalidated()){
        _dir = await buildDirectory()
        saveToLocal(_dir)
    } else {
        _dir = loadFromLocal()
    }
    return _dir
}

const loadFromLocal = () => {
    return JSON.parse(localStorage.getItem(config.persistence.key_name))
}

const saveToLocal = newDir => {
    localStorage.setItem(config.persistence.timestamp_key, getCurrentTimestamp())
    localStorage.setItem(config.persistence.key_name, JSON.stringify(newDir))
}

export const buildDirectory = async () => {
    const base = config.base
    const directoryFile = config.directory_file
    const folderChar = config.folder_character
    const metaChar = config.meta_name_character

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
const getTimeout          = () => config.persistence.invalidate
const hasLocalInvalidated = () => ((+localStorage.getItem(config.persistence.timestamp_key)) + getTimeout()) < getCurrentTimestamp()