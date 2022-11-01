<script setup lang="ts">
import { watch } from "vue";
import MapRick from "./components/MapRick.vue";
import Search from "./components/Search.vue";
import SourceSelect from "./components/SourceSelect.vue";
import { DataRickService } from "./services/data-rick.service";
import { DataModel } from "./models/data.model";
import { AddressModel } from "./models/address.model";
import { SearchOptionModel } from "./models/search-option.model";
import { useStore } from "vuex";
import NewSidebar from "./components/NewSidebar.vue";
import PreviewItemModal from "./components/PreviewItemModal.vue";

const store = useStore();

const onMapLoaded = async () => {
  console.log("App.onMapLoaded");

  new DataRickService().init();
};

const exampleFilter = () => {
  const data = store.getters["getAllData"];

  new DataRickService().filterAddresses(
    data.addresses,
    "willem",
    SearchOptionModel.All,
    data.sources
  );
};

const resetExampleFilter = () => {
  new DataRickService().resetFilter();
};

watch(
  () => store.getters["getAllData"],
  (allData: DataModel) => {
    console.log("App allData changed");

    //when allData is loaded then set filteredData to allData.addresses
    //same as new DataRickService().resetFilter();
    store.commit("setFilteredAddresses", allData.addresses);
  }
);

watch(
  () => store.getters["getFilteredAddresses"],
  (filteredAddresses: AddressModel[]) => {
    console.log("App getFilteredAddresses changed", filteredAddresses.length);
  }
);

watch(
  () => store.getters["getSearchTerm"],
  (searchTerm) => {
    console.log("App getSearchTerm", searchTerm);
    new DataRickService().updateFilterFromStore();
  }
);

watch(
  () => store.getters["getSearchOption"],
  (searchOption) => {
    console.log("App getSearchOption", searchOption);
    new DataRickService().updateFilterFromStore();
  }
);

watch(
  () => store.getters["getShownSourceIds"].keys(),
  () => {
    console.log(
      "APP Updated selected source ID",
      store.getters["getShownSourceIds"]
    );
    new DataRickService().updateFilterFromStore();
  }
);

// watch(
//   () => store.getters["getShownSourceIds"],
//   (sourceIds) => {
//     console.log("App getShownSourceIds", sourceIds);
//     // new DataRickService().updateFilterFromStore();
//   }
// );
</script>

<template>
  <preview-item-modal></preview-item-modal>

  <div class="md:grid md:grid-cols-6 h-[50vh] md:h-full">
    <div class="md:col-span-6 h-full">
      <div class="h-full">
        <search class="absolute top-4 left-4 z-10"></search>
        <source-select class="absolute top-28 left-4 z-10"></source-select>
        <MapRick @onMapLoaded="onMapLoaded"></MapRick>
        <new-sidebar></new-sidebar>
      </div>
    </div>
  </div>
</template>

<style scoped></style>