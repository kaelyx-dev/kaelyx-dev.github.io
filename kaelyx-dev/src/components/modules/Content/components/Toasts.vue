<script setup>

import { useToastStore } from '@store/ToastStore';
import { storeToRefs } from 'pinia';
import Toast from './Toast.vue';

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)


</script>
<template>
    <div class="toasts-container">
        <div v-for="toast in toasts" key="{{ toast.id }}" class="toastItem">
            <Toast :content="toast.content"/>
        </div>
    </div>
</template>