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

const config = useConfigStore()
const directory  = useDirectoryStore()
let loading = ref(true)

const initaliseData = async () => {
  try {

    await config.init();
    await directory.init(getPermalinkQueryParam());

    if(!directory.isActiveContentUrlSet) directory.activeContentUrl = config.getValue("site.default.page") ?? "";
    loading.value = false;

  } catch(error){
    if(error instanceof Error) console.error("Error during initialisation:", error.message);
    else console.error("Unknown error during initialisation:", error);
  }
}

initaliseData()
</script>

<template>
  <template v-if="!loading">
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
    <Loader v-else/>
</template>