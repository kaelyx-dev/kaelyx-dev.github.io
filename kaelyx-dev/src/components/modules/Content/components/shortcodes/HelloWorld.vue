<script setup>

const props = defineProps({
    test : {
        type: Object,
        default: () => ({
            message: "This is a test prop"
        })
    }
})

</script>
<template>
    <p>Hello World</p>
    {{ props.test.message }}
</template>