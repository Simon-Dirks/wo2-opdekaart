<script setup lang="ts">
import {MapService} from "../services/map.service";
import {Ref, ref} from 'vue'

const mapService: MapService = new MapService();
const search: Ref<string> = ref('');

const onUpdate = (e: any) => {
  const search: string = e.target.value;
  mapService.updateFilter(search);
}
</script>

<template>
  <div class="drop-shadow">
    <n-input size="large" round placeholder="Zoeken..." v-model.trim="search" @keyup="onUpdate" />
  </div>
</template>

<style scoped>
</style>
