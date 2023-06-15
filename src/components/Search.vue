<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import SourceSelect from "./SourceSelect.vue";
import { SearchOptionModel } from "../models/search-option.model";
import { InformationCircle } from "@vicons/ionicons5";

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

const showColofon = () => {
  store.commit("setColofonDialogVisible", true);
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
    <h2 class="text-white font-bold mb-2">
      Utrechtse WO2-bronnen op de kaart

      <n-tooltip trigger="hover">
        <template #trigger>
          <Icon
            size="20"
            class="relative top-[0.3rem] cursor-pointer text-[#e3e3e3] hover:text-white transition-colors duration-300"
          >
            <InformationCircle @click="showColofon" />
          </Icon>
        </template>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          <br />
          Ab
          <button @click="showColofon"><u>colofon knop</u></button>
          assumenda, blanditiis, consequuntur corporis doloremque dolores
          explicabo fuga in.
        </p>
      </n-tooltip>
    </h2>
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

.v-binder-follower-container {
  z-index: 20 !important;
}
</style>