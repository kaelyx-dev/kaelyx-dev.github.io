<script setup>
import { useDirectoryStore } from '@/stores/DirectoryStore';

const directory = useDirectoryStore()

</script>
<template>
    <component v-for="(vnode, index) in directory.content" :is="vnode" :key="index" />
</template>