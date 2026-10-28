<template>
  <article v-if="project">
    <h1>{{ project.title }}</h1>
    <ContentRenderer :value="project" />
  </article>
</template>

<script lang="ts" setup>
const route = useRoute()
const { getPage } = useContent()

const { data: project } = await getPage('projects', { path: route.path })

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}
</script>
