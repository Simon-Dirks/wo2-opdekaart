<script setup lang="ts">
import { useStore } from "vuex";
import { InformationCircle } from "@vicons/ionicons5";
import { computed, ComputedRef } from "vue";
import { SourceModel } from "../models/source.model";

const store = useStore();

const sources: ComputedRef<SourceModel[]> = computed(
  () => store.getters["getSources"]
);
const shownSourceIds: ComputedRef<Set<string>> = computed(
  () => store.getters["getShownSourceIds"]
);

const allSourcesAreSelected: ComputedRef<boolean> = computed(() => {
  return shownSourceIds.value.size === sources.value.length;
});

const onToggleAllSources = () => {
  let sourceIds: string[] = [];
  if (!allSourcesAreSelected.value) {
    sourceIds = sources.value.map((source) => source.sourceId);
  }
  store.commit("setShownSourceIds", new Set(sourceIds));
};

const onSourceToggled = (sourceId: string) => {
  const currentShownSourceIds = shownSourceIds.value;
  if (currentShownSourceIds.has(sourceId)) {
    currentShownSourceIds.delete(sourceId);
  } else {
    currentShownSourceIds.add(sourceId);
  }
  store.commit("setShownSourceIds", currentShownSourceIds);
};
</script>

<template>
  <div class="">
    <n-card
      class="bg-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.95)] transition-colors duration-500"
    >
      <n-collapse>
        <n-collapse-item title="Bronnen" class="pr-4">
          <n-button primary class="rounded-lg mr-2" @click="onToggleAllSources"
            >{{ allSourcesAreSelected ? "Deselecteer" : "Selecteer" }} alles
          </n-button>

          <div v-for="source in sources">
            <n-checkbox
              :id="source.sourceId"
              @click="onSourceToggled(source.sourceId)"
              :checked="shownSourceIds.has(source.sourceId)"
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