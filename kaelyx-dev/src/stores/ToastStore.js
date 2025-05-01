import { defineStore } from "pinia";
import { ref } from "vue";

export const useToastStore = defineStore(() => {
    let toasts = ref([])

    const createToast = (content, lifetime = 3000) => {

        let _t = {id: Math.random.toString(16).slice(8), content: content}

        toasts.value.push(_t)
        setTimeout(() => removeToast(lifetime))
    }

    const removeToast = toastId => {
        toasts.value.filter(e => e.id != toastId)
    }


    return {toasts, createToast, removeToast}
})