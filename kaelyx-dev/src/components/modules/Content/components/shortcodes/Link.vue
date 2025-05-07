<script setup>
import { useDirectoryStore } from '@/stores/DirectoryStore';
import { computed } from 'vue';

const directory = useDirectoryStore()

const {link, name} = defineProps({
    link: String,
    name: String
})

const localLink = computed(() => link.startsWith("/"))

const onClick = () => {
    directory.setActivePage(link)
}

</script>
<template>
    <template v-if="localLink">
        <a @click="onClick" target="_blank">{{ name }}</a>
    </template>
    <template v-else>
        <a :href="link" target="_blank">{{ name }}</a>
    </template>
</template>