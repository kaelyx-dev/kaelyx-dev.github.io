<script setup>

import Modal from '@/components/core/Modal.vue'
import axios from 'axios'
import { onMounted, onUnmounted, ref } from 'vue'

const {source, title, alt} = defineProps({
    source: String,
    title: String,
    alt: String
})

let showModal = ref(false)
let _source   = ref()

const openDialog = () => {
    showModal.value = true
}

let objUrl = null

onMounted(async () => {
    const response = await axios.get(source, {responseType: 'blob'})
    objUrl = URL.createObjectURL(response.data)
    _source.value = objUrl
})
onUnmounted(() => {
    if(objUrl) {
        URL.revokeObjectURL(objUrl)
    }
})

</script>
<template>
<template v-if="!title">
    <img :src="source" :alt="alt"/>
</template>
<template v-else>
</template>
    <div class="image-wrapper">
        <figure>
            <img :src="_source" :alt="alt" :data-title="title" @click="openDialog"/>
            <figcaption>{{title}}</figcaption>
        </figure>
        <Modal :modalTitle="title" v-model="showModal">
            <img :src="_source" :alt="alt" :data-title="title"/>
        </Modal>
    </div>
</template>