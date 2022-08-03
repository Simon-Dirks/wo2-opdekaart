<script setup lang="ts">
import {onMounted} from "vue";
import {MapboxMap} from "vue-mapbox-ts";

const mapboxToken = 'pk.eyJ1Ijoic2ltb25kaXJrcyIsImEiOiJjazdkazBxeXYweDluM2RtcmVkZzVsMGFoIn0.6fDvUqYNALXv5wJtZjjxrQ';

onMounted(() => {
})
</script>

<template>
  <div class="h-screen w-screen">
    <mapbox-map :accessToken="mapboxToken" mapStyle="mapbox://styles/simondirks/cl2oh45ns002r14o1l9bmlay3"/>
  </div>
</template>

<style scoped>
</style>
