<script setup lang="ts">
import mapboxgl from "mapbox-gl";
import { watch } from "vue";
import { useStore } from "vuex";
import { AddressModel } from "../models/address.model";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";

const store = useStore();

const MAPBOX_TOKEN: string =
  "pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ";
const MAPBOX_STYLE: string =
  "mapbox://styles/kverdult/cl6eris3u002115qgz3vg5l1n";
const MAPBOX_LIGHT_STYLE: string = "mapbox://styles/mapbox/light-v10";

const emit = defineEmits(["onMapLoaded"]);

const onMapLoaded = async (map: mapboxgl.Map) => {
  console.log("MapRick onMapLoaded");
  map.dragRotate.disable();

  // @ts-ignore
  map.addSource("markers-source", {
    type: "geojson",
    data: undefined,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points,
    clusterProperties: {
      document_count: ["+", ["get", "documentCount"]],
    },
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "markers-source",
    filter: ["has", "document_count"],
    paint: {
      "circle-color": "#22B49C",
      "circle-radius": [
        "step",
        ["get", "document_count"],
        20,
        100,
        30,
        750,
        40,
      ],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "markers-source",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{document_count}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
    paint: {
      "text-color": "white",
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "markers-source",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#22B49C",
      "circle-radius": 7,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });

  map.addLayer({
    id: "poi-labels",
    type: "symbol",
    source: "markers-source",
    filter: [">", ["zoom"], 16],
    layout: {
      "text-field": [
        "format",
        ["get", "streetName"],
        { "font-scale": 0.8 },
        " ",
        ["get", "houseNumber"],
        { "font-scale": 0.8 },
      ],

      // 'get', 'streetName'],
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      // 'text-size': .8,
      "text-radial-offset": 0.5,
      "text-justify": "auto",
    },
  });

  //TODO: this should be in a watch() right?
  // (map.getSource("markers-source") as any).setData(geoJSON);

  // store.getters["map/getGeoJson"]

  console.log("Map onMapLoaded...");

  watch(
    () => store.getters["getFilteredAddresses"],
    (filteredAddresses: AddressModel[]) => {
      console.log("Map getFilteredAddresses changed", filteredAddresses.length);

      const geoJSON = getGeoJSON(filteredAddresses);

      //TODO: map.getSource("markers-source") gaat fout bij HotReloading
      (map.getSource("markers-source") as any).setData(geoJSON);
    }
  );

  emit("onMapLoaded");
};

// getGeoJSON
// AddressesGeoJsonModel
const getGeoJSON = (addresses: AddressModel[]) => {
  const markersGeoJson: AddressesGeoJsonModel = {
    type: "FeatureCollection",
    features: [],
  };
  for (const address of addresses) {
    markersGeoJson.features.push({
      properties: {
        //cannot pass 'address' itself in here because Mapbox gets confused about circular reference
        addressId: address.addressId,
        streetName: address.streetName,
        houseNumber: address.houseNumber,
        documentCount: address.documentCount,
      },
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: address.coordinates,
      },
    });
  }
  console.log("Finished parsing GeoJSON...", markersGeoJson);
  return markersGeoJson;
};
</script>

<template>
  <mapbox-map
    :accessToken="MAPBOX_TOKEN"
    :center="[5.079400243080665, 52.09049473634017]"
    :maxZoom="20"
    :minZoom="4"
    :zoom="10"
    :mapStyle="MAPBOX_LIGHT_STYLE"
    @loaded="onMapLoaded"
  >
    <mapbox-navigation-control position="bottom-right" :show-compass="false" />
  </mapbox-map>
</template>

<style scoped></style>