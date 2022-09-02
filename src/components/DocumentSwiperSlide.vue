<template>
  <div class="h-full" style="flex: 0 1 auto;" v-if="document">
    <div class="" style="flex: 1 1 auto;">
      <button @click="openModal" class="w-full" :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'">
        <!-- TODO: Re-enable lazy loading when fullscreen-->
        <!-- TODO: Add pinch to zoom-->
        <img
            v-lazy="{
                    src: getImageUrl(document.imageUrl),
                    lifecycle: {
                      loaded: (el: any) => {swiper.updateAutoHeight()},
                      error: (el: any) => {
                        el.addEventListener('load', () => {swiper.updateAutoHeight()})
                      }
                    }
                }"
            alt=""
            class="w-full h-full max-h-[80vh] !object-contain" loading="lazy">
      </button>
    </div>
    <div class="text-center text-white drop-shadow" style="flex: 0 1 20px" v-if="isShownFullscreen">
      <p>{{ document.label }}
      </p>
<!--      <p><a :href="document.url" target="_blank">LINK</a></p>-->
<!--      <p>{{ document.source.id }}</p>-->
    </div>
  </div>
</template>

<script setup lang="ts">

import {PropType} from "vue";
import {store} from "../store";
import {useSwiper} from "swiper/vue";
import {DocumentModel} from "../models/document.model";

const props = defineProps({
  documents: {type: Object as PropType<DocumentModel[]>, required: true},
  document: {type: Object as PropType<DocumentModel>, required: true},
  isShownFullscreen: {type: Boolean, required: false},
})

const openModal = () => {
  store.commit("previewModal/setShownDocuments", props.documents);
  store.commit("previewModal/setIsShown", true);
}

const getImageUrl = (imgUrl: string): string | undefined => {
  if(!imgUrl) {
    return undefined;
  }

  const imgId: string = imgUrl.replace('https://proxy.archieven.nl/thumb/39/', '');
  const url = `https://proxy.archieven.nl/${props.isShownFullscreen ? 'download' : 'thumb'}/39/`;
  return url + imgId;
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