<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import SourceSelect from "./SourceSelect.vue";
import { SearchOptionModel } from "../models/search-option.model";

// const mapService: _mapService = new _mapService();
const search: Ref<string> = ref("");
const store = useStore();

const placeholder: ComputedRef<string> = computed(() => {
  const searchOption = store.getters["getSearchOption"];
  if (searchOption == SearchOptionModel.All)
    return "Zoeken naar personen en adressen...";
  else if (searchOption == SearchOptionModel.People)
    return "Zoeken naar personen...";
  else if (searchOption == SearchOptionModel.Addresses)
    return "Zoeken naar adressen...";
  else return "Zoeken...";
});

//

const onSearch = () => {
  console.log("Searching:", search.value);
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
  <div class="bg-primary p-2 sm:p-4">
    <n-input
      type="text"
      class="rounded-lg mr-2"
      :placeholder="placeholder"
      v-model:value="search"
      @keyup.enter="onSearch"
      v-debounce:300ms="onSearch"
    />

    <source-select class="mt-2 sm:mt-4"></source-select>
  </div>
</template>

<style>
.n-input {
  display: inline-block;
  width: 17rem;
  border-radius: 0;
  /*--n-height: 1.7rem !important;*/
}

.n-input__input-el {
  width: 17rem !important;
}
</style>