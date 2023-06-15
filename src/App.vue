<script setup lang="ts">
import { ref, Ref, watch } from "vue";
import MapRick from "./components/NewMap.vue";
import Search from "./components/Search.vue";
import { DataService } from "./services/data-service";
import { DataModel } from "./models/data.model";
import { AddressModel } from "./models/address.model";
import { useStore } from "vuex";
import NewSidebar from "./components/NewSidebar.vue";
import PreviewItemModal from "./components/PreviewItemModal.vue";
import IntroDialog from "./components/IntroDialog.vue";
import ColofonDialog from "./components/ColofonDialog.vue";

const store = useStore();

const isLoading: Ref<boolean> = ref(true);
const introDialogVisible: Ref<boolean> = ref(true);
const colofonDialogVisible: Ref<boolean> = ref(true);

const onMapLoaded = async () => {
  console.log("App.onMapLoaded");
  new DataService().init();
};

watch(
  () => store.getters["getAllData"],
  (allData: DataModel) => {
    console.log("App allData changed");

    isLoading.value = false;

    // exampleFilter();
    //when allData is loaded then set filteredData to allData.addresses
    //same as new DataRickService().resetFilter();
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
    new DataService().updateFilterFromStore();
  }
);

watch(
  () => store.getters["getSearchOption"],
  (searchOption) => {
    console.log("App getSearchOption", searchOption);
    new DataService().updateFilterFromStore();
  }
);

watch(
  () => store.getters["getShownSourceIds"].keys(),
  () => {
    console.log(
      "APP Updated selected source ID",
      store.getters["getShownSourceIds"]
    );
    new DataService().updateFilterFromStore();
  }
);

// watch(
//   () => store.getters["getShownSourceIds"],
//   (sourceIds) => {
//     console.log("App getShownSourceIds", sourceIds);
//     // new DataService().updateFilterFromStore();
//   }
// );
</script>

<template>
  <preview-item-modal></preview-item-modal>

  <div class="md:grid md:grid-cols-6 h-[60vh] md:h-full">
    <div class="md:col-span-6 h-full">
      <div class="h-full">
        <search class="absolute top-4 left-4 z-10"></search>
        <map-rick @onMapLoaded="onMapLoaded"></map-rick>
        <new-sidebar></new-sidebar>
      </div>
    </div>
  </div>
  <intro-dialog
    v-if="introDialogVisible"
    :is-loading="isLoading"
    @close="introDialogVisible = false"
  />
  <!-- <colofon-dialog
    v-if="colofonDialogVisible"
    @close="colofonDialogVisible = false"
  /> -->
</template>

<style scoped></style>