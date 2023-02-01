import { createRouter, createWebHistory } from "vue-router";
import upload from "../components/upload.vue";
import Home from "../components/HelloWorld.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/Home",
    name: "Home",
    component: Home,
  },
  {
    path: "/upload",
    name: "upload",
    component: upload,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
