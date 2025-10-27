<script setup>
import { inject, onMounted } from 'vue'
import { useConfigStore } from '@/stores/ConfigStore'

const config = useConfigStore()
onMounted(() => {
    let params = new URLSearchParams(window.location.search)
})

</script>
<template>
</template>