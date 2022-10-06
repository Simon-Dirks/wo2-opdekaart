<script setup lang="ts">
import { GlobalThemeOverrides } from "naive-ui";

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: "#D72F19",
    primaryColorHover: "#A42312",
    primaryColorPressed: "#D72F19",
  },
};
</script>

<template>
  <IconConfigProvider>
    <n-config-provider :theme-overrides="themeOverrides" class="h-full">
      <n-loading-bar-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-dialog-provider>
              <router-view />
            </n-dialog-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </n-config-provider>
  </IconConfigProvider>
</template>

<style scoped></style>