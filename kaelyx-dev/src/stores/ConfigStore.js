import { defineStore } from 'pinia'
import { computed, ref} from 'vue'
import loadConfig from '@module/Config/loadConfig'

export const useConfigStore = defineStore('config', () => {

    const config = ref({})
    const init = async () => {
        const _config = await loadConfig()
        config.value = _config
    }
    const clearConfig    = () => config.value = {}
    const setValue       = (k,v) => config.value[k] = v
    const setValues      = arr => arr.forEach(e => setValue(e[0], e[1]))
    const getValue       = (key, _default) => {
        if(_default != undefined) return config.value[key] == undefined ? _default : config.value[key]
        else return config.value[key]
    }
    const getConfig      = computed(() => config.value)
    const getConfigGroup = group => {
        let _a = {}
        config.value.forEach((k,v) => k.startsWith(group) ? _a[k.substring(group.length + 1)] = config.value[k] : null)
        return _a.filter(e => e != null)
    }

    return {
        init,
        clearConfig,
        setValue,
        setValues,
        getValue,
        getConfig,
        getConfigGroup
    }
})