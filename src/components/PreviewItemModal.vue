<script setup lang="ts">
import {useStore} from "vuex";
import {computed, ComputedRef} from "vue";
import {Close} from "@vicons/ionicons5";
import {ScanModel} from "../models/marker.model";
import ScanSwiper from "./ScanSwiper.vue";

const store = useStore();
const isShown: ComputedRef<boolean> = computed(() => store.getters["previewModal/getIsShown"]);
const shownScans: ComputedRef<ScanModel[]> = computed(() => store.getters["previewModal/getShownScans"]);
const closeModal = () => store.commit("previewModal/setShownScans", []);
</script>

<template>
  <n-modal v-model:show="isShown" :on-mask-click="closeModal" :on-esc="closeModal" :closable="true">
    <n-card
        style="width: 95vw; height: 95vh"
        title="Scans"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
      <template #header-extra>
        <button @click="closeModal" class="relative right-[-1rem] top-[-0.8rem] ">
          <Icon size="20" class="transition-colors hover:text-primary">
            <Close/>
          </Icon>
        </button>
      </template>

      <scan-swiper :scans="shownScans" :isShownFullscreen="true"></scan-swiper>

      <!--      <template #footer>-->
      <!--        Footer-->
      <!--      </template>-->
    </n-card>
  </n-modal>
</template>