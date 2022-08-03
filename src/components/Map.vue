<script setup lang="ts">
import {onMounted} from "vue";
import {MapboxMap, MapboxNavigationControl} from "vue-mapbox-ts";
import {MapHelper} from "../helpers/map.helper";
import PreviewItem from "./PreviewItem.vue";

const MAPBOX_TOKEN: string = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';
const MAPBOX_STYLE: string = 'mapbox://styles/simondirks/ckggjvjq90ewx19pbojtgnrel';

onMounted(() => {
})

const onMapLoaded = (map: any) => {
  MapHelper.initializeFromGeoJson(map, "/adressen.geojson");
};
</script>

<template>
  <div class="md:grid md:grid-cols-6 h-[50vh] md:h-full">
    <div class="md:col-span-5 h-full">
      <mapbox-map :accessToken="MAPBOX_TOKEN" :mapStyle="MAPBOX_STYLE"
                  :center="[4.897, 52.377]"
                  :maxZoom="15"
                  :minZoom="4"
                  :zoom="10"
                  @loaded="onMapLoaded">
        <mapbox-navigation-control position="bottom-right"/>
      </mapbox-map>
    </div>
    <div class="md:col-span-1 bg-slate-500 p-4 overflow-y-auto h-[50vh] md:h-full">
      <PreviewItem
          :item="{label: 'Label', img: {url: 'https://via.placeholder.com/1000x200', alt: 'Alt'}}"></PreviewItem>
      <PreviewItem
          :item="{label: 'Label', img: {url: 'https://via.placeholder.com/1000x200', alt: 'Alt'}}"></PreviewItem>
      <PreviewItem
          :item="{label: 'Label', img: {url: 'https://via.placeholder.com/1000x200', alt: 'Alt'}}"></PreviewItem>
      <PreviewItem
          :item="{label: 'Label', img: {url: 'https://via.placeholder.com/1000x200', alt: 'Alt'}}"></PreviewItem>
    </div>
  </div>

</template>

<style scoped>
</style>
