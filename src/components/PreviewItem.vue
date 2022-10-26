<script setup lang="ts">
import { PropType } from "vue";
import "swiper/css";
import "swiper/css/scrollbar";
import { AddressModel } from "../models/address.model";
import DocumentSwiper from "./DocumentSwiper.vue";

const props = defineProps({
  address: { type: Object as PropType<AddressModel | null>, required: true },
});
</script>

<template>
  <n-card
    :title="props.address?.label"
    v-if="props.address && props.address?.documents.length > 0"
    hoverable
    class="mb-4"
  >
    <p v-if="props.address?.documents.length > 1" class="mb-3">
      {{ props.address?.documents.length }} documenten
    </p>

    <document-swiper
      :documents="props.address.documents"
      :is-shown-fullscreen="false"
    ></document-swiper>
  </n-card>
</template>

<style>
#preview-items-container .n-card-header {
  padding-bottom: 0 !important;
}
</style>
