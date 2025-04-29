<script setup>
import { useDirectoryStore } from '@store/DirectoryStore';
import { computed } from 'vue';
import { encodePermaLink } from '../utilities/permalink';
let store = useDirectoryStore()

console.log(store.meta.Type)
let visible = computed(() => store.meta.Type == "ARTICLE")
</script>
<template>
    <p v-if="visible">{{ encodePermaLink(store.activeContentUrl) }}</p>
</template>