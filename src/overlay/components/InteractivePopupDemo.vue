<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const userName = ref('');

const userInteractionEvents = [
  {
    target: document.body,
    events: ['mousemove'],
  },

  {
    target: window,
    events: ['scroll'],
  },
];

const interactivityHandler = (event: Event) => {
  const { target } = event;
  let name = '';

  if (target instanceof HTMLAnchorElement) {
    const text = target.innerText.trim();
    if (text.startsWith('@')) {
      name = text;
    }
  }

  userName.value = name;
};

for (const { target, events } of userInteractionEvents) {
  for (const eventName of events) {
    target.addEventListener(eventName, interactivityHandler);
  }
}
</script>
<template>
  <div class="demo" v-if="userName">
    <img src="/vite.svg" class="logo" alt="Vite logo" />
    <div>
      Will fetch and show some extra data for
      <span class="name">{{ userName }}</span>
    </div>
  </div>
</template>
<style scoped>
  .demo {
    pointer-events: auto;
    margin: 16px;
    font-size: 20px;
    width: 300px;
    backdrop-filter: blur(10px);
    padding: 20px;
    border-radius: 15px;
    background-color: rgba(255,255,255,0.7);
    border: 1px solid rgba(0,0,0,0.1);
    display: flex;
    gap: 20px;
  }

  .name {
    color: #00aff0;
    font-weight: 500;
  }
</style>
