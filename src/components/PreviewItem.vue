<script setup lang="ts">
import {computed, PropType} from "vue";
import 'swiper/css';
import 'swiper/css/scrollbar';
import {AddressModel} from "../models/address.model";
import DocumentSwiper from "./DocumentSwiper.vue";
import {useStore} from "vuex";

const props = defineProps({
  address: {type: Object as PropType<AddressModel | null>, required: true}
});

const store = useStore();
const documents = computed(() => {
  return store.getters["map/getDocumentsByIds"](props.address?.documentIds)
});
</script>

<template>
  <Transition>
    <n-card :title="props.item?.label" v-if="props.address" hoverable class="mb-4">
      <p>
        <strong>
          {{ props.address?.label }}
        </strong>
      </p>
      <p class="mb-3" v-if="documents.length > 0">Documenten: {{ documents.length }}</p>
      <p class="mb-3" v-if="documents.length <= 0"><em>Geen documenten gevonden</em></p>

      <document-swiper :documents="documents" :is-shown-fullscreen="false"></document-swiper>
    </n-card>
  </Transition>

</template>

<style>
#preview-items-container .n-card-header {
  padding-bottom: 0 !important;
}
</style>
