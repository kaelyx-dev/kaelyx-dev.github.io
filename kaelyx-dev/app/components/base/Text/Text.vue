<template>
    <component :is="props.component">
      {{ props.text }}<slot />
    </component>
</template>

<script lang="ts" setup>
import type { TextProps } from './Text.type';

const props = withDefaults(defineProps<TextProps>(), {})
</script>