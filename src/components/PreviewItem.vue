<script setup lang="ts">
import {PreviewItemModel} from "../models/preview-item.model";
import {PropType} from "vue";
import {InsertLinkSharp} from "@vicons/material";

const props = defineProps({
  item: {type: Object as PropType<PreviewItemModel | null>, required: true}
})

</script>

<template>
  <Transition>
    <n-card :title="props.item?.label" v-if="props.item" hoverable>
      <template #cover class="w-full">
        <n-image
            :src="props.item?.img.url"
            width="100%"
            fallback-src="https://via.placeholder.com/200x200"
        />
      </template>

      <p>Beschrijving hier...</p>


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
