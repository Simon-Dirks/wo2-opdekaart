<script setup lang="ts">
import {MapService} from "../services/map.service";
import {Ref, ref} from 'vue'

const mapService: MapService = new MapService();
const search: Ref<string> = ref('');

const onUpdate = (search: string) => {
  mapService.updateFilter(search);
}
</script>

<template>
  <div class="drop-shadow">
    <n-input size="large" round placeholder="Zoeken..." v-model.trim="search" @change="onUpdate"/>
  </div>
</template>

<style scoped>
</style>
