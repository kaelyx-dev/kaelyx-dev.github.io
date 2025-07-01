<script setup>
import { inject } from 'vue'

const props = defineProps(['link'])

const posthog = inject('posthog')
const externalLinkClicked = inject('posthogExternalLink')

const click = () => {
    externalLinkClicked(posthog, props.link.link)
}

</script>
<template>
    <a target="_blank" @click="click" :href="link.link">{{ link.name }}</a>
</template>