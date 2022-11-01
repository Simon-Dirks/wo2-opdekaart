<script setup lang="ts">
import { SourceModel } from "../models/source.model";
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import { useStore } from "vuex";
import { InformationCircle } from "@vicons/ionicons5";
import { MapService } from "../services/map.service";

const store = useStore();

const selectedSourceIds: Ref<Set<string>> = ref(new Set([]));
// const selectedSources: Ref<Set<SourceModel>> = ref(new Set([]));

const sources: ComputedRef<SourceModel[]> = computed(
  () => store.getters["getSources"]
);

watch(
  () => store.getters["getSources"],
  (newSources: SourceModel[]) => {
    selectedSourceIds.value = new Set(
      newSources.map((source) => source.sourceId)
    );
    // selectedSources.value = new Set(newSources.map((source) => source));
    store.commit("setShownSourceIds", selectedSourceIds);
    // store.commit("setShownSources", selectedSources);
  }
);

onMounted(() => {});

watch(
  () => store.getters["getShownSourceIds"].keys(),
  () => {
    console.log(
      "Updated selected source ID",
      store.getters["getShownSourceIds"]
    );
  }
);

const onSelectAllSources = () => {
  const allSourceIds: Set<string> = new Set(
    store.getters["getSources"].map((source: SourceModel) => source.sourceId)
  );
  // const allSources: Set<SourceModel> = new Set(
  //   store.getters["getSources"].map((source: SourceModel) => source)
  // );
  store.commit("setShownSourceIds", allSourceIds);
  // store.commit("setShownSources", allSources);
};

const onDeselectAllSources = () => {
  store.commit("setShownSourceIds", new Set([]));
  // store.commit("setShownSources", new Set([]));
};

const onSourceSelect = async (sourceId: string, isSelected: boolean) => {
  console.log(
    "onSourceSelect",
    sourceId,
    isSelected
    // store.getters["getSources"][sourceId]
  );
  if (isSelected) {
    selectedSourceIds.value.add(sourceId);
    // selectedSources.value.add(store.getters["getSources"][sourceId]);
  } else {
    selectedSourceIds.value.delete(sourceId);
    // selectedSources.value.delete(store.getters["getSources"][sourceId]);
  }
  // console.log("onSourceSelect", selectedSources);

  store.commit("setShownSourceIds", selectedSourceIds);
  // store.commit("setShownSources", selectedSources);
};
</script>

<template>
  <div class="">
    <n-card
      class="bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)] transition-colors duration-500"
    >
      <n-collapse>
        <n-collapse-item title="Bronnen" class="pr-4">
          <n-button primary class="rounded-lg mr-2" @click="onSelectAllSources"
            >Selecteer alles
          </n-button>
          <n-button primary class="rounded-lg" @click="onDeselectAllSources"
            >Deselecteer alles
          </n-button>
          <div v-for="source in sources">
            <n-checkbox
              :id="source.sourceId"
              :checked="selectedSourceIds.has(source.sourceId)"
              @update:checked="onSourceSelect(source.sourceId, $event)"
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
              <p v-if="source.description" v-text="source.description"></p>
              <p v-else>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                <br />
                Ab asperiores assumenda, blanditiis, consequuntur corporis
                doloremque dolores explicabo fuga in.
              </p>
            </n-tooltip>
          </div>
        </n-collapse-item>
      </n-collapse>
    </n-card>
  </div>
</template>

<style scoped></style>
