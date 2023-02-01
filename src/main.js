import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import ElementUI from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import router from "./router/index.js";
createApp(App).use(router).use(ElementUI).mount("#app");
