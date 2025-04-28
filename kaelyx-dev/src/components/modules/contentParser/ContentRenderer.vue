<script setup>

import { ref } from 'vue';
import { useConfigStore } from '@store/ConfigStore';
import { useDirectoryStore } from '@store/DirectoryStore';

import htmlToVNode from '@module/contentParser/htmlToVNode';
import mdToHtml from '@module/contentParser/mdToHtml'

let config = useConfigStore()
let directory = useDirectoryStore()
let text = "<h1>test</h1> <p>{{helloworld}} short code within in and a {{nonexistant}} shortcode too, or a [helloworld with=props] or {{helloworld with=more props=values}}</p>"
let vnodes = ref(htmlToVNode(mdToHtml(text)))

</script>
<template>
    <component v-for="(vnode, index) in vnodes" :is="vnode" :key="index" />
</template>