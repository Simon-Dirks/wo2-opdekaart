<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Mousewheel, Scrollbar} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import {PropType} from "vue";
import {ScanModel} from "../models/marker.model";
import {store} from "../store";
import ScanSwiper from "./ScanSwiper.vue";

const modules = [Scrollbar, Mousewheel];

const props = defineProps({
  scans: {type: Object as PropType<ScanModel[]>, required: true},
  isShownFullscreen: {type: Boolean, required: false},
})

const openModal = () => store.commit("previewModal/setShownScans", props.scans);
</script>

<template>
  <swiper
      :modules="modules"
      :slides-per-view="isShownFullscreen ? 1 : 2"
      :space-between="10"
      class="h-full"
  >
    <swiper-slide v-for="(scan, idx) in props.scans" :key="scan.id + idx" class="h-full image-slide">
      <button @click="openModal" class="w-full h-full" :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'">
        <!-- TODO: Re-enable lazy loading when fullscreen-->
        <n-image :src="scan.id ? 'https://proxy.archieven.nl/thumb/39/' + scan.id : 'https://via.placeholder.com/1000x200'"
                 :fallback-src="'https://via.placeholder.com/1000x200'"
                 :lazy="!isShownFullscreen"
                 :preview-disabled="true"
                 class="w-full h-full !object-contain"></n-image>
      </button>
    </swiper-slide>
  </swiper>
</template>

<style>
  .image-slide img {
    object-fit: contain !important;
  }
</style>