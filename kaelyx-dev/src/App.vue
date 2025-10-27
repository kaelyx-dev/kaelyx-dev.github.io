<script setup>
import { inject, ref } from 'vue';
import { useConfigStore } from '@store/ConfigStore'

import Footer from '@core/Footer.vue'
import Header from '@core/Header.vue'
import Loader from '@core/Loader.vue'

import { useDirectoryStore } from './stores/DirectoryStore';
import NavigationPanel from './components/core/NavigationPanel.vue';
import ContentPanel from './components/core/ContentPanel.vue';
import { getPermalinkQueryParam } from '@module/Content/utilities/permalink';
import Toasts from '@module/Content/components/Toasts.vue';
import GlobalProvider from './components/modules/GlobalProvider/GlobalProvider.vue';
import ScriptProvider from './components/core/ScriptProvider.vue';

const IS_FIRST_VISIT = !localStorage.getItem('kaelyx.first_visit')
const FIRST_VISIT_LOADTIME = 2500
const LOAD_TIME = 1000

const config = useConfigStore()
const directory  = useDirectoryStore()
const showLoader = ref(true)

const load = async () => {
  // Run the initialization in the background
  // The loader will handle its own timing
  await config.init()
  await directory.init(getPermalinkQueryParam())
  if (!directory.isActiveContentUrlSet) {
    directory.activeContentUrl = config.getValue("site.default.page") ?? ""
  }
  localStorage.setItem('kaelyx.first_visit', 'true')
}

const onLoaderComplete = () => {
  showLoader.value = false
}

load()

</script>
<template>
  <template v-if="!showLoader">
      <GlobalProvider>
        <ScriptProvider/>
        <Header/>
        <main class="content">
          <NavigationPanel/>
          <ContentPanel/>
        </main>
        <Footer/>
        <Toasts/>
      </GlobalProvider>
    </template>
    <Loader v-if="showLoader"
      :max-animation-time="(IS_FIRST_VISIT ? FIRST_VISIT_LOADTIME  : LOAD_TIME)" 
      :fade-out-duration="300" 
      :end-wait="500" 
      :random-timing="true" 
      @complete="onLoaderComplete"
    />
</template>