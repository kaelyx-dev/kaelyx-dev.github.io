import { buildDirectory } from '@/components/modules/directoryWalker/walker'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDirectoryStore = defineStore('directory', () => {
    /**
     * dir | file = {
     *  type = "directory"
     *  name = "",
     *  children = [dir{}, dir{}, file{}]
     *
     *
     * }
     */
    let pages = ref({})
    let activeArticleUrl = ref("")

    const init = async () => {
        let directory = await buildDirectory();
        pages.value = directory
    }

    const getDirectory = () => {
        return pages
    }

    return { init, getDirectory, pages, activeArticleUrl }

})