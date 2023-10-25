import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import type TabInfo from '@/types/TabInfo';

const { electronApi } = window;

const tabs = ref<TabInfo[]>([]);

electronApi.on('tabsChanged', (event, id, tabsInfo) => {
  tabs.value = tabsInfo;
});

export const useTabs = () => {
  const focusedTab = computed(() => tabs.value.find((tab) => tab.focused));
  const canGoForward = computed(() => !!focusedTab.value?.canGoForward);
  const canGoBack = computed(() => !!focusedTab.value?.canGoBack);

  const openNewTab = () => {
    const tabsInfo = electronApi.sendSync('openNewTab');
    tabs.value = tabsInfo;
  };

  const closeTab = (index: number) => {
    const tabsInfo = electronApi.sendSync('closeTab', index);
    tabs.value = tabsInfo;
  };

  const focusTab = (index: number) => {
    const tabsInfo = electronApi.sendSync('focusTab', index);
    tabs.value = tabsInfo;
  };

  const goBack = () => {
    const tabsInfo = electronApi.sendSync('goBack');
    tabs.value = tabsInfo;
  };

  const goForward = () => {
    const tabsInfo = electronApi.sendSync('goForward');
    tabs.value = tabsInfo;
  };

  const reloadTab = () => {
    const tabsInfo = electronApi.sendSync('reloadTab');
    tabs.value = tabsInfo;
  };

  const rearrangeTabs = (oldIndex: number, newIndex: number) => {
    const tabsInfo = electronApi.sendSync('rearrangeTags', oldIndex, newIndex);
    tabs.value = tabsInfo;
  };

  return {
    tabs,
    focusedTab,

    canGoBack,
    canGoForward,

    goBack,
    goForward,

    reloadTab,
    rearrangeTabs,

    openNewTab,
    closeTab,
    focusTab,
  };
};
