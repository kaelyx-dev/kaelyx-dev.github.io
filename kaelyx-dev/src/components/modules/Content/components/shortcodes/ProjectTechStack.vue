<script setup>

const props = defineProps({
    list: Array
})

</script>
<template>
    <div class="tech-stack">
        <ul>
            <li v-for="(item, index) in props.list" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>