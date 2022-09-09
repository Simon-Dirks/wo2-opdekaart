<template>
  <div :class="[isShownFullscreen ? 'grid grid-cols-6 text-white grid-flow-dense': '']" v-if="document">
    <div class="col-span-6 h-full flex-initial" :class="[documentRefersToPeople ? 'md:col-start-3 md:col-span-4' : '' ]">
      <div class="flex-auto">
        <button @click="openModal" class="w-full" :class="isShownFullscreen ? 'cursor-default' : 'cursor-pointer'">
          <!-- TODO: Add pinch to zoom-->
          <img
              v-lazy="{
                    src: getImageUrl(document.imageUrl),
                    lifecycle: {
                      loaded: (el: any) => {
                        if(!swiper) {
                          return;
                        }
                        swiper.updateAutoHeight()
                        },
                      error: (el: any) => {
                        if(!swiper) {
                          return;
                        }
                        el.addEventListener('load', () => {swiper.updateAutoHeight()})
                      }
                    }
                }"
              alt=""
              class="w-full h-full max-h-[80vh] !object-contain" loading="lazy">
        </button>
      </div>
      <div class="text-center drop-shadow flex-[0_1_20px]" v-if="isShownFullscreen">
        <p>{{ document.label }}
        </p>
        <!--      <p><a :href="document.url" target="_blank">LINK</a></p>-->
        <!--      <p>{{ document.source.id }}</p>-->
      </div>
    </div>

    <div class="col-span-6 max-h-[90vh] overflow-y-auto flex-initial md:col-span-2" v-if="isShownFullscreen && documentRefersToPeople">
      <h2 class="text-2xl">Personen</h2>
      <ul class="list-disc">
        <li v-for="person in props.document.people">{{ person.label }}</li>
      </ul>
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

const getImageUrl = (imgUrl: string): string => {
  if (!imgUrl) {
    return 'https://via.placeholder.com/350x150';
  }

  const imgId: string = imgUrl.replace('https://proxy.archieven.nl/thumb/39/', '');
  const url = `https://proxy.archieven.nl/${props.isShownFullscreen ? 'download' : 'thumb'}/39/`;
  return url + imgId;
}

const swiper = useSwiper();

const documentRefersToPeople: boolean = props.document?.people && props.document.people.length > 0;
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