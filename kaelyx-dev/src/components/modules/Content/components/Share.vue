<script setup>
import { computed, watch } from 'vue';

import { useDirectoryStore } from '@store/DirectoryStore';
import { useToastStore } from '@store/toastStore'
import { useConfigStore } from '@/stores/ConfigStore';

import { encodePermaLink } from '../utilities/permalink';

import Modal from '@core/Modal.vue';

const config = useConfigStore()

let store = useDirectoryStore()
let visible = computed(() => store.meta.type == "ARTICLE")

let permalink = window.location.origin + `/?${config.getValue("content.permalink.querykey")}=` + encodePermaLink(store.activeContentUrl)

watch(store, () => {
    permalink = window.location.origin + `/?${config.getValue("content.permalink.querykey")}=` + encodePermaLink(store.activeContentUrl)
})

const toastStore = useToastStore()
const permalinkToClipboard  = async () => {
    try {
        await navigator.clipboard.writeText(permalink);
        toastStore.createToast('Copied to clipboard')
    } catch($e) {
        toastStore.createToast('Failed to copy to clipboard')
    }
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