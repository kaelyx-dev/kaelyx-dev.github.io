import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore('toast', () => {
    let toasts = ref([])

    const createToast = (content, lifetime = 3000) => {
        const _id = Math.random().toString(16)
        let _t = {id: _id, content: content, lifetime: lifetime}

        toasts.value.push(_t)
        setTimeout(()=>removeToast(_t.id), lifetime)
    }

    const removeToast = id => {
        toasts.value = toasts.value.filter(e => e.id != id)
    }

    const clearToasts = () => {
        toasts.value = []
    }

    return {toasts, createToast, removeToast, clearToasts}
})