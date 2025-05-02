<script setup>
import { defineProps, ref } from 'vue';
import File from './File.vue';

const { folder,root } = defineProps({
    folder: Object,
    root  : Boolean
})


const isClosed = ref(!root)

console.log(isClosed.value)

const toggle = () => isClosed.value = !isClosed.value

</script>
<template>
    <p @click="toggle" class="folder-name"><input type="checkbox" class="folder-checkbox" v-if="!root" v-model="isClosed"/>{{ folder.metaName }}</p>
    <ul class="nav-tree" :class="{closed : isClosed}">
        <li v-if="Object.keys(folder.folders).length > 0" v-for="(subfolder, index) in folder.folders" :key="index">
            <Folder :folder="subfolder"/>
        </li>
        <li v-if="Object.keys(folder.files).length > 0" v-for="(file, index) in folder.files" :key="index">
                <File :file="file"/>
        </li>
    </ul>
</template>