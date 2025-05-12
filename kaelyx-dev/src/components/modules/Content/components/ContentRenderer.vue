<script setup>
import { useDirectoryStore } from '@/stores/DirectoryStore';
import { watch } from 'vue';

const directory = useDirectoryStore()

watch(directory.content, ()=> {
    console.log(directory.content)
})
</script>
<template>
    <component v-for="(vnode, index) in directory.content" :is="vnode" :key="index" />
</template>