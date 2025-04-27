import { getDirectoryStructure } from '@/components/modules/directoryWalker/walker'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDirectoryStore = defineStore('directory', () => {

    let pages = ref({})
    let activeContentUrl = ref("")

    const init = async permalink => {
        let directory = await getDirectoryStructure();
        pages.value = directory

        if(permalink) setActivePage(permalink)
    }

    const getDirectory = () => {
        return pages
    }

    const setActivePage = pageLink => {
        activeContentUrl.value = pageLink
    }

    return { init, getDirectory, setActivePage, pages, activeContentUrl }

})