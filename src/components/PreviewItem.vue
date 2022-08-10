<script setup lang="ts">
import {PropType} from "vue";
import {InsertLinkSharp} from "@vicons/material";
import {MarkerModel} from "../models/marker.model";

const props = defineProps({
  item: {type: Object as PropType<MarkerModel | null>, required: true}
})

</script>

<template>
  <Transition>
    <n-card :title="props.item?.label" v-if="props.item" hoverable class="mb-4">
      <template #cover class="w-full">
        <n-image
            :src="props.item?.imgUrl ?? 'https://via.placeholder.com/1000x200'"
            width="100%"
        />
      </template>

<!--      <p>Beschrijving hier...</p>-->


      <template #action>
        <!--      &#169; Copyright 2018 <br/>-->

        <a href="#" class="italic hover:text-primary">
          <Icon size="20" class="relative top-[0.3rem]">
            <InsertLinkSharp/>
          </Icon>
          Oorspronkelijke bron</a>
      </template>
    </n-card>
  </Transition>

</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

</style>
