<template>
  <div>
    Home Page
    hello
    {{ useNavigation().getHeaderRoutes() }}

    <br>
    {{ useTheme().listThemes() }}
    {{ useTheme().theme }}

    <button v-for="value in useTheme().listThemes()" :key="value.label" @click="useTheme().setTheme(value.name)">
      {{ value.label }}
    </button>
   
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