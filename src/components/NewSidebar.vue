<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from "vue";
import { AddressModel } from "../models/address.model";
import { useStore } from "vuex";
import PreviewItem from "./PreviewItem.vue";

const store = useStore();
const numShownAddresses: Ref<number> = ref(10);

const selectedAddress: ComputedRef<AddressModel | null> = computed(
  () => store.getters.getSelectedAddress
);

const filteredAddresses: ComputedRef<AddressModel[]> = computed(() => {
  if (selectedAddress.value) {
    return [selectedAddress.value];
  }
  return store.getters["getFilteredAddresses"];
});

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
</script>

<template>
  <div
    class="fixed right-4 top-4 w-96 h-screen overflow-y-auto"
    @scroll="onScroll($event)"
  >
    <div class="text-lg mb-4 px-4 py-4 bg-primary z-10" v-if="!selectedAddress">
      <h1 class="text-white">
        {{ filteredAddresses?.length }} adres{{
          filteredAddresses?.length !== 1 ? "sen" : ""
        }}
        en {{ getNumberOfDocuments() }} document{{
          getNumberOfDocuments() !== 1 ? "en" : ""
        }}
      </h1>
    </div>

    <preview-item
      v-for="(address, index) in filteredAddresses.slice(0, numShownAddresses)"
      v-if="filteredAddresses"
      :address="address"
      :index="index"
      :key="address.addressId"
    ></preview-item>
  </div>
</template>