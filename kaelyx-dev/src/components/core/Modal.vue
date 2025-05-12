<script setup>
import { watch } from 'vue';


const {modalTitle} = defineProps({modalTitle: String})
const model = defineModel({default: false})

</script>
<template>
  <div v-if="model" class="modal-overlay" @click.self="model = false">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ modalTitle }}</h2>
        <a @click="model = false" class="button button--basic modal-close">&#x2716;</a>
      </div>
      <div class="modal-main">
        <slot/>
      </div>
    </div>
  </div>
</template>
