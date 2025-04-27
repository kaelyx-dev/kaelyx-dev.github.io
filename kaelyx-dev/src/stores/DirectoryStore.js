import { getDirectoryStructure } from '@/components/modules/directoryWalker/walker'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDirectoryStore = defineStore('directory', () => {

    let pages = ref({})
    let activeArticleUrl = ref("")

    const init = async () => {
        let directory = await getDirectoryStructure();
        pages.value = directory
    }

    const getDirectory = () => {
        return pages
    }

    const setActivePage = pageLink => {
        activeArticleUrl.value = pageLink
    }

    return { init, getDirectory, pages, activeArticleUrl }

})