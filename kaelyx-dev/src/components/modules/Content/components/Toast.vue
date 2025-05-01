<script setup>
import { defineProps, ref } from 'vue';
import { useToastStore } from '@/stores/ToastStore';
const toastStore = useToastStore()

const props = defineProps({
  toast: {id: String, content: String, lifetime: Number, leaveClass: String},
})

const leaving = ref(false)

const leaveAnimationLength = 1000
const leave = () => {
    leaving.value = true
}

setTimeout(leave, props.toast.lifetime - leaveAnimationLength)

</script>
<template>
    <div class="toast" :class="{'toast-leave': leaving}">
        {{ props.toast.content }}
    </div>
</template>