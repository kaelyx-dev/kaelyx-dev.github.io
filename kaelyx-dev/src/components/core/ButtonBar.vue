<script setup>
import Button from './Button.vue';

import { useConfigStore } from '@/stores/ConfigStore';

const config = useConfigStore()
let buttons = config.getValue("header.social.links").map(e => {
    let _a = e.split(",")
    return {"text" : _a[0], "link": _a[2], "colour": _a[1]}
})


const OPEN_CLASS = "box--mobile-accordion-open"
const CLOSE_CLASS = "box--mobile-accordion-closed"
const toggleAccordion = () => {
    let buttonBar = document.getElementById("button-bar")
    if(buttonBar.classList.contains(OPEN_CLASS)){
        buttonBar.classList.remove(OPEN_CLASS)
        buttonBar.classList.add(CLOSE_CLASS)
    } else {
        buttonBar.classList.remove(CLOSE_CLASS)
        buttonBar.classList.add(OPEN_CLASS)
    }
}

</script>
<template>
<section id="button-bar" class="box box--mobile-accordion box--mobile-accordion-closed" @click="toggleAccordion">
    <div class="box--mobile-accordion-visible title">
        Socials
    </div>
    <div class="box--mobile-accordion-closed-hidden">
        <ul>
            <li v-for="button in buttons" :key="button">
                <Button :button="button"/>
            </li>
        </ul>
    </div>
</section>
</template>