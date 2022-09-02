<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Keyboard, Mousewheel, Scrollbar} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/keyboard';
import {PropType} from "vue";
import DocumentSwiperSlide from "./DocumentSwiperSlide.vue";
import {DocumentModel} from "../models/document.model";

const modules = [Scrollbar, Mousewheel, Keyboard];

const props = defineProps({
  documents: {type: Object as PropType<DocumentModel[]>, required: true},
  isShownFullscreen: {type: Boolean, required: false},
})
</script>

<template>
  <swiper
      :modules="modules"
      :slides-per-view="isShownFullscreen ? 1 : 2"
      :space-between="10"
      :auto-height="true"
      :keyboard="{enabled: isShownFullscreen, onlyInViewport: true}"
      class="h-full"
  >
    <swiper-slide v-for="(document, idx) in props.documents" :key="document.id + idx" class="h-full image-slide"
                  v-if="props.documents">
      <document-swiper-slide :is-shown-fullscreen="isShownFullscreen" :documents="documents"
                             :document="document"></document-swiper-slide>
    </swiper-slide>
  </swiper>
</template>

<style>

</style>