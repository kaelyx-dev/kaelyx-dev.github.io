<script setup>
const props = defineProps(['link'])

const click = () => {

}

</script>
<template>
    <a target="_blank" @click="click" :href="link.link">{{ link.name }}</a>
</template>