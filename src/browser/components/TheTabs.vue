<script setup lang="ts">
import { ref } from 'vue';
import { useTabs } from '@/browser/composables/useTabs';
import draggable from 'vuedraggable';

const { tabs, closeTab, focusTab, reloadTab, rearrangeTabs } = useTabs();

const onDragEnd = (event: any) => {
  const { oldDraggableIndex, newDraggableIndex } = event;
  rearrangeTabs(oldDraggableIndex, newDraggableIndex);
}
</script>
<template>
  <draggable
    class="tabs"
    v-model="tabs"
    item-key="index"
    @end="onDragEnd">
    <template #item="{ element: tab, index }">
      <span class="tab" :class="{focused: tab.focused}"  @click="focusTab(index)">
        <div class="control-close" @click.stop="closeTab(index)">
          <v-icon scale="0.7" name="md-close-sharp"/>
        </div>

        <span class="title">{{ tab.title }}</span>

        <div class="control-reload" @click.stop="reloadTab()">
          <v-icon scale="0.7" name="io-refresh-outline"/>
        </div>
      </span>
    </template>
  </draggable>
</template>
<style scoped lang="less">
.tabs {
  overflow-x: auto;
  height: 100%;
  white-space:nowrap;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;

  &::-webkit-scrollbar {
    display: none;
  }

  .tab {
    display: flex;
    gap: 3px;
    align-items: center;
    background-color: #fff;

    text-align: center;

    height: 25px;
    padding: 5px;
    font-size: 15px;

    min-width: 175px;
    max-width: 175px;

    border: 1px solid #ebebeb;
    border-radius: 5px;

    user-select: none;

    .control-close, .control-reload {
      border-radius: 5px;
      display: flex;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      transition: all 100ms ease-in;

      .ov-icon {
        opacity: 0.7;
      }
    }

    .control-reload {
      opacity: 0;
    }

    &:hover {
      border: 1px solid #dcdcdc;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

      .control-close, .control-reload {
        opacity: 1;
        .ov-icon {
          opacity: 1;
        }
      }
    }

    &.focused {
      border: 1px solid #a12573;
      &:hover {
        border-color: #e30b93;
      }

      .title {
        color: #b52a82;
      }
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      width: calc(100% + 60px);
      flex-grow: 1;
    }

    .control-close, .control-reload {
      &:hover {
        background-color: #ebebeb;
      }
    }
  }
}
</style>
