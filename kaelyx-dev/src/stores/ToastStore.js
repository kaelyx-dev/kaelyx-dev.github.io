import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore('toast', () => {
    let toasts = ref([])

    const createToast = (content, lifetime = 3000) => {
        const _id = Math.random().toString(16).slice(8)
        let _t = {id: _id, content: content}

        toasts.value.push(_t)
        setTimeout(removeToast, lifetime)
    }

    const removeToast = () => {
        toasts.value = (toasts.value.length == 0) ? [] : toasts.value.slice(1) 
    }

    const clearToasts = () => {
        toasts.value = []
    }

    return {toasts, createToast, removeToast, clearToasts}
})