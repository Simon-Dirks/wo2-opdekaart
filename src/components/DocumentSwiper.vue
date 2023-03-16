<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Keyboard, Mousewheel, Navigation, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/scrollbar";
import "swiper/css/keyboard";
import "swiper/css/navigation";
import { PropType } from "vue";
import { DocumentModel } from "../models/document.model";
import { AddressModel } from "../models/address.model";
import DocumentSwiperSlide from "./DocumentSwiperSlide.vue";

const modules = [Scrollbar, Mousewheel, Keyboard, Navigation];

const props = defineProps({
  address: { type: Object as PropType<AddressModel | null>, required: false },
  documents: {
    type: Object as PropType<DocumentModel[] | undefined>,
    required: false,
  },
  initialSlide: { type: Number, required: false },
  isShownFullscreen: { type: Boolean, required: false },
});
</script>

<template>
  <swiper
    :modules="modules"
    :slides-per-view="isShownFullscreen ? 1 : 1"
    :auto-height="true"
    :space-between="10"
    :keyboard="{ enabled: isShownFullscreen, onlyInViewport: true }"
    :navigation="true"
    :allow-touch-move="true"
    :initial-slide="props.initialSlide ?? 0"
    class="h-full px-12"
    :style="{
      '--swiper-navigation-size': '1rem',
      '--swiper-navigation-color': 'black',
      // '--swiper-navigation-top-offset': '50%',
      // '--swiper-navigation-sides-offset': '10px'    
    }"
  >
    <swiper-slide
      v-for="(document, idx) in props.documents"
      :key="document.docId + idx"
      class="h-full image-slide"
      v-if="props.documents"
    >
      <document-swiper-slide
        :address="address"
        :is-shown-fullscreen="isShownFullscreen"
        :documents="documents"
        :document="document"
        :slide-index="idx"
      ></document-swiper-slide>
    </swiper-slide>
  </swiper>
</template>

<style></style>