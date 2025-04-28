<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import ContentRenderer from '@module/Content/Components/ContentRenderer.vue'

const mainContentRef = ref(null);

function handleWheelScroll(e) {
    if (!mainContentRef.value) return;

    const scrollSpeed = 0.3;
    const delta = Math.max(Math.min(e.deltaY, 100), -100); // Clamp delta for sanity
    mainContentRef.value.scrollTop += delta * scrollSpeed; // <<<< instant scroll, no animation

    e.preventDefault();
}

function handleKeyScroll(e) {
    if (!mainContentRef.value) return;

    let scrollAmount = 0;

    switch (e.key) {
        case 'ArrowDown':
          scrollAmount = 40;
          break;
        case 'ArrowUp':
          scrollAmount = -40;
          break;
        case 'PageDown':
          scrollAmount = mainContentRef.value.clientHeight * 0.9;
          break;
        case 'PageUp':
          scrollAmount = -mainContentRef.value.clientHeight * 0.9;
          break;
        default:
          return;
    }

    mainContentRef.value.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
    e.preventDefault();
}

onMounted(() => {
  document.addEventListener('wheel', handleWheelScroll, { passive: false });
  document.addEventListener('keydown', handleKeyScroll);
});

onUnmounted(() => {
  document.removeEventListener('wheel', handleWheelScroll);
  document.removeEventListener('keydown', handleKeyScroll);
});



</script>
<template>
    <div class="box main-content" ref="mainContentRef">
        <ContentRenderer/>
    </div>
</template>