<script setup lang="ts">
import { computed, ComputedRef, ref, Ref, watch } from "vue";
import { MapboxMap, MapboxNavigationControl } from "vue-mapbox-ts";
import { MapService } from "../services/map.service";
import Search from "./Search.vue";
import { useStore } from "vuex";
import SourceSelect from "./SourceSelect.vue";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";
import { AddressModel } from "../models/address.model";
import { DataService } from "../services/data.service";
// import { useLoadingBar } from "naive-ui";
import IntroDialog from "./IntroDialog.vue";
import Sidebar from "./_Sidebar.vue";
import PreviewItemModal from "./PreviewItemModal.vue";
import { DataRickService } from "../services/data-rick.service";

const MAPBOX_TOKEN: string =
  "pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ";
const MAPBOX_STYLE: string =
  "mapbox://styles/kverdult/cl6eris3u002115qgz3vg5l1n";
const MAPBOX_LIGHT_STYLE: string = "mapbox://styles/mapbox/light-v10";

const store = useStore();

const mapService: MapService = new MapService();

const allAddresses: Ref<AddressModel[]> = ref([]);

const isLoading: Ref<boolean> = ref(false);
const introDialogVisible: Ref<boolean> = ref(false);

// const loadingBar = useLoadingBar();

const onMapLoaded = (map: mapboxgl.Map) => {
  mapService.initialize(map).then(async () => {
    // loadingBar.start();
    isLoading.value = true;

    const dataRickService: DataRickService = new DataRickService();
    await dataRickService.init();

    // const dataService: DataService = new DataService();
    // await dataService
    //   .updateFromServer()
    //   .then(() => {
    //     isLoading.value = false;
    //     // loadingBar.finish();
    //   })
    //   .catch(() => {
    //     // loadingBar.error();
    //   });
    void updateShownAddresses(map);
  });

  watch(
    () => store.getters["map/getFilteredGeoJson"],
    (geoJson: AddressesGeoJsonModel | null) => {
      updateShownAddresses(map);
    }
  );
};

const updateShownAddresses = async (map: mapboxgl.Map) => {
  await store.dispatch("map/updateShownAddressesInBounds", map.getBounds());
};
</script>

<template>
  <preview-item-modal></preview-item-modal>

  <div class="md:grid md:grid-cols-6 h-[50vh] md:h-full">
    <div class="md:col-span-4 h-full">
      <div class="h-full">
        <search class="absolute top-4 left-4 z-10"></search>
        <source-select class="absolute top-28 left-4 z-10"></source-select>
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
          <mapbox-navigation-control
            position="bottom-right"
            :show-compass="false"
          />
        </mapbox-map>
      </div>
    </div>

    <sidebar></sidebar>
  </div>

  <intro-dialog
    v-if="introDialogVisible"
    :is-loading="isLoading"
    @close="introDialogVisible = false"
  />
</template>
