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
    v-if="props.address && props.address?.documents.length > 0"
    hoverable
    class="mb-4 preview-item-card"
  >
    <template #header>
      <p>{{ props.address?.label }}</p>
      <pre class="text-sm" v-if="props.address?.documents.length === 1"
        >{{ props.address.documents.length }} document</pre
      >
      <pre class="text-sm" v-else
        >{{ props.address.documents.length }} documenten</pre
      >
    </template>

    <document-swiper
      :documents="props.address.documents"
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
</style>