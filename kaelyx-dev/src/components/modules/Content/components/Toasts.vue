<script setup>
import { Transition, TransitionGroup, Teleport } from 'vue';

import { useToastStore } from '@store/ToastStore';
import { storeToRefs } from 'pinia';
import Toast from './Toast.vue';

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)


</script>
<template>
    <Teleport to="body">
        <div v-if="toasts.length">
            <ul class="toasts-container">
                <li v-for="toast in toasts" key="{{ toast.id }}" class="toastItem">
                    <Toast :toast="toast"/>
                </li>
            </ul>
        </div>
    </Teleport>
</template>