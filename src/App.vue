<script setup lang="ts">
import Map from "./components/Map.vue";
import {GlobalThemeOverrides} from 'naive-ui'


const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#D72F19',
    baseColor: '#D72F19',
    // borderColor: '#D72F19',
    // primaryColorPressed: '#D72F19',
    primaryColorHover: 'rgb(215,47,25, 0.1)'
  }
}

</script>

<template>
  <IconConfigProvider>
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <n-config-provider :theme-overrides="themeOverrides" class="h-full">
              <router-view/>
            </n-config-provider>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </IconConfigProvider>

</template>

<style scoped>
</style>
