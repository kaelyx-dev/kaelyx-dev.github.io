<script setup>
import ArticleWidget from '../modules/Content/components/ArticleWidget.vue';
import Button from './Button.vue';

import { useConfigStore } from '@/stores/ConfigStore';

const config = useConfigStore()
let buttons = config.getValue("header.social.links").map(e => {
    let _a = e.split(",")
    return {"text" : _a[0], "link": _a[2], "colour": _a[1]}
})
</script>
<template>
<section id="button-bar" class="box">
    <ul>
        <li v-for="button in buttons">
            <Button :button="button"/>
        </li>
    </ul>
    <ArticleWidget/>
</section>
</template>