<script setup lang="ts">
import {SourceModel} from "../models/source.model";
import {onMounted, Ref, ref} from "vue";
import {useStore} from "vuex";
import {MapService} from "../services/map.service";
import {useLoadingBar} from "naive-ui";

const sources: SourceModel[] = [
  {"id": "https://hetutrechtsarchief.nl/id/Inkwartiering", "label": "Inkwartiering"},
  {"id": "ID2", "label": "Source #2"}
]

const store = useStore();

const selectedSourceIds: Ref<Set<string>> = ref(new Set(["https://hetutrechtsarchief.nl/id/Inkwartiering"]));

onMounted(() => {
  store.commit("setShownSourceIds", selectedSourceIds);
});

const onSourceSelect = async (sourceId: string, isSelected: boolean) => {
  if (isSelected) {
    selectedSourceIds.value.add(sourceId);
  } else {
    selectedSourceIds.value.delete(sourceId);
  }

  store.commit("setShownSourceIds", selectedSourceIds);

  // TODO: Add loading bar
  await new MapService().updateFilter();
}
</script>

<template>
  <div class="">
    <n-card>
      <n-collapse>
        <n-collapse-item title="Bronnen" class="pr-4">
          <div v-for="source in sources">
            <n-checkbox :id="source.id" :checked="selectedSourceIds.has(source.id)"
                        @update:checked="onSourceSelect(source.id, $event)">
              {{ source.label }}
            </n-checkbox>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style scoped>
</style>
