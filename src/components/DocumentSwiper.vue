<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Keyboard, Mousewheel, Navigation, Scrollbar} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/keyboard';
import 'swiper/css/navigation';
import {PropType} from "vue";
import DocumentSwiperSlide from "./DocumentSwiperSlide.vue";
import {DocumentModel} from "../models/document.model";

const modules = [Scrollbar, Mousewheel, Keyboard, Navigation];

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
      :navigation="true"
      :allow-touch-move="true"
      class="h-full px-12"
      :style="{'--swiper-navigation-size': '1rem', '--swiper-navigation-color': 'white'}"
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