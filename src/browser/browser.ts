import { createApp } from 'vue'
import App from './App.vue';
import './style.less';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import {
  LaAngleLeftSolid,
  LaAngleRightSolid,
  MdCloseSharp,
  IoRefreshOutline,
  IoAdd,
} from 'oh-vue-icons/icons';

const app = createApp({ ...App, name: 'browser' });

addIcons(
  LaAngleLeftSolid,
  LaAngleRightSolid,
  MdCloseSharp,
  IoRefreshOutline,
  IoAdd,
);
app.component('v-icon', OhVueIcon);

app.mount('#main');
