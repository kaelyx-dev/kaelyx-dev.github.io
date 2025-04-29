<script setup>
import { useDirectoryStore } from '@store/DirectoryStore';
import { computed } from 'vue';
import { encodePermaLink } from '../utilities/permalink';
import Modal from '@core/Modal.vue';
import config from '@config/config_contentParser'

let store = useDirectoryStore()

let visible = computed(() => store.meta.type == "ARTICLE")
let permalink = window.location.origin + `/?${config.permalink.queryKey}=` + encodePermaLink(store.activeContentUrl)

const permalinkToClipboard  = async () => {
    try {
      await navigator.clipboard.writeText(permalink);
    } catch($e) {}
}


</script>
<template>
    <Modal v-if="visible" buttonText="Share" modalTitle="Share">
        <div class="share__permalink">
            <label for="permalink" class="permalink__label">Permalink</label>
            <div class="permalink__input">
                <input type="text" id="permalink" name="permalink" :value="permalink">
                <a class="button button--basic-outline" @click="permalinkToClipboard">Copy</a>
            </div>
        </div>
    </Modal>
</template>