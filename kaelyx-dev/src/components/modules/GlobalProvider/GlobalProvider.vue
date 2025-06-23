<template>
    <slot/>
</template>
<script setup>
import { provide } from 'vue';

import { gtag } from './providers/gtag/gtag';
import loadGtag from './providers/gtag/loadGtag';

const globals = {
    gtag, loadGtag
}

Object.entries(globals).forEach(([key, value]) => {
    provide(key, value);
});

</script>