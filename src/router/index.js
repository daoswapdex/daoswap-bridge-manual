import Vue from "vue";
import VueRouter from "vue-router";
import ApplyCrossChain from "../views/token-cross-chain/ApplyCrossChain.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/home/Index.vue"),
    children: [
      {
        path: "",
        name: "Home",
        redirect: "/cross-chain",
        component: () => import("@/views/home/Index.vue")
      },
      {
        path: "/cross-chain",
        name: "CrossChain",
        redirect: "/cross-chain/apply",
        component: () => import("@/layouts/home/ViewBlank.vue"),
        children: [
          {
            path: "/cross-chain/apply",
            name: "ApplyCrossChain",
            component: ApplyCrossChain
          }
        ]
      },
      {
        path: "/404",
        component: () => import("@/views/404.vue")
      },
      {
        path: "*",
        redirect: "/404"
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash };
    if (savedPosition) return savedPosition;

    return { x: 0, y: 0 };
  },
  routes
});

export default router;
