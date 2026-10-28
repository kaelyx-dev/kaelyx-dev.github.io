<template>
  <div>
    Home Page
    {{ blog }}
    {{ projects }}
    {{ site }}
    {{ kv }}
    {{ routes }}
  </div>
</template>

<script lang="ts" setup>

const blog = await useContent().getCollection('blog')
const projects = await useContent().getCollection('projects')
const site = await useContent().getCollection('site')
const kv = useKv().kv

const routes = useRouter().getRoutes().map(route => route.path)
</script>