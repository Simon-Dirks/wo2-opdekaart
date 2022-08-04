<script setup lang="ts">
import {PreviewItemModel} from "../models/preview-item.model";
import {PropType} from "vue";

const props = defineProps({
  item: {type: Object as PropType<PreviewItemModel | null>, required: true}
})

</script>

<template>
  <n-card :title="props.item?.label" v-if="props.item">
    <template #cover class="w-full">
      <n-image
          :src="props.item?.img.url"
          width="100%"
          fallback-src="https://via.placeholder.com/200x200"
      />
    </template>

    <p>Beschrijving hier...</p>


    <template #action>
      &#169; Copyright
    </template>
  </n-card>
</template>

<style scoped>
</style>
