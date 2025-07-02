<template>
    <slot/>
</template>
<script setup>
import { onMounted, provide } from 'vue'

import { gtag } from './providers/gtag/gtag'
import loadGtag from './providers/gtag/loadGtag'
import posthogInit from './providers/posthog/init'
import posthogPageview from './providers/posthog/pageview'
import posthogExternalLink from './providers/posthog/externallink'
import { useConfigStore } from '@/stores/ConfigStore'

const config = useConfigStore()

    const posthog = posthogInit(
    config.getValue("posthog.enabled") ?? false,
    config.getValue("posthog.key") ?? "",
        {
            api_host: "https://eu.i.posthog.com",
            opt_out_persistence_by_default: true,
            disable_persistence: true,
            persistence: "memory",
            capture_pageview: false,
            autocapture: false,
            capture_performance: {
                    web_vitals: false
            },
            loaded: () => {}
        }
    )
    const globals = {
        gtag, loadGtag, posthog, posthogPageview, posthogExternalLink
    }

    Object.entries(globals).forEach(([key, value]) => {
        provide(key, value);
    });
</script>