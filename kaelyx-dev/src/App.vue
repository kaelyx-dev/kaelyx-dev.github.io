<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@store/ConfigStore'

import Footer from '@core/Footer.vue'
import Header from '@core/Header.vue'
import Loader from '@core/Loader.vue'

import setPageTitle from '@utility/setPageTitle'
import { useDirectoryStore } from './stores/DirectoryStore';
import NavigationPanel from './components/core/NavigationPanel.vue';
import ContentPanel from './components/core/ContentPanel.vue';
import { getPermalinkQueryParam } from '@module/Content/utilities/permalink';
import Toasts from '@module/Content/components/Toasts.vue';

const config = useConfigStore()
const directory  = useDirectoryStore()

let loading = ref(true)
config.init().then(() => {
  directory.init(getPermalinkQueryParam()).then(() => {
    if(!directory.isActiveContentUrlSet) directory.activeContentUrl = config.getValue("site.default.page") ?? ""
    loading.value = false
  })
})

setPageTitle(config.getValue("site.title", "KAELYX").toUpperCase())

</script>
<template>
  <template v-if="!loading">
    <Header/>
    <main class="content">
      <NavigationPanel/>
      <ContentPanel/>
    </main>
    <Footer/>
    <Toasts/>
  </template>
  <Loader v-else/>
</template>