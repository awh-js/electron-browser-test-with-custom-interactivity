import { ref } from 'vue';
import type { Ref } from 'vue';

const { electronApi } = window;

const activeSessionId = ref('');

export const useSessions = () => {
  const sessions = ref<string[]>([]);

  sessions.value = electronApi.sendSync('getAccountsSessions');

  const setActiveSession = (id = activeSessionId.value) => {
    activeSessionId.value = id;
    electronApi.sendSync('setActiveSession', id);
  };

  if (!activeSessionId.value) {
    // ensure that at least one session is always active
    activeSessionId.value = sessions.value[0];
    setActiveSession();
  }

  return {
    sessions,
    activeSessionId,
    setActiveSession,
  };
};
