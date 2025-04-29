<script setup>
import { useDirectoryStore } from '@store/DirectoryStore';
import { calculate } from '../utilities/timeToRead';
import { computed } from 'vue';
let store = useDirectoryStore()

let visible = computed(() => store.meta.Type == "ARTICLE")
</script>
<template>
    <p v-if="visible">Time: {{ calculate(store.contentLength) }} Minutes</p>
</template>