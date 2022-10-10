<script setup lang="ts">
import { SourceModel } from "../models/source.model";
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { InformationCircle } from "@vicons/ionicons5";
import { MapService } from "../services/map.service";

const store = useStore();

const selectedSourceIds: Ref<Set<string>> = ref(new Set([]));

const sources: ComputedRef<SourceModel[]> = computed(
  () => store.getters["getSources"]
);

const isLoading: Ref<boolean> = ref(false);

watch(
  () => store.getters["getSources"],
  (newSources: SourceModel[]) => {
    selectedSourceIds.value = new Set(newSources.map((source) => source.id));
    store.commit("setShownSourceIds", selectedSourceIds);
  }
);

onMounted(() => {});

watch(
  () => store.getters["getShownSourceIds"].keys(),
  () => {
    console.log("Updated selected source ID");
    isLoading.value = true;

    // TODO: Only start (blocking) update call after loading spinner is shown in the DOM...
    setTimeout(() => {
      new MapService().updateFilter().finally(() => {
        isLoading.value = false;
      });
    }, 10);
  }
);

const onSelectAllSources = () => {
  const allSourceIds: Set<string> = new Set(
    store.getters["getSources"].map((source: SourceModel) => source.id)
  );
  store.commit("setShownSourceIds", allSourceIds);
};

const onDeselectAllSources = () => {
  store.commit("setShownSourceIds", new Set([]));
};

const onSourceSelect = async (sourceId: string, isSelected: boolean) => {
  if (isSelected) {
    selectedSourceIds.value.add(sourceId);
  } else {
    selectedSourceIds.value.delete(sourceId);
  }

  store.commit("setShownSourceIds", selectedSourceIds);
};
</script>

<template>
  <div class="">
    <n-card
      class="bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)] transition-colors duration-500"
    >
      <n-collapse>
        <n-collapse-item title="Bronnen" class="pr-4">
          <p v-if="isLoading">
            <n-spin size="small"></n-spin>
            <span class="relative ml-3 bottom-2 italic">Laden...</span>
          </p>

          <n-button primary class="rounded-lg mr-2" @click="onSelectAllSources"
            >Selecteer alles
          </n-button>
          <n-button primary class="rounded-lg" @click="onDeselectAllSources"
            >Deselecteer alles
          </n-button>
          <div v-for="source in sources">
            <n-checkbox
              :id="source.id"
              :checked="selectedSourceIds.has(source.id)"
              @update:checked="onSourceSelect(source.id, $event)"
              :disabled="isLoading"
            >
              {{ source.label }}
            </n-checkbox>

            <n-tooltip trigger="hover">
              <template #trigger>
                <Icon
                  size="20"
                  class="relative top-[0.3rem] cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <InformationCircle />
                </Icon>
              </template>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              <br />
              Ab asperiores assumenda, blanditiis, consequuntur corporis
              doloremque dolores explicabo fuga in.
            </n-tooltip>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style scoped></style>
