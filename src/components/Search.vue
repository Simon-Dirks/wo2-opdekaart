<script setup lang="ts">
import {MapService} from "../services/map.service";
import {onMounted, Ref, ref, watch} from 'vue'
import {store} from "../store";

const mapService: MapService = new MapService();
const search: Ref<string> = ref('');

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
    <input type="text" class="px-4 py-3 rounded-full w-[93vw] md:w-80" placeholder="Zoeken..." v-model.trim="search" v-debounce="onUpdate">
<!--    <n-input size="large" round placeholder="Zoeken..." v-model.trim="search"  v-debounce="onUpdate"/>-->
  </div>
</template>

<style scoped>
</style>
