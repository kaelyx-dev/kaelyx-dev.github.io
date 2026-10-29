<template>
  <div>
    Home Page
    {{ useNavigation().getHeaderRoutes() }}
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  name: 'Home',
  NavigationMeta: {
    order: 0,
    visible: {
      header: true,
      footer: true
    }
  }
})

</script>