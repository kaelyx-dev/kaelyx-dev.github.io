<script setup>
import { useDirectoryStore } from '@/stores/DirectoryStore';
import { computed, inject } from 'vue';

const directory = useDirectoryStore()

const {link, name} = defineProps({
    link: String,
    name: String
})


const posthog = inject('posthog')
const externalLinkClicked = inject('posthogExternalLink')
const pageViewEvent = inject('posthogPageview')

const localLink = computed(() => link.startsWith("/"))

const onClick = () => {
    pageViewEvent(posthog, link)
    directory.setActivePage(link)
}

const onClickExternal = () => {
    externalLinkClicked(posthog, link)
}


</script>
<template>
    <template v-if="localLink">
        <a @click="onClick" target="_blank">{{ name }}</a>
    </template>
    <template v-else>
        <a @click="onClickExternal" :href="link" target="_blank">{{ name }}</a>
    </template>
</template>