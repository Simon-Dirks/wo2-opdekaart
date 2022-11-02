<script setup lang="ts">
import { useStore } from "vuex";
import { InformationCircle } from "@vicons/ionicons5";
import { computed, ComputedRef, ref, Ref, watch } from "vue";
import { SourceModel } from "../models/source.model";
import { SearchOptionModel } from "../models/search-option.model";

const store = useStore();
const searchOption: Ref<SearchOptionModel> = ref(SearchOptionModel.All);

const searchOptions = [
  {
    value: SearchOptionModel.All,
    label: "Alles",
  },
  {
    value: SearchOptionModel.People,
    label: "Personen",
  },
  {
    value: SearchOptionModel.Addresses,
    label: "Adressen",
  },
];

watch(searchOption, (currentOption, prevOption) => {
  console.log(
    SearchOptionModel[prevOption],
    "->",
    SearchOptionModel[currentOption]
  );
  store.commit("setSearchOption", currentOption);
});

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

watch(
  () => store.getters["getSources"],
  (sources: SourceModel[]) => {
    onToggleAllSources();
  }
);
</script>

<template>
  <n-collapse class="text-white">
    <n-collapse-item title="Zoekopties" class="pr-4">
      <p class="text-white mt-2">Zoek naar:</p>
      <n-radio-group
        v-model:value="searchOption"
        name="radiogroup"
        class="bg-transparent px-4 py-2 rounded-lg transition-colors duration-500"
      >
        <n-space>
          <n-radio
            v-for="option in searchOptions"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          />
        </n-space>
      </n-radio-group>

      <p class="text-white mt-2">Bronnen:</p>

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
              class="relative top-[0.3rem] cursor-pointer text-[#e3e3e3] hover:text-white transition-colors duration-300"
            >
              <InformationCircle />
            </Icon>
          </template>
          <p
            v-if="source.description"
            v-text="source.description"
            class="text-white"
          ></p>
          <p v-else>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            <br />
            Ab asperiores assumenda, blanditiis, consequuntur corporis
            doloremque dolores explicabo fuga in.
          </p>
        </n-tooltip>
      </div>

      <button
        class="rounded-3xl px-4 py-1 bg-white hover:bg-black hover:text-white transition-colors duration-500 mt-4"
        @click="onToggleAllSources"
      >
        {{ allSourcesAreSelected ? "Deselecteer" : "Selecteer" }} alles
      </button>
    </n-collapse-item>
  </n-collapse>
</template>

<style>
.n-collapse
  .n-collapse-item
  .n-collapse-item__content-wrapper
  .n-collapse-item__content-inner {
  padding: 0;
}

.n-radio-group {
  padding: 0;
}
</style>