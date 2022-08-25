<template>
  <div class="h-full" style="flex: 0 1 auto;">
    <div class="" style="flex: 1 1 auto;">
      <button @click="openModal" class="w-full" :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'">
        <!-- TODO: Re-enable lazy loading when fullscreen-->
        <!-- TODO: Add pinch to zoom-->
        <img
            v-lazy="{
                    src: getImageSourceById(scan.id),
                    lifecycle: {
                      loaded: (el) => {swiper.updateAutoHeight()},
                      error: (el) => {el.addEventListener('load', () => {swiper.updateAutoHeight()}) }
                    }
                }"
            alt=""
            class="w-full h-full max-h-[80vh] !object-contain" loading="lazy">
      </button>
    </div>
    <div class="text-center text-white drop-shadow" style="flex: 0 1 40px" v-if="isShownFullscreen">
      <p>{{ scan.title }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ScanModel} from "../models/marker.model";
import {PropType} from "vue";
import {store} from "../store";
import {useSwiper} from "swiper/vue";

const props = defineProps({
  scans: {type: Object as PropType<ScanModel[]>, required: true},
  scan: {type: Object as PropType<ScanModel>, required: true},
  isShownFullscreen: {type: Boolean, required: false},
})

const openModal = () => {
  store.commit("previewModal/setShownScans", props.scans);
  store.commit("previewModal/setIsShown", true);
}

const getImageSourceById = (id: string | null) => {
  const url = `https://proxy.archieven.nl/${props.isShownFullscreen ? 'download' : 'thumb'}/39/`;
  return id ? url + id : 'https://via.placeholder.com/1000x200';
}

const swiper = useSwiper();
</script>

<style>
.image-slide img {
  object-fit: contain !important;
  width: 100%;
}

.image-slide .n-image {
  justify-content: space-around;
}
</style>