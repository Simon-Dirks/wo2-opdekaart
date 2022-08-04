<script setup lang="ts">
import Map from "./components/Map.vue";
import {GlobalThemeOverrides, lightTheme} from 'naive-ui'


const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#D72F19',
    // baseColor: '#D72F19',
    // borderColor: '#D72F19',
    primaryColorPressed: 'red',
    primaryColorHover: 'rgb(215,47,25, 0.1)'
  }
}

</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" class="h-full">
    <Map></Map>
  </n-config-provider>
</template>

<style scoped>
</style>
