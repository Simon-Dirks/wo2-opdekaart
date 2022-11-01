<script setup lang="ts">
import { PropType } from "vue";
import "swiper/css";
import "swiper/css/scrollbar";
import { AddressModel } from "../models/address.model";
import DocumentSwiper from "./DocumentSwiper.vue";

const props = defineProps({
  address: { type: Object as PropType<AddressModel | null>, required: true },
  index: Number,
});
</script>

<template>
  <n-card
    :bordered="false"
    v-if="props.address && props.address?.filteredDocuments.length > 0"
    hoverable
    class="mb-4 preview-item-card"
  >
    <template #header>
      <p>{{ props.address?.label }}</p>
      <p
        class="text-xs font-mono"
        v-if="props.address?.filteredDocuments.length === 1"
      >
        #{{ props.index }}:
        {{ props.address.filteredDocuments.length }} document
      </p>
      <p class="text-xs font-mono" v-else>
        #{{ props.index }}:
        {{ props.address.filteredDocuments.length }} documenten
      </p>
    </template>

    <document-swiper
      :documents="props.address.filteredDocuments"
      :is-shown-fullscreen="false"
      class="mt-4"
    ></document-swiper>
  </n-card>
</template>

<style>
#preview-items-container .n-card-header {
  padding-bottom: 0 !important;
}

.n-card > .n-card-header {
  background: theme("colors.primary");
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.preview-item-card > .n-card__content {
  background: theme("colors.black");
  color: white;
}

/*.preview-item-card > .n-card__content img {*/
/*  !*min-height: 200px;*!*/
/*  !*max-height: 300px;*!*/
/*  height: 300px;*/
/*}*/
</style>
