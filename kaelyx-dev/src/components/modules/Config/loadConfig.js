import getConfigFile from '@module/Request/Utilities/getConfigFile'

import baseConfig from '@config/site'

import devConfig from '@config/dev'

const CONFIG_LIST_DELIMITER = ";"
const CONFIG_COMMENT_CHARACTER = "#"

export default async () => {
    let config = getInitialConfig()

    let localConfig = localStorage.getItem(config["config.persistence.keyname"])
    let _config = config

    if(config["config.persistence.forcerefresh"] || localConfig == null || hasLocalInvalidated()) _config = {..._config, ...(await loadFromRemote(_config))}
    else  _config = {..._config, ...loadFromLocal(_config)}

    if(Object.keys(devConfig).length > 0) {
        _config = {..._config, ...devConfig}
    }

    Object.keys(_config).forEach(k => _config[k] = interpretValue(_config[k]))

    return _config
}

const loadFromLocal = config => {
    return JSON.parse(localStorage.getItem(config.persistence.key_name))
}

const loadFromRemote = async config => {
    let remote = await getRemoteConfigFile(config)

    saveToLocal(config, remote)

    return remote
}

const saveToLocal = (config, newConfig) => {
    localStorage.setItem(config["config.persistence.timestampkey"], getCurrentTimestamp())
    localStorage.setItem(config["config.persistence.keyname"], JSON.stringify(newConfig))
}

const interpretValue = value => {
    if(value.toLowerCase().trim() == 'true') return true;        // Boolean Check (True)
    else if(value.toLowerCase().trim() == 'false') return false; // Boolean Check (False)
    else if(/^\d+$/.test(value)) return +value                   // Integer
    else if(value.indexOf(CONFIG_LIST_DELIMITER) != -1) return value.split(CONFIG_LIST_DELIMITER)
    return value
}

const getRemoteConfigFile = async config => {
    let file = await getConfigFile(config, config["config.remote.location"])
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

const getInitialConfig = () => {
    return parseConfigFile(baseConfig.value)
}

// Local Storage Cache Invalidation calculation
const getCurrentTimestamp = () => Math.floor(new Date().getTime() / 1000)
const getTimeout          = config => config["config.persistence.invalidate"]
const hasLocalInvalidated = config => ((+localStorage.getItem(config["config.persistence.timestampkey"])) + getTimeout(config)) < getCurrentTimestamp()
