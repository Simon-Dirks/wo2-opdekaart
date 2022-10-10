<script setup lang="ts">
import { MapService } from "../services/map.service";
import { onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { SearchOptionModel } from "../models/search-option.model";

const mapService: MapService = new MapService();
const search: Ref<string> = ref("");
const searchOption: Ref<string> = ref(SearchOptionModel.All);

const searchOptions = [
  {
    value: SearchOptionModel.All,
    label: "Alles",
  },
  {
    value: SearchOptionModel.People,
    label: "Personen",
  },
  {
    value: SearchOptionModel.Addresses,
    label: "Adressen",
  },
];

const store = useStore();

watch(
  searchOption,
  (currentOption: SearchOptionModel, prevOption: SearchOptionModel) => {
    console.log(
      SearchOptionModel[prevOption],
      "->",
      SearchOptionModel[currentOption]
    );
    store.commit("setSearchOption", currentOption);
  }
);

const onSearchButtonClicked = () => {
  console.log("onUpdate", search);
  store.commit("setSearchTerm", search.value);
};

onMounted(() => {
  watch(
    () => store.getters["getSearchTerm"],
    (searchTerm: string) => {
      search.value = searchTerm;
      // console.log(search);
    }
  );
});
</script>

<template>
  <div class="drop-shadow">
    <div class="mb-1">
      <n-input
        type="text"
        class="rounded-lg mr-2"
        placeholder="Zoeken"
        v-model:value="search"
        @keyup.enter="onSearchButtonClicked"
      />

      <n-button
        primary
        class="px-4 py-2 rounded-lg inline-block"
        type="primary"
        @click="onSearchButtonClicked"
      >
        Zoeken
      </n-button>
    </div>

    <n-radio-group
      v-model:value="searchOption"
      name="radiogroup"
      class="bg-[rgba(255,255,255,0.8)] px-4 py-2 rounded-lg"
    >
      <n-space>
        <n-radio
          v-for="option in searchOptions"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        />
      </n-space>
    </n-radio-group>
  </div>
</template>

<style scoped>
.n-input {
  display: inline-block;
  width: 15rem;
}
</style>
