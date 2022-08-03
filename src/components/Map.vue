<script setup lang="ts">
import {computed} from "vue";
import {MapboxMap, MapboxNavigationControl} from "vue-mapbox-ts";
import {MapHelper} from "../helpers/mapHelper";
import PreviewItem from "./PreviewItem.vue";
import {useStore} from "vuex";
import {MarkerProperties} from "../models/markerProperties";

const MAPBOX_TOKEN: string = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';
const MAPBOX_STYLE: string = 'mapbox://styles/simondirks/ckggjvjq90ewx19pbojtgnrel';

const store = useStore();
const selectedItem = computed(() => store.getters.getSelectedItem);

const onMapLoaded = (map: any) => {
  MapHelper.initializeFromGeoJson(map, "/adressen.geojson");

  map.on('click', 'unclustered-point', (e: any) => {
    e.preventDefault();

    MapHelper.onMapMarkerClicked(map, e);

    const markerProperties: MarkerProperties = MapHelper.getMarkerProperties(e);
    store.commit("selectItem", {
      img: {url: "https://via.placeholder.com/1000x200", alt: "Alt"},
      label: markerProperties.straatnaam
    })
  });

  map.on('click', (e: any) => {
    if (e.defaultPrevented) {
      return;
    }
    store.commit("deselectItem");
  });
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
          :item="selectedItem"></PreviewItem>
    </div>
  </div>

</template>

<style scoped>
</style>
