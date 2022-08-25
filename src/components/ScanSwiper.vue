<script setup lang="ts">
import {Swiper, SwiperSlide} from 'swiper/vue';
import {Keyboard, Mousewheel, Scrollbar} from 'swiper';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/keyboard';
import {onMounted, PropType} from "vue";
import {ScanModel} from "../models/marker.model";
import ScanSwiperSlide from "./ScanSwiperSlide.vue";

const modules = [Scrollbar, Mousewheel, Keyboard];

const props = defineProps({
  scans: {type: Object as PropType<ScanModel[]>, required: true},
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
    <swiper-slide v-for="(scan, idx) in props.scans" :key="scan.id + idx" class="h-full image-slide">
      <scan-swiper-slide :is-shown-fullscreen="isShownFullscreen" :scans="scans" :scan="scan"></scan-swiper-slide>
    </swiper-slide>
  </swiper>
</template>

<style>

</style>