<script setup>
import Share from './Share.vue';
import ReadTime from './ReadTime.vue';
import { useDirectoryStore } from '@/stores/DirectoryStore';


const directory = useDirectoryStore()

</script>
<template>
    <div class="article-widget">
        <ul v-if="directory.meta.type == 'ARTICLE'">
            <li>
                <Share/>
            </li>
            <li>
                <ReadTime/>
            </li>
        </ul>
    </div>
</template>