<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import Button from '@core/Button.vue';
import { useConfigStore } from '@/stores/ConfigStore'

const config = useConfigStore()

const COOKIE_CONSENT_KEY = 'cookie_consent';

const userHasResponded = computed(() => localStorage.getItem(COOKIE_CONSENT_KEY) != undefined)

const visible = ref(!userHasResponded.value)

const loadGtag = inject('loadGtag')

const initGtag = () => {
    const isEnabled = config.getValue('google.gtag.enabled')
    const gtagId = config.getValue('google.gtag')
    if (isEnabled && gtagId) loadGtag(gtagId)
}

onMounted(() => {
    let enabled = config.getValue('google.gtag.enabled')
    if(!enabled) visible.value = false
    if(userHasResponded.value && enabled) initGtag()
})

const consent = () => {
    const gtagId = config.getValue('google.gtag')
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    initGtag()
    visible.value = false;
}

const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false')
    visible.value = false;
}

</script>
<template>
    <div class="cookie-banner__overlay" v-if="visible">
        <div class="cookie-banner" v-if="visible">
            <div class="cookie-banner__content">
                This Site uses Google Tag Manager to collect anonymous data about your usage of this site. By clicking "Accept" you consent to the use of Google Tag Manager.
                <div class="cookie-banner__buttons">
                    <Button @click="consent"      :button="{ text: 'Accept', link: '#'}"/>
                    <Button @click="decline" :button="{ text: 'Decline', link: '#'}"/>
                </div>
            </div>
        </div>
    </div>
</template>