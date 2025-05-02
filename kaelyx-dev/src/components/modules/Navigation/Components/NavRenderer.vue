<script setup>

import { useDirectoryStore } from '@store/DirectoryStore';
import Folder from './Folder.vue';

const directory  = useDirectoryStore()

</script>
<template>
    <ul class="nav-tree">
        <p>/dev/kaelyx/</p>
        <li>
            <Folder :folder="directory.getDirectory()" :root="true"/>
        </li>
    </ul>
</template>