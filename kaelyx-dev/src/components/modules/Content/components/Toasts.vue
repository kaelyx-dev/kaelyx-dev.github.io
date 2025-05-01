<script setup>

import { useToastStore } from '@store/ToastStore';
import { storeToRefs } from 'pinia';
import { TransitionGroup } from 'vue';

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)


</script>
<template>
    <div class="toasts">
        <TransitionGroup name="toast" tag="div">
            <div v-for="toast in toasts" key="{{ toast.id }}" class="toastItem">
                {{ toast.content }}
            </div>
        </TransitionGroup>
    </div>
</template>

<style scoped>

.toasts {
    position: fixed;
}

.toastItem {
    color: white;
}
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-active {
  position: absolute;
}
</style>