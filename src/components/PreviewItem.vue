<script setup lang="ts">
import {PropType} from "vue";
import {InsertLinkSharp} from "@vicons/material";
import {MarkerModel} from "../models/marker.model";
import 'swiper/css';
import 'swiper/css/scrollbar';
import ScanSwiper from "./ScanSwiper.vue";

const props = defineProps({
  item: {type: Object as PropType<MarkerModel | null>, required: true}
})

</script>

<template>
  <Transition>
    <n-card :title="props.item?.label" v-if="props.item" hoverable class="mb-4">
<!--      <template #cover class="w-full">-->
<!--      </template>-->

      <p class="mb-3">Documenten: {{props.item?.scans.length}}</p>

      <scan-swiper :scans="props.item?.scans" :is-shown-fullscreen="false"></scan-swiper>

      <template #action>
        <a href="#" class="italic hover:text-primary">
          <Icon size="20" class="relative top-[0.3rem]">
            <InsertLinkSharp/>
          </Icon>
          Oorspronkelijke bron</a>
      </template>
    </n-card>
  </Transition>

</template>

<style>
#preview-items-container .n-card-header {
  padding-bottom: 0 !important;
}
</style>
