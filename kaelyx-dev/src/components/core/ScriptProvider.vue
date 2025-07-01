<script setup>
import { inject, onMounted } from 'vue'
import { useConfigStore } from '@/stores/ConfigStore'

const config = useConfigStore()
const posthog = inject("posthog")
onMounted(() => {
    posthog.capture("site_visit")
})

</script>
<template>
</template>