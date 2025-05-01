<script setup>
import { TransitionGroup } from 'vue';

import { useToastStore } from '@store/ToastStore';
import { storeToRefs } from 'pinia';
import Toast from './Toast.vue';

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)


</script>
<template>
    <TransitionGroup name="toast" tag="ul" class="toasts-container">
        <li v-for="toast in toasts" key="{{ toast.id }}" class="toastItem">
            <Toast :toast="toast"/>
        </li>
    </TransitionGroup>
</template>