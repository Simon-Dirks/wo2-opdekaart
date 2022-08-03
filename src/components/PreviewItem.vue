<script setup lang="ts">
import {PreviewItemModel} from "../models/preview-item.model";
import {PropType} from "vue";

const props = defineProps({
  item: {type: Object as PropType<PreviewItemModel>, required: true}
})

</script>

<template>
  <div class="bg-white rounded-md text-black p-2 mb-2 drop-shadow" v-if="props.item?.img">
    <img :src="props.item.img.url" :alt="props.item.img.alt"/>
    <p>{{ props.item.label }}</p>
  </div>
</template>

<style scoped>
</style>
