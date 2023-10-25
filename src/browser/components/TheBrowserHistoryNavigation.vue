<script setup lang="ts">
import { useTabs } from '@/browser/composables/useTabs';

const { canGoBack, canGoForward, goBack, goForward } = useTabs();
</script>
<template>
  <div class="history">
    <div class="control" :class="{ inactive: !canGoBack }" @click="goBack">
      <v-icon name="la-angle-left-solid"/>
    </div>
    <div class="control" :class="{ inactive: !canGoForward }" @click="goForward">
      <v-icon name="la-angle-right-solid"/>
    </div>
  </div>
</template>
<style scoped lang="less">
@import url("@/browser/styles/history-and-add-new-tab.less");
</style>
