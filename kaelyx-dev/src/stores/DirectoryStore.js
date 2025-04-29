import { getDirectoryStructure } from '@/components/modules/Navigation/Utilities/walker'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import getContent from '@module/Request/Utilities/getContent'
import parser from '@module/Content/utilities/parser'
import setPageTitle from '@/components/utilities/setPageTitle'

export const useDirectoryStore = defineStore('directory', () => {

    let pages = ref({})
    let activeContentUrl = ref("")
    let content = ref([])
    let meta = ref({})

    const init = async permalink => {
        let directory = await getDirectoryStructure();
        pages.value = directory

        if(permalink) {
            setActivePage(permalink)
            await buildContent()
        }
    }

    const getDirectory = () => {
        return pages
    }

    const setActivePage = pageLink => {
        activeContentUrl.value = pageLink
    }

    const buildContent = async () => {
        let file = await getContent(activeContentUrl.value)

        let parsed = parser(file)
        content.value = parsed.content
        buildMeta(parsed.meta)
    }

    const buildMeta = newMeta => {
        meta.value = newMeta
    }

    watch(() => activeContentUrl, () => buildContent())


    return { init, getDirectory, setActivePage, pages, activeContentUrl, content, meta}

})