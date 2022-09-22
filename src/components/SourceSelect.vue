<script setup lang="ts">
import {SourceModel} from "../models/source.model";
import {computed, ComputedRef, onMounted, Ref, ref, watch} from "vue";
import {useStore} from "vuex";
import {MapService} from "../services/map.service";

const store = useStore();

const selectedSourceIds: Ref<Set<string>> = ref(new Set([]));

const sources: ComputedRef<SourceModel[]> = computed(() => store.getters["getSources"]);
watch(() => store.getters["getSources"], (newSources: SourceModel[]) => {
  selectedSourceIds.value = new Set(newSources.map((source) => source.id));
  store.commit("setShownSourceIds", selectedSourceIds);
});

onMounted(() => {

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
