<script setup lang="ts">
import {MapService} from "../services/map.service";
import {Ref, ref} from 'vue'
import {store} from "../store";

const mapService: MapService = new MapService();
const search: Ref<string> = ref('');

const onUpdate = (search: string) => {
  store.commit("updateSearchTerm", search);
  mapService.updateFilter();
}

</script>

<template>
  <div class="drop-shadow">
    <n-input size="large" round placeholder="Zoeken..." v-model.trim="search" v-debounce:100ms="onUpdate" />
  </div>
</template>

<style scoped>
</style>
