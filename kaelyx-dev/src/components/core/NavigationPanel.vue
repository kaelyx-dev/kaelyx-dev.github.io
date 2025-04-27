<script setup>
    import { useDirectoryStore } from '@store/DirectoryStore';

    const directory  = useDirectoryStore()

</script>
<template>
    <div class="box">
        {{ directory.getDirectory() }}
    </div>
</template>