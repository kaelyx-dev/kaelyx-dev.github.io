import { getDirectoryStructure } from '@/components/modules/Navigation/Utilities/walker'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import getContent from '@module/Request/Utilities/getContent'
import parser from '@module/Content/utilities/parser'
import { parseMeta } from '@module/Content/utilities/meta'
import { useConfigStore } from './ConfigStore'

export const useDirectoryStore = defineStore('directory', () => {

    let pages = ref({})
    let activeContentUrl = ref("")
    let content = ref([])
    let contentLength = ref(0)
    let meta = ref({})
    let loading = ref(false)

    const init = async permalink => {
        let directory = await getDirectoryStructure(useConfigStore());
        pages.value = directory

        if(permalink) {
            setActivePage(permalink)
            await buildContent()
        }
    }

    const getDirectory = () => {
        return pages.value
    }

    const setActivePage = pageLink => {
        activeContentUrl.value = pageLink
    }

    const buildContent = async () => {
        let file = await getContent(useConfigStore().getValue("site.base"), activeContentUrl.value)

        let parsed = parser(file)
        content.value = parsed.content
        contentLength.value = parsed.length
        buildMeta(parsed.meta)
    }

    const buildMeta = newMeta => {
        meta.value = parseMeta(newMeta)
    }

    watch(activeContentUrl, newActiveContentUrl => {
        if(newActiveContentUrl == activeContentUrl) return
        buildContent()
    })

    const isActiveContentUrlSet = computed(() => activeContentUrl.value.length > 0)

    return { init, getDirectory, setActivePage, pages, activeContentUrl, content, meta, contentLength, loading, isActiveContentUrlSet}

})