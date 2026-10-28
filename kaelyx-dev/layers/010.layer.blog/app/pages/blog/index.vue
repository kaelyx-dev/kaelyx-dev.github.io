<template>
  <ul>
    <li v-for="entry in posts" :key="entry.path">
      <NuxtLink :to="entry.path">{{ entry.title }}</NuxtLink>
      <p v-if="entry.description">{{ entry.description }}</p>
    </li>
  </ul>
</template>

<script lang="ts" setup>
const { getCollection } = useContent()

// Only the fields the listing needs, so full bodies are not shipped in the payload
const { data: posts } = await getCollection('blog', ['title', 'path', 'description', 'date', 'tags'])
</script>
