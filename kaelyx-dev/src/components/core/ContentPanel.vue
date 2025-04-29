<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import ContentRenderer from '@module/Content/Components/ContentRenderer.vue'
</script>
<template>
  <div class="box main-content" ref="mainContentRef">
    <ContentRenderer/>
  </div>
</template>