<script setup lang="ts">
import {computed, ref, Ref} from "vue";
import {MapboxMap, MapboxNavigationControl} from "vue-mapbox-ts";
import {MapService} from "../services/map.service";
import PreviewItem from "./PreviewItem.vue";
import Search from "./Search.vue";
import {useStore} from "vuex";
import SourceSelect from "./SourceSelect.vue";
import {DataService} from "../services/data.service";
import {MarkerModel} from "../models/marker.model";

const MAPBOX_TOKEN: string = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';
const MAPBOX_STYLE: string = 'mapbox://styles/simondirks/ckggjvjq90ewx19pbojtgnrel';

const store = useStore();
const selectedItem = computed(() => store.getters.getSelectedItem);
const mapService: MapService = new MapService();
const shownPreviewItems: Ref<MarkerModel[]> = ref([]);

const onMapLoaded = (map: mapboxgl.Map) => {
  mapService.initialize(map);
  const dataService: DataService = new DataService();
  void dataService.updateMarkersFromServer();
  updateShownPreviewItems(map);
};

const updateShownPreviewItems = (map: mapboxgl.Map) => {
  shownPreviewItems.value = getAllPreviewItems();
}

const getAllPreviewItems = () => {
  return mapService.getShownPreviewItems();
}
</script>

<template>
  <div class="md:grid md:grid-cols-6 h-[50vh] md:h-full">
    <div class="md:col-span-5 h-full">
      <div class="h-full">
        <Search class="absolute top-4 left-4 z-20"></Search>
        <SourceSelect class="absolute top-20 left-4 z-20"></SourceSelect>
        <mapbox-map :accessToken="MAPBOX_TOKEN" :mapStyle="MAPBOX_STYLE"
                    :center="[4.897, 52.377]"
                    :maxZoom="15"
                    :minZoom="4"
                    :zoom="10"
                    @loaded="onMapLoaded"
                    @zoom="updateShownPreviewItems"
                    @move="updateShownPreviewItems">
          <mapbox-navigation-control position="bottom-right"/>
        </mapbox-map>
      </div>
    </div>
    <div class="md:col-span-1 bg-slate-600 p-4 overflow-y-auto h-[50vh] md:h-full text-white"
         id="preview-items-container">
      <template v-if="selectedItem">
        <PreviewItem
            :item="selectedItem"></PreviewItem>
      </template>
      <template v-if="!selectedItem">
        <PreviewItem :item="previewItem" v-for="previewItem in shownPreviewItems"></PreviewItem>
      </template>
    </div>
  </div>

</template>

<style scoped>
</style>
