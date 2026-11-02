<template>
  <NuxtLink v-if="props.href" :to="props.href" :target="props.target" :external="props.external">
    <slot />
  </NuxtLink>
  <button v-else @click="props.action">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { type ActionProps } from './Action.type';

const props = withDefaults(defineProps<ActionProps>(), {

})

</script>