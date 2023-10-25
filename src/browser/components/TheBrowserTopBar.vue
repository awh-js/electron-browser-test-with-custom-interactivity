<script setup lang="ts">
import TheBrowserHistoryNavigation from './TheBrowserHistoryNavigation.vue';
import TheTabs from './TheTabs.vue';
import AddNewTab from './AddNewTab.vue';

</script>
<template>
  <div class="browser-top-bar">
    <TheBrowserHistoryNavigation/>
    <TheTabs/>
    <AddNewTab/>
  </div>
</template>
<style scoped lang="less">
.browser-top-bar {
  height: 60px;
  padding: 0 10px 0 12px;
  border-bottom: 1px solid rgba(0,0,0,0.1);

  display: grid;
  gap: 5px;
  grid-template-columns: 65px auto 30px;
  align-items: center;
  justify-items: center;
}
</style>
