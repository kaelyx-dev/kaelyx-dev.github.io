import config from '@config/config_directoryWalker'
import getDirectory from '../requester/getDirectory'

export const buildDirectory = async () => {
    let output = {}

    let base          = config.base
    let directoryFile = config.directory_file
    let folderChar    = config.folder_character
    let metaChar      = config.meta_name_character

    await walk(base, directoryFile, output, folderChar, metaChar)
    console.log(output)
    return output
}

const walk = async (base, directoryFile, output, folderChar, metaChar, rootObj) => {
    let dir = await getDirectory(base, directoryFile)

    if (!dir) return {}

    let parsedDir = parseDirectoryFile(dir, folderChar, metaChar, base)

    if (!rootObj) {
        output[base] = parsedDir
        rootObj = parsedDir
    } else {
        rootObj.folders = parsedDir.folders
        rootObj.files = parsedDir.files
    }

    for (const folderName of Object.keys(parsedDir.folders)) {
        let folderObj = parsedDir.folders[folderName]
        await walk(folderObj.link, directoryFile, output, folderChar, metaChar, folderObj)
    }
}



const parseDirectoryFile = (dir, fc, mc, base, root) => {
    let _a = {folders : {}, files: {}}
    dir = dir.split("\n").filter(e => e && e.length > 0)

    dir.forEach(e => {
        if(e.startsWith(fc)) {
            let _f = parseFolderMetaName(e,mc,fc)
            _a.folders[_f['name']] =
            {
                name    : _f['name'],
                metaName: _f['metaName'],
                link    : generateFolderLink(base, _f['name']),
                folders : {},
                files   : {}
            }
        }
        else {
            let _f = parseFileMetaName(e,mc,fc)
            _a.files[_f['name']] = {
                name    : _f['name'],
                metaName: _f['metaName'],
                link    : generateFileLink(base, _f['name'])
            }
        }
    })
    return _a
}

const parseFolderMetaName = (entry, mc, fc) => {
    let _b = entry.replace(fc, "").split(mc)
    return (_b.length > 1) ? {name: _b[0], metaName: _b[1]} : {name: _b[0], metaName: _b[0]}
}

const parseFileMetaName = (entry, mc, fc) => {
    let _b = entry.replace(fc, "").split(mc)
    return (_b.length > 1) ? {name: _b[0], metaName: _b[1]} : {name: _b[0], metaName: _b[0]}
}

const generateFolderLink = (base, name) => {
    return base + name + "/"
}

const generateFileLink = (base, name) => {
    return base + name
}