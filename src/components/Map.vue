<script setup lang="ts">
import {computed, ref, Ref, watch} from "vue";
import {MapboxMap, MapboxNavigationControl} from "vue-mapbox-ts";
import {MapService} from "../services/map.service";
import PreviewItem from "./PreviewItem.vue";
import Search from "./Search.vue";
import {useStore} from "vuex";
import SourceSelect from "./SourceSelect.vue";
import {DataService} from "../services/data.service";
import {MarkerModel} from "../models/marker.model";
import {MarkersGeoJsonModel} from "../models/markers-geo-json.model";
import PreviewItemModal from "./PreviewItemModal.vue";
import {useLoadingBar} from "naive-ui";

const MAPBOX_TOKEN: string = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';
const MAPBOX_STYLE: string = 'mapbox://styles/kverdult/cl6eris3u002115qgz3vg5l1n';

const store = useStore();
const selectedItem = computed(() => store.getters.getSelectedItem);
const mapService: MapService = new MapService();
const shownPreviewItems: Ref<MarkerModel[]> = ref([]);

const loadingBar = useLoadingBar();

const onMapLoaded = (map: mapboxgl.Map) => {
  mapService.initialize(map).then(async () => {
    loadingBar.start();
    const dataService: DataService = new DataService();
    await dataService.updateMarkersFromServer().then(() => {
      loadingBar.finish();
    }).catch(() => {
      loadingBar.error();
    });
    updateShownPreviewItems(map);
  })


  watch(() => store.getters["getSearchTerm"], (searchTerm: string) => {
    console.log(searchTerm);
    updateShownPreviewItems(map);
  });

  watch(() => store.getters["map/getGeoJson"], (geoJson: MarkersGeoJsonModel | null) => {
    updateShownPreviewItems(map);
  });
};

const updateShownPreviewItems = (map: mapboxgl.Map) => {
  // TODO: "Debounce" this call for performance optimizations
  shownPreviewItems.value = mapService.getShownPreviewItems();
}

const getNumberOfDocumentsForShownPreviewItems = (): number => {
  // TODO: Show number of ALL preview items (instead of only the shown items)
  const shownScans = shownPreviewItems.value.map((marker: MarkerModel) => marker.scans.length);
  return shownScans.reduce((prev, curr) => prev + curr, 0);
}
</script>

<template>
  <preview-item-modal></preview-item-modal>

  <div class="md:grid md:grid-cols-6 h-[50vh] md:h-full">
    <div class="md:col-span-4 h-full">
      <div class="h-full">
        <search class="absolute top-4 left-4 z-20"></search>
        <source-select class="absolute top-20 left-4 z-20"></source-select>
        <mapbox-map
            :accessToken="MAPBOX_TOKEN"
            :center="[5.079400243080665, 52.09049473634017]"
            :maxZoom="20"
            :minZoom="4"
            :zoom="10"
            :mapStyle="MAPBOX_STYLE"
            @loaded="onMapLoaded"
            @zoom="updateShownPreviewItems"
            @move="updateShownPreviewItems">
          <mapbox-navigation-control position="bottom-right"/>
        </mapbox-map>
      </div>
    </div>
    <div class="md:col-span-2 bg-slate-600 py-0 overflow-y-auto h-[50vh] md:h-full text-white"
         id="preview-items-container">
      <!--      <h1 class="text-lg mb-4 sticky top-0 px-4 py-4 drop-shadow-2xl bg-slate-700 z-20"><strong>Totaal:</strong>-->
      <!--        {{ shownPreviewItems.length }} adressen en {{ getNumberOfDocumentsForShownPreviewItems() }} documenten</h1>-->
      <div class="px-4 pt-4">
        <template v-if="selectedItem">
          <preview-item
              :item="selectedItem"></preview-item>
        </template>
        <template v-if="!selectedItem">
          <preview-item :item="previewItem" v-for="previewItem in shownPreviewItems"></preview-item>
        </template>
      </div>

    </div>
  </div>

</template>

<style scoped>
</style>
