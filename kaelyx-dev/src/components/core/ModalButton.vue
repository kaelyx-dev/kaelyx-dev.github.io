<script setup>
import { ref } from 'vue'

defineProps({
  buttonText: {
    type: String,
    default: 'Open Modal'
  },
  buttonClass : {
    type: String,
    default: 'button--gray-3'
  },
  modalTitle : {
    type: String,
    default: 'Modal'
  }
})

const showModal = ref(false)

const baseButtonClass ="button "

</script>
<template>
  <a @click="showModal = true" :class="baseButtonClass+buttonClass">{{ buttonText }}</a>
  <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ modalTitle }}</h2>
        <a @click="showModal = false" class="button button--basic modal-close">&#x2716;</a>
      </div>
      <div class="modal-main">
        <slot/>
      </div>
    </div>
  </div>
</template>
