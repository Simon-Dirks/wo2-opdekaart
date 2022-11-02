<script setup lang="ts">
import { onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import SourceSelect from "./SourceSelect.vue";

// const mapService: _mapService = new _mapService();
const search: Ref<string> = ref("");
const store = useStore();

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
  <div class="bg-primary p-4">
    <n-input
      type="text"
      class="rounded-lg mr-2"
      placeholder="Zoeken..."
      v-model:value="search"
      @keyup.enter="onSearch"
      v-debounce:300ms="onSearch"
    />

    <source-select class="mt-4"></source-select>
  </div>
</template>

<style>
.n-input {
  display: inline-block;
  width: 17rem;
  border-radius: 0;
}

.n-input__input-el {
  width: 17rem !important;
}
</style>