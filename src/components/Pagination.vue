<template>
  <div class="w-full grid grid-cols-12 text-center" v-if="maxElements > 0">
    <div class="col-span-2">
      <button
        @click="goToFirstPage"
        :disabled="!prevPageIsAvailable"
        :class="{ 'opacity-50': !prevPageIsAvailable }"
      >
        <Icon size="20" class="relative top-[0.3rem]">
          <PlaySkipBack />
        </Icon>
      </button>
    </div>

    <div class="col-span-2">
      <button
        @click="goToPrevPage"
        :disabled="!prevPageIsAvailable"
        :class="{ 'opacity-50': !prevPageIsAvailable }"
      >
        <Icon size="20" class="relative top-[0.3rem]">
          <PlayBack />
        </Icon>
      </button>
    </div>

    <div class="col-span-4">
      <p class="pt-[0.3rem]">
        Pagina: {{ currentPage + 1 }} / {{ finalPageNum + 1 }}
      </p>
      <!-- ({{ pageStartElemIdx + 1 }} - {{ pageEndElemIdx }}) -->
    </div>

    <div class="col-span-2">
      <button
        @click="goToNextPage"
        :disabled="!nextPageIsAvailable"
        :class="{ 'opacity-50': !nextPageIsAvailable }"
      >
        <Icon size="20" class="relative top-[0.3rem]">
          <PlayForward />
        </Icon>
      </button>
    </div>

    <div class="col-span-2">
      <button
        @click="goToLastPage"
        :disabled="!nextPageIsAvailable"
        :class="{ 'opacity-50': !nextPageIsAvailable }"
      >
        <Icon size="20" class="relative top-[0.3rem]">
          <PlaySkipForward />
        </Icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, watch } from "vue";
import { useStore } from "vuex";
import {
  PlayBack,
  PlayForward,
  PlaySkipBack,
  PlaySkipForward,
} from "@vicons/ionicons5";
import { AddressesGeoJsonModel } from "../models/addresses-geo-json.model";

const props = defineProps({
  maxElements: { type: Number, required: true },
});

const store = useStore();
const currentPage: ComputedRef<number> = computed(
  () => store.getters["pagination/getCurrentPage"]
);
const pageStartElemIdx: ComputedRef<number> = computed(
  () => store.getters["pagination/getStartElemIdx"]
);
const pageEndElemIdx: ComputedRef<number> = computed(() =>
  Math.min(props.maxElements, store.getters["pagination/getEndElemIdx"])
);
const prevPageIsAvailable: ComputedRef<boolean> = computed(
  () => store.getters["pagination/prevPageIsAvailable"]
);
const nextPageIsAvailable: ComputedRef<boolean> = computed(() =>
  store.getters["pagination/nextPageIsAvailable"](props.maxElements)
);
const finalPageNum: ComputedRef<number> = computed(() =>
  store.getters["pagination/getFinalPageNum"](props.maxElements)
);

const goToNextPage = () => {
  store.dispatch("pagination/goToNextPage");
};
const goToPrevPage = () => store.dispatch("pagination/goToPrevPage");
const goToFirstPage = () => store.commit("pagination/setPage", 0);
const goToLastPage = () =>
  store.commit("pagination/setPage", finalPageNum.value);

watch(
  () => store.getters["map/getFilteredGeoJson"],
  (geoJson: AddressesGeoJsonModel | null) => {
    goToFirstPage();
  }
);

watch(
  () => store.getters["map/getShownAddresses"],
  () => {
    goToFirstPage();
  }
);
</script>

<style scoped></style>
