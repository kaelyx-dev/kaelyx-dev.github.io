<template>
<footer class="box">
    <p v-if="siteCopyrightEnabled" class="text--white"><span class="copyright">©</span> {{ siteCopyrightName }} {{ yearString }}</p>
    <div class="colours">
        <div v-for="colour in colours" style="height: 30px;">
            <svg width="30" height="30" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" y="0" width="30" height="30" :stroke="colour" :fill="colour" stroke-width="5"/>
            </svg>
        </div>
    </div>
</footer>
</template>
<script setup>
import { useConfigStore } from '@/stores/ConfigStore';

const config = useConfigStore()
let colours = config.getValue("footer.colours").map(e => `#${e}`)

let siteCopyrightEnabled = config.getValue("footer.copyright.enabled")
let siteCopyrightStyle   = config.getValue("footer.copyright.style").toUpperCase()

let siteCopyrightFullStartYear = config.getValue("footer.copyright.full.startyear")
if(siteCopyrightFullStartYear == undefined && siteCopyrightStyle == "FULL") siteCopyrightStyle = "CURRENTYEAR"

let yearString = (siteCopyrightStyle == "SYMBOL") ? "" : (siteCopyrightStyle == "CURRENTYEAR") ? `${new Date().getFullYear()}`: `${siteCopyrightFullStartYear} - ${new Date().getFullYear()}`

let siteCopyrightName = config.getValue("footer.copyright.name", "KAELYX")

</script>