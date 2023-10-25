<script setup lang="ts">
import { useSessions } from '@/browser/composables/useSessions';

const {
  sessions,
  activeSessionId,
  setActiveSession,
} = useSessions();
</script>
<template>
  <div class="sessions">
    <div v-for="sessionId in sessions" class="control"
      :class="{ active: sessionId === activeSessionId }"
      @click="setActiveSession(sessionId)">
      {{ sessionId }}
    </div>
  </div>
</template>
<style scoped lang="less">
.sessions {
  display: flex;
  margin: 0 10px;
  gap: 5px;
  justify-content: center;
}

.control {
  font-size: 20px;
  text-align: center;
  width: 40px;
  height: 40px;
  line-height: 40px;
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
  &.active {
    color: #b52a82;
  }
  &:hover {
    background-color: #ebebeb;
  }
}
</style>
