<script setup lang="ts">
import { useStore } from "vuex";
import { computed, ComputedRef } from "vue";
import { Close } from "@vicons/ionicons5";
import { DocumentModel } from "../models/document.model";
import DocumentSwiper from "./DocumentSwiper.vue";

const store = useStore();
const isShown: ComputedRef<boolean> = computed(
  () => store.getters["previewModal/getIsShown"]
);
const shownDocuments: ComputedRef<DocumentModel[]> = computed(
  () => store.getters["previewModal/getShownDocuments"]
);
const initialSlideIndex: ComputedRef<number> = computed(
  () => store.getters["previewModal/getInitialSlideIndex"]
);
const closeModal = () => store.dispatch("previewModal/close");
</script>

<template>
  <n-modal
    v-model:show="isShown"
    :on-mask-click="closeModal"
    :on-esc="closeModal"
    :closable="true"
  >
    <n-card
      title=" "
      style="width: 95vw; height: auto"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button @click="closeModal" class="relative right-1 top-1">
          <Icon
            size="20"
            class="transition-colors text-white hover:text-primary"
          >
            <Close />
          </Icon>
        </button>
      </template>

      <document-swiper
        :documents="shownDocuments"
        :isShownFullscreen="true"
        :initial-slide="initialSlideIndex"
      ></document-swiper>
    </n-card>
  </n-modal>
</template>

<style>
.n-modal {
  --n-color-modal: rgba(0, 0, 0, 0.3) !important;
}

.n-modal > .n-card-header {
  padding: 0;
}

.n-modal > .n-card__content {
  padding: 0 1rem 0.5rem;
}
</style>