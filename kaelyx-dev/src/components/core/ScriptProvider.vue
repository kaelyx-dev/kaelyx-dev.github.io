<script setup>
import { inject, onMounted } from 'vue'
import { useConfigStore } from '@/stores/ConfigStore'

const config = useConfigStore()
const posthog = inject("posthog")
onMounted(() => {
    let params = new URLSearchParams(window.location.search)
    posthog.capture("site_visit", {
        referrer:     document.referrer,
        ref:          params.get("ref"),
        utm_source:   params.get("utm_source"),
        utm_medium:   params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
        user_agent:   navigator.userAgent
    })
})

</script>
<template>
</template>