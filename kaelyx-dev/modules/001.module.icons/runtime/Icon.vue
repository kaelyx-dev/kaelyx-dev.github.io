<template>
  <svg
    v-if="exists"
    class="icon"
    :viewBox
    :width="size"
    :height="size"
    fill="currentColor"
    v-bind="title ? { role: 'img' } : { 'aria-hidden': 'true', focusable: 'false' }"
  >
    <title v-if="title">{{ title }}</title>
    <use :href />
  </svg>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IconName } from '#icons'
import { useIcon } from './useIcon'

// SSR renders viewBox as "viewbox": Vue lowercases a component root's attributes when merging fallthrough
// attrs. Harmless, as the HTML parser restores the casing on <svg> elements before Vue hydrates.

// runtime props with a PropType cast: the SFC compiler can't follow a type-only
// defineProps<{ name: IconName }>() into the generated #icons module
const props = defineProps({
  name: { type: String as PropType<IconName>, required: true },
  size: { type: [String, Number], default: '1em' },
  title: { type: String, default: undefined },
})

const { exists, href, viewBox } = useIcon(() => props.name)
</script>
