<template>
    <slot/>
</template>
<script setup>
import { provide } from 'vue'

const globals = {
    
}

Object.entries(globals).forEach(([key, value]) => {
    provide(key, value);
});

</script>