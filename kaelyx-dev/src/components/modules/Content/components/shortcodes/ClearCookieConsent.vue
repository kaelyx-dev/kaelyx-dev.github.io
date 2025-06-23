<script setup>
import Button from '@core/Button.vue';

const clearConsent = async() => {
    localStorage.removeItem('cookie_consent');
    await new Promise(resolve => setTimeout(resolve, 0));
    window.location.reload();
}

</script>
<template>
    <Button @click="clearConsent" :button="{link:'#', text: 'Clear Consent'}"/>
</template>