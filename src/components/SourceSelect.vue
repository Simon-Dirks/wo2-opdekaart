<script setup lang="ts">
import {SourceModel} from "../models/source.model";

const sources: SourceModel[] = [
  {"id": "ID", "label": "Source #1"},
  {"id": "ID2", "label": "Source #2"},
  {"id": "ID3", "label": "Source #3"},
  {"id": "ID4", "label": "Source #4"}];
</script>

<template>
  <div class="bg-white rounded px-4 py-2 drop-shadow">
    <div v-for="source in sources">
      <input type="checkbox" :name="source.id" :id="source.id">
      <label :for="source.id" class="pl-2">{{ source.label }}</label>
    </div>
  </div>
</template>

<style scoped>
</style>
