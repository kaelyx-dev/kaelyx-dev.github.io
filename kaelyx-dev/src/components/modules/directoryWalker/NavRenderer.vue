<script setup>

import { useDirectoryStore } from '@store/DirectoryStore';

const directory  = useDirectoryStore()

</script>
<template>
    {{ directory.getDirectory() }}
</template>