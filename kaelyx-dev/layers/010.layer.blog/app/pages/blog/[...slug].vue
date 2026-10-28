<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <ContentRenderer :value="post" />
  </article>
</template>

<script lang="ts" setup>
const route = useRoute()
const { getPage } = useContent()

const { data: post } = await getPage('blog', { path: route.path })

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}
</script>
