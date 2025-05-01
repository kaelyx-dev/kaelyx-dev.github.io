<script setup>
import { defineProps } from 'vue';
defineProps({
  content: String,
})
</script>
<template>
    <div class="toast">
        {{ content }}
    </div>
</template>