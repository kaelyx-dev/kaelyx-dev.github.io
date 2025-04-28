<script setup>
    import { ref } from 'vue';
    import { useConfigStore } from '@store/ConfigStore';
    import { useDirectoryStore } from '@store/DirectoryStore';
    import htmlToVNode from '@module/htmlParser/htmlToVNode';

    let config = useConfigStore()
    let directory = useDirectoryStore()
    let text = "<h1>test</h1> <p>{{helloworld}} short code within in and a {{nonexistant}} shortcode too, or a [helloworld with=props] or {{helloworld with=more props=values}}</p>"
    let vnodes = ref(htmlToVNode(text))

</script>
<template>
    <div class="box">
        {{ directory.activeContentUrl }}
        <component v-for="(vnode, index) in vnodes" :is="vnode" :key="index" />
        <br>
        {{ config.getConfig }}
      </div>
</template>