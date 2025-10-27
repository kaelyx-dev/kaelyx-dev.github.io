<script setup>
import { defineProps, inject } from 'vue';

import { useDirectoryStore } from '@store/DirectoryStore';
import { useConfigStore } from '@/stores/ConfigStore';

const directory = useDirectoryStore()
const config = useConfigStore()




const { file } = defineProps({
    file: Object
})

const setActivePage = () => {
    directory.setActivePage(file.link)
}

</script>
<template>
    <a @click="setActivePage()" :class="{selected : directory.activeContentUrl == file.link }">
        {{ file.metaName }}{{(config.getValue("directory.filetypes.enabled")) ? "."+file.filetype : "" }}
    </a>
</template>