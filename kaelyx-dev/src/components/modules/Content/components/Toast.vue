<script setup>
import { defineProps, ref } from 'vue';
import { useToastStore } from '@/stores/ToastStore';
const toastStore = useToastStore()

const props = defineProps({
  toast: {id: String, content: String, lifetime: Number, leaveClass: String},
})

</script>
<template>
    <div class="toast">
        {{ props.toast.content }}
    </div>
</template>