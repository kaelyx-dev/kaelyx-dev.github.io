<script setup>
const props = defineProps(['link'])
</script>
<template>
    <a target="_blank" :href="link.link">{{ link.name }}</a>
</template>