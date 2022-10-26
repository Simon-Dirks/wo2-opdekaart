<script setup lang="ts">
import { GlobalThemeOverrides } from "naive-ui";
import { Ref, ref, watch } from "vue";

import MapRick from "./components/MapRick.vue";
import { DataRickService } from "./services/data-rick.service";
import { DataModel } from "./models/data.model";
import { AddressModel } from "./models/address.model";
import { SearchOptionModel } from "./models/search-option.model";
import { AddressesGeoJsonModel } from "./models/addresses-geo-json.model";
import { useStore } from "vuex";
const store = useStore();

// const loadData = async () => {
//
// };

const onMapLoaded = async () => {
  console.log("App.onMapLoaded");
  // loadData();

  // watch(
  //   () => store.getters["map/getFilteredGeoJson"],
  //   (geoJson: AddressesGeoJsonModel | null) => {
  //     console.log("cb");
  //     // updateShownAddresses(map);
  //   }
  // );
};
//
// const updateShownAddresses = async (map: mapboxgl.Map) => {
//   await store.dispatch("map/updateShownAddressesInBounds", map.getBounds());
// };
</script>

<template>
  <MapRick ref="map" @onMapLoaded="onMapLoaded" data=""></MapRick>
</template>

<style scoped></style>
