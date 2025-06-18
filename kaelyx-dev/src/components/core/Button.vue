<script setup>
import { onMounted, ref } from 'vue';
import { getRandomColour } from '../utilities/getColour';
import getColour from '../utilities/getColour';

const props = defineProps(['button'])

const colour = ref({ background: "", text: ""})

onMounted(() => {
    let _c = (!props.button.colour || props.button.colour.toLowerCase() == "random") ? getRandomColour() : getColour(props.button.colour)    
    colour.value.background = _c.name
    colour.value.text       = _c.text
})

</script>
<template>
    <a target="_blank" class="button" :class="`button--${colour.background} text--${colour.text}`" :href="props.button.link">{{ props.button.text }}</a>
</template>
