<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@store/ConfigStore'

import Footer from '@core/Footer.vue'
import Header from '@core/Header.vue'
import Loader from '@core/Loader.vue'

import setPageTitle from '@utility/setPageTitle'

const config = useConfigStore()

let loading = ref(true)

config.init().then(() => {
  loading.value = false
})

setPageTitle(config.getValue("site.title", "KAELYX").toUpperCase())

</script>
<template>
  <template v-if="!loading">
    <Header/>
    <main class="content">
      <div class="box navigation">
        <p> {{ config.getConfig }} </p>
      </div>
      <div class="box">
        <p> {{ config.getConfig }} </p>
      </div>
    </main>
    <Footer/>
  </template>
  <Loader v-else/>
</template>