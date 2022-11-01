<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from "vue";
import { AddressModel } from "../models/address.model";
import { useStore } from "vuex";
import PreviewItem from "./PreviewItem.vue";

const store = useStore();
const numShownAddresses: Ref<number> = ref(10);

const filteredAddresses: ComputedRef<AddressModel[]> = computed(
  () => store.getters["getFilteredAddresses"]
);

const selectedAddress: ComputedRef<AddressModel | null> = computed(
  () => store.getters.getSelectedItem
);

const getNumberOfDocuments = (): number => {
  if (!filteredAddresses || !filteredAddresses.value) return 0;

  const shownDocumentsNums: number[] = filteredAddresses.value.map(
    (address: AddressModel) => address.filteredDocuments.length
  );
  return shownDocumentsNums.reduce((prev, curr) => prev + curr, 0);
};

const onScroll = (e) => {
  const { scrollTop, offsetHeight, scrollHeight } = e.target;
  const hasScrolledToBottom = scrollTop + offsetHeight >= scrollHeight - 100; //TODO: -100 added as a fix
  if (hasScrolledToBottom) {
    numShownAddresses.value += 10;
    console.log("scrolled to bottom...");
  }
};

const myTest = (e) => {
  console.log("test", filteredAddresses, numShownAddresses);
  numShownAddresses.value += 10;
};
</script>

<template>
  <div
    class="fixed right-4 top-4 w-96 h-screen overflow-y-auto"
    @scroll="onScroll($event)"
  >
    <p @click="myTest">test: klik om scroll te activeren</p>
    <h1
      class="text-lg mb-4 top-0 px-4 py-4 drop-shadow-2xl bg-slate-700 z-10"
      v-if="!selectedAddress"
    >
      {{ filteredAddresses?.length }} adres{{
        filteredAddresses?.length !== 1 ? "sen" : ""
      }}
      en {{ getNumberOfDocuments() }} document{{
        getNumberOfDocuments() !== 1 ? "en" : ""
      }}
    </h1>

    <preview-item
      v-for="(address, index) in filteredAddresses.slice(0, numShownAddresses)"
      v-if="filteredAddresses"
      :address="address"
      :index="index"
      :key="address.addressId"
      @click="myTest"
    ></preview-item>
  </div>
</template>
