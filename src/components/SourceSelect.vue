<script setup lang="ts">
import {SourceModel} from "../models/source.model";

const sources: SourceModel[] = [
  {"id": "ID", "label": "Source #1"},
  {"id": "ID2", "label": "Source #2"},
  {"id": "ID3", "label": "Source #3"},
  {"id": "ID4", "label": "Source #4"}];
</script>

<template>


  <div class="">
    <n-card>
      <n-collapse>
        <n-collapse-item title="Bronnen" class="pr-4">
          <div v-for="source in sources">
            <n-checkbox :id="source.id">
              {{ source.label }}
            </n-checkbox>
          </div>
        </n-collapse-item>
      </n-collapse>  </n-card>
  </div>
</template>

<style scoped>
</style>
