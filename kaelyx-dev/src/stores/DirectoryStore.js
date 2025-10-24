import { getDirectoryStructure } from '@/components/modules/Navigation/Utilities/walker'
import { defineStore } from 'pinia'
import { computed, ref, watch, inject } from 'vue'
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
            removePermalinkFromURI()
            setActivePage(permalink)
        } else if(window.location.hash.length == 0){
            setActivePage(await config.getValue("content.home"))
        } else {
            setActivePage(window.location.hash.slice(1))
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

        window.location.hash = activeContentUrl.value

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

    const findDirectory = input => {
        const parts = input.split("/").filter(p => p.length > 0);
        let current = getDirectory();
    
        for (const part of parts) {
            if (!current || !current.folders || !current.folders[part]) {
                return undefined;
            }
            current = current.folders[part];
        }
        return current;
    };
    
    const findFile = input => {
        let folders = input.split("/").filter(e => e.length > 0)
        let file = folders.pop().split(".")[0]
        folders = folders.join("/")
        let _f = findDirectory(folders).files
        if(Object.keys(_f).includes(file)) return _f[file].link
        else return undefined
    }

    const isActiveContentUrlSet = computed(() => activeContentUrl.value.length > 0)

    const removePermalinkFromURI = () => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    return { 
        init, 
        getDirectory, 
        setActivePage, 
        pages, 
        activeContentUrl, 
        content, 
        meta, 
        contentLength, 
        loading, 
        isActiveContentUrlSet,
        getActiveContentDirectory,
        findDirectory,
        findFile
    }

})