<template>
  <div>
    Home Page
    hello
    <Action 
    :href="navItem.path" 
    :target="navItem.target" 
    :external="navItem.external"
    v-for="(navItem, index) in useNavigation().getHeaderRoutes()" :key="index">
      <Text component="span" :text="navItem.name" />
    </Action>
    <!-- {{ useNavigation().getHeaderRoutes() }} -->

    <!-- {{ useTheme().listThemes() }} -->
    <!-- {{ useTheme().theme }} -->
<!-- 
    <button v-for="value in useTheme().listThemes()" :key="value.label" @click="useTheme().setTheme(value.name)">
      {{ value.label }}
    </button> -->
   
  </div>
</template>

<script lang="ts" setup>
import Action from '~/components/base/Action/Action.vue';
import Text from '~/components/base/Text/Text.vue';

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