<script setup lang="ts">
import {computed, PropType} from "vue";
import 'swiper/css';
import 'swiper/css/scrollbar';
import {AddressModel} from "../models/address.model";
import DocumentSwiper from "./DocumentSwiper.vue";
import {useStore} from "vuex";
import {DocumentModel} from "../models/document.model";

const props = defineProps({
  address: {type: Object as PropType<AddressModel | null>, required: true}
});
</script>

<template>
    <n-card :title="props.address?.label" v-if="props.address && props.address?.documents.length > 0" hoverable class="mb-4">
      <p>
        <strong>
          {{ props.address?.label }}
        </strong>
      </p>
      <p class="mb-3">Documenten: {{ props.address?.documents.length }}</p>

      <document-swiper :documents="props.address?.documents" :is-shown-fullscreen="false"></document-swiper>
    </n-card>

</template>

<style>
#preview-items-container .n-card-header {
  padding-bottom: 0 !important;
}
</style>
