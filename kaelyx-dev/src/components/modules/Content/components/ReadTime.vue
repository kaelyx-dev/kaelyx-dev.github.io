<script setup>
import { useDirectoryStore } from '@store/DirectoryStore';
import { calculate } from '../utilities/timeToRead';
import { computed } from 'vue';

let store = useDirectoryStore()

let visible = computed(() => store.meta.type == "ARTICLE")

let readTime = calculate(store.contentLength)

</script>
<template>
    <p v-if="visible" class="button pseudo-button--gray-3">Time: {{ readTime }} Minute{{ readTime != 1 ? "s" : "" }}</p>
</template>