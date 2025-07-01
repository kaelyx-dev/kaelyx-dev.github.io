<script setup>
import { onMounted, ref, inject } from 'vue';
import { getRandomColour } from '../utilities/getColour';
import getColour from '../utilities/getColour';

const props = defineProps(['button'])

const colour = ref({ background: "", text: ""})

onMounted(() => {
    let _c = (!props.button.colour || props.button.colour.toLowerCase() == "random") ? getRandomColour() : getColour(props.button.colour)
    colour.value.background = _c.name
    colour.value.text       = _c.text
})

const posthog = inject('posthog')
const externalLinkClicked = inject('posthogExternalLink')

const onClick = () => {
    externalLinkClicked(posthog, props.button.link)
}

</script>
<template>
    <a @click="onClick" class="button" :class="`button--${colour.background} text--${colour.text}`" :href="props.button.link">{{ props.button.text }}</a>
</template>
