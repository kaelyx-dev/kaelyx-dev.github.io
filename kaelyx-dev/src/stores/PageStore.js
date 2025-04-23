import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePageStore = defineStore('pages', () => {
    /**
     * dir | file = {
     *  type = "directory"
     *  name = "",
     *  children = [dir{}, dir{}, file{}]
     *
     *
     * }
     */
    const pages = ref({})
    const activeArticleUrl = ref("")

    return {}

})