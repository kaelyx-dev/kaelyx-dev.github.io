<script setup>
import Share from '../Share.vue';
import ReadTime from '../ReadTime.vue';
import { useDirectoryStore } from '@/stores/DirectoryStore';

const directory = useDirectoryStore()

</script>
<template>
    <div class="article-widget">
        <ul v-if="directory.meta.type == 'ARTICLE' || directory.meta.showpermalink || directory.meta.showreadtime">
            <li v-if="directory.meta.type == 'ARTICLE' || directory.meta.showpermalink">
                <Share/>
            </li>
            <li v-if="directory.meta.type == 'ARTICLE' || directory.meta.showreadtime">
                <ReadTime/>
            </li>
        </ul>
    </div>
</template>