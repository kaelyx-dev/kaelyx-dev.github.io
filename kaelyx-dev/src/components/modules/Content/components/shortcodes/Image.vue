<script setup>

import Modal from '@/components/core/Modal.vue'
import { ref } from 'vue'

const {source, title, alt} = defineProps({
    source: String,
    title: String,
    alt: String
})

let showModal = ref(false)

const isDesktop = window.matchMedia("(hover: hover)").matches
if(isDesktop){
    console.log("ON DESKTOP")
}

const openDialog = () => {
    console.log("CLICKED")
    showModal.value = true
}

</script>
<template>
<template v-if="!title">
    <img :src="source" :alt="alt"/>
</template>
<template v-else>
</template>
    <div class="image-wrapper">
        <figure>
            <img :src="source" :alt="alt" :data-title="title" @click="openDialog"/>
            <figcaption>{{title}}</figcaption>
        </figure>
        <Modal :modalTitle="title" v-model="showModal">
            <img :src="source" :alt="alt" :data-title="title"/>
        </Modal>
    </div>
</template>