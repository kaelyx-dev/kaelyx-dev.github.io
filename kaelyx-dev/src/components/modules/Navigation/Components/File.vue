<script setup>
import { defineProps } from 'vue';

import { useDirectoryStore } from '@store/DirectoryStore';

const directory = useDirectoryStore()

const { file } = defineProps({
    file: Object
})

const setActivePage = () => directory.setActivePage(file.link)

</script>
<template>
    <a @click="setActivePage()" :class="{selected : directory.activeContentUrl == file.link}">
        {{ file.metaName }}
    </a>
</template>