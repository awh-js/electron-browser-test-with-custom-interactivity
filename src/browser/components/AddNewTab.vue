<script setup lang="ts">
import { useTabs } from '@/browser/composables/useTabs';
const { openNewTab } = useTabs();
</script>
<template>
  <div class="add-new-tab">
    <div class="control" @click="openNewTab">
      <v-icon name="io-add"/>
    </div>
  </div>
</template>
<style>
@import url("@/browser/styles/history-and-add-new-tab.less");

.add-new-tab {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 40px;
    top: -5px;
    left: -22px;
    pointer-events: none;

    background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,255,255,1));
  }
}
</style>
