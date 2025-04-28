import config from '@config/config_configHandler.json'
import getConfigFile from '@module/Request/Utilities/getConfigFile'

const CONFIG_LIST_DELIMITER = ";"
const CONFIG_COMMENT_CHARACTER = "#"

export default async () => {
    let localConfig = localStorage.getItem(config.persistence.key_name)
    let _config = {}

    if(config.persistence.force_refresh || localConfig == null || hasLocalInvalidated()) {
        _config = await loadFromRemote()
    } else {
        _config = loadFromLocal()
    }

    Object.keys(_config).forEach(k => _config[k] = interpretValue(_config[k]))
    return _config
}

const loadFromLocal = () => {
    return JSON.parse(localStorage.getItem(config.persistence.key_name))
}

const loadFromRemote = async () => {
    let remote = await getRemoteConfigFile()

    saveToLocal(remote)

    return remote
}

const saveToLocal = newConfig => {
    localStorage.setItem(config.persistence.timestamp_key, getCurrentTimestamp())
    localStorage.setItem(config.persistence.key_name, JSON.stringify(newConfig))
}

const interpretValue = value => {
    if(value.toLowerCase().trim() == 'true') return true;        // Boolean Check (True)
    else if(value.toLowerCase().trim() == 'false') return false; // Boolean Check (False)
    else if(/^\d+$/.test(value)) return +value                   // Integer
    else if(value.indexOf(CONFIG_LIST_DELIMITER) != -1) return value.split(CONFIG_LIST_DELIMITER)
    return value
}

const getRemoteConfigFile = async () => {
    let file = await getConfigFile(config.config_location)
    return parseConfigFile(file)
}

const parseConfigFile = file => {
    let _config = {}

    let lineDelimiter = (file[file.indexOf('\n') - 1] == '\r') ? '\r\n' : '\n'
    file.split(lineDelimiter).filter(e => e.length > 0).filter(e => !e.startsWith(CONFIG_COMMENT_CHARACTER)).map(e => parseLine(e)).forEach(e => _config[e.key] = e.value)

    return _config
}

const parseLine = line => {
    let _a = line.split("=", 2)
    if(_a.length <= 1) return undefined
    return {key: _a[0].trim(), value: _a[1].split(CONFIG_COMMENT_CHARACTER)[0].trim()}
}

// Local Storage Cache Invalidation calculation
const getCurrentTimestamp = () => Math.floor(new Date().getTime() / 1000)
const getTimeout          = () => config.persistence.invalidate
const hasLocalInvalidated = () => ((+localStorage.getItem(config.persistence.timestamp_key)) + getTimeout()) < getCurrentTimestamp()
