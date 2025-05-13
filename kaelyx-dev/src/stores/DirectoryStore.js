import { getDirectoryStructure } from '@/components/modules/Navigation/Utilities/walker'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import getContent from '@module/Request/Utilities/getContent'
import parser from '@module/Content/utilities/parser'
import { parseMeta } from '@module/Content/utilities/meta'
import { useConfigStore } from './ConfigStore'
import setPageTitle from '@/components/utilities/setPageTitle'
export const useDirectoryStore = defineStore('directory', () => {

    let pages = ref({})
    let activeContentUrl = ref("")
    let content = ref([])
    let contentLength = ref(0)
    let meta = ref({})
    let loading = ref(false)

    const config = useConfigStore()

    const init = async permalink => {
        let directory = await getDirectoryStructure(config);
        pages.value = directory
        if(permalink) {
            setActivePage(permalink)
        } else if(window.location.pathname == "/"){
            setActivePage(await config.getValue("content.home"))
        } else {
            setActivePage(window.location.pathname)
        }
        await buildContent()
    }

    const getDirectory = () => {
        return pages.value
    }

    const setActivePage = pageLink => {
        activeContentUrl.value = pageLink
    }

    const buildContent = async () => {
        let file = await getContent(useConfigStore().getValue("site.base"), activeContentUrl.value)

        if(!file){
            setActivePage(await config.getValue("content.home"))
            return
        }

        let parsed = parser(file)
        content.value = parsed.content
        contentLength.value = parsed.length

        window.history.pushState("", parsed.meta.title || activeContentUrl.value, activeContentUrl.value)

        buildMeta(parsed.meta)

        setPageTitle( meta.value.title ? config.getValue("site.title", "KAELYX").toUpperCase() + " | " + meta.value.title : config.getValue("site.title", "KAELYX").toUpperCase())
    }

    const buildMeta = newMeta => {
        meta.value = parseMeta(newMeta)
    }

    const getActiveContentDirectory = () => activeContentUrl.value.split("/").slice(0, -1).join("/")

    watch(activeContentUrl, newActiveContentUrl => {
        if(newActiveContentUrl == activeContentUrl) return
        buildContent()
    })

    const isActiveContentUrlSet = computed(() => activeContentUrl.value.length > 0)

    return { init, getDirectory, setActivePage, pages, activeContentUrl, content, meta, contentLength, loading, isActiveContentUrlSet,getActiveContentDirectory}

})