<script setup>
import ButtonBar from '@core/ButtonBar.vue';
import { useConfigStore } from '@/stores/ConfigStore';
const config = useConfigStore()

</script>
<template>
    <header>
      <div class="box">
        <h1>
          <span class="text--green">$</span> /{{config.getValue("header.username", "kaelyx")}}/dev/ <span class="text--light-blue">></span> echo Hello World...
        </h1>
      </div>
      <ButtonBar/>
    </header>
</template>
