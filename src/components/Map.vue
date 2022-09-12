<script setup lang="ts">
import {computed, ComputedRef, ref, Ref, watch} from "vue";
import {MapboxMap, MapboxNavigationControl} from "vue-mapbox-ts";
import {MapService} from "../services/map.service";
import AddressPreview from "./PreviewItem.vue";
import Search from "./Search.vue";
import {useStore} from "vuex";
import SourceSelect from "./SourceSelect.vue";
import {DataService} from "../services/data.service";
import {AddressesGeoJsonModel} from "../models/addresses-geo-json.model";
import PreviewItemModal from "./PreviewItemModal.vue";
import Pagination from "./Pagination.vue";
import {useLoadingBar} from "naive-ui";
import {AddressModel} from "../models/address.model";

const MAPBOX_TOKEN: string = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';
const MAPBOX_STYLE: string = 'mapbox://styles/kverdult/cl6eris3u002115qgz3vg5l1n';
const MAPBOX_LIGHT_STYLE: string = 'mapbox://styles/mapbox/light-v10';

const store = useStore();
const selectedAddress: ComputedRef<AddressModel | null> = computed(() => store.getters.getSelectedItem);

const pageStartElemIdx: ComputedRef<number> = computed(() => store.getters["pagination/getStartElemIdx"]);
const pageEndElemIdx: ComputedRef<number> = computed(() => store.getters["pagination/getEndElemIdx"]);
const shownAddresses: ComputedRef<number> = computed(() => store.getters["map/getShownAddresses"]);

const mapService: MapService = new MapService();

const allAddresses: Ref<AddressModel[]> = ref([]);

const loadingBar = useLoadingBar();

const onMapLoaded = (map: mapboxgl.Map) => {
  mapService.initialize(map).then(async () => {
    loadingBar.start();

    const dataService: DataService = new DataService();
    await dataService.updateFromServer().then(() => {
      loadingBar.finish();
    }).catch(() => {
      loadingBar.error();
    });
    void updateShownAddresses(map);
  })

  watch(() => store.getters["map/getFilteredGeoJson"], (geoJson: AddressesGeoJsonModel | null) => {
    updateShownAddresses(map);
  });
};

const updateShownAddresses = async (map: mapboxgl.Map) => {
  await store.dispatch("map/updateShownAddressesInBounds", map.getBounds());
}

const getNumberOfDocuments = (): number => {
  const shownDocumentsNums: number[] = shownAddresses.value.map((address: AddressModel) => address.documents.length);
  return shownDocumentsNums.reduce((prev, curr) => prev + curr, 0);
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
            :mapStyle="MAPBOX_LIGHT_STYLE"
            @moveend="updateShownAddresses($event.target)"
            @loaded="onMapLoaded"
        >
          <mapbox-navigation-control position="bottom-right"/>
        </mapbox-map>
      </div>
    </div>
    <div class="md:col-span-2 bg-slate-600 py-0 overflow-y-auto h-[50vh] md:h-full text-white"
         id="preview-items-container">
      <h1 class="text-lg mb-4 sticky top-0 px-4 py-4 drop-shadow-2xl bg-slate-700 z-20" v-if="!selectedAddress">
        <strong>Totaal:</strong>
        {{ shownAddresses.length }} adres{{ shownAddresses.length !== 1 ? 'sen' : '' }} en {{ getNumberOfDocuments() }}
        document{{ getNumberOfDocuments() !== 1 ? 'en' : '' }}
      </h1>
      <div class="px-4 pt-4">
        <template v-if="selectedAddress">
          <address-preview
              :address="selectedAddress"></address-preview>
        </template>
        <template v-if="!selectedAddress">
          <address-preview :address="shownAddress"
                           v-for="shownAddress in shownAddresses.slice(pageStartElemIdx, pageEndElemIdx)"></address-preview>


        </template>
      </div>

      <div class="w-full sticky bottom-0 px-4 py-2 drop-shadow-2xl bg-slate-700 z-20" v-if="!selectedAddress">
        <pagination :max-elements="shownAddresses.length"></pagination>
      </div>
    </div>
  </div>

</template>

<style scoped>
</style>
