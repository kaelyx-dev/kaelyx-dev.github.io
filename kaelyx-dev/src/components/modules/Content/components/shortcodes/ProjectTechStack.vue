<script setup>

const props = defineProps({
    list: Array
})


// TODO ICONIFY / ICON SUPPORT

</script>
<template>
    <div class="tech-stack">
        <ul class="tech-stack__list">
            <li class="tech-stack__list-item" v-for="(item, index) in props.list" :key="index">{{ item }}</li>
        </ul>
    </div>
</template>