<script setup lang="ts">
import {MapService} from "../services/map.service";
import {onMounted, Ref, ref, watch} from 'vue'
import {store} from "../store";

const mapService: MapService = new MapService();
const search: Ref<string> = ref('');
const radioOption: Ref<string> = ref('all');

const radioOptions = [
  {
    value: "all",
    label: "Alles"
  },
  {
    value: 'people',
    label: 'Personen'
  },
  {
    value: 'addresses',
    label: 'Adressen'
  }
];

const onUpdate = (search: string) => {
  store.commit("updateSearchTerm", search);
}

onMounted(() => {
  watch(() => store.getters["getSearchTerm"], (searchTerm: string) => {
    search.value = searchTerm;
  });
});

</script>

<template>
  <div class="drop-shadow">
    <input type="text" class="px-4 py-3 rounded-lg w-[93vw] md:w-80 mb-1" placeholder="Zoeken..." v-model.trim="search" v-debounce="onUpdate">
    <br/>

    <n-radio-group v-model:value="radioOption" name="radiogroup" class="bg-[rgba(255,255,255,0.8)] px-4 py-2 rounded-lg">
      <n-space>
        <n-radio
            v-for="option in radioOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
        />
      </n-space>
    </n-radio-group>

<!--    <n-input size="large" round placeholder="Zoeken..." v-model.trim="search"  v-debounce="onUpdate"/>-->
  </div>
</template>

<style scoped>
</style>
