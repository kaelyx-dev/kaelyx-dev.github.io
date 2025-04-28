<script setup>
const props = defineProps(['button'])

</script>
<template>
    <a target="_blank" class="button" :class="`button--${props.button.colour}`" :href="props.button.link">{{ props.button.text }}</a>
</template>
