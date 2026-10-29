<template>
  <div>
    About Page
  </div>
</template>

<script lang="ts" setup>
import { definePage } from 'vue-router/experimental';

definePageMeta({
  name: 'About',
  NavigationMeta: {
    order: 1,
    visible: {
      header: true,
      footer: true
    }
  }
})

</script>