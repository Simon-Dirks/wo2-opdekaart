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

const onScroll = (e) => {
  const { scrollTop, offsetHeight, scrollHeight } = e.target;
  const hasScrolledToBottom = scrollTop + offsetHeight >= scrollHeight;
  if (hasScrolledToBottom) {
    numShownAddresses.value += 10;
  }
};
</script>

<template>
  <div
    class="fixed right-4 top-4 w-96 h-screen overflow-y-auto"
    @scroll="onScroll($event)"
  >
    <preview-item
      v-for="address in filteredAddresses.slice(0, numShownAddresses)"
      v-if="filteredAddresses"
      :address="address"
      :key="address.addressId"
    ></preview-item>
  </div>
</template>