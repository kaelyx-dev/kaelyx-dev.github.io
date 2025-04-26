<script setup>
import { ref } from 'vue';
import { useConfigStore } from '@store/ConfigStore'

import Footer from '@core/Footer.vue'
import Header from '@core/Header.vue'
import Loader from '@core/Loader.vue'

import setPageTitle from '@utility/setPageTitle'
import htmlVNodeParser from './components/modules/htmlParser/htmlVNodeParser';
import { buildDirectory } from './components/modules/directoryWalker/walker';
import { useDirectoryStore } from './stores/DirectoryStore';

const config = useConfigStore()
const directory  = useDirectoryStore()
let loading = ref(true)

config.init().then(() => {
  loading.value = false
})

directory.init().then(() => {

})



setPageTitle(config.getValue("site.title", "KAELYX").toUpperCase())

let text = "<h1>test</h1> <p>{{helloworld}} short code within in and a {{nonexistant}} shortcode too, or a [helloworld with=props] or {{helloworld with=more props=values}}</p>"
let vnodes = ref(htmlVNodeParser(text))

</script>
<template>
  <template v-if="!loading">
    <Header/>
    <main class="content">
      <div class="box navigation">
        <p> {{ config.getConfig }} </p>
      </div>
      <div class="box">
        <component v-for="(vnode, index) in vnodes" :is="vnode" :key="index" />
        <br>
        <div>{{ directory.getDirectory() }}</div>
      </div>
    </main>
    <Footer/>
  </template>
  <Loader v-else/>
</template>