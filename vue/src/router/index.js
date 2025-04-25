import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';
// 导入页面组件
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
const routes = [
  {
    path: '/',          // 访问路径
    name: 'Home',       // 路由名称（可选）
    component: Home     // 对应的 Vue 组件
  },
  {
    path: '/book/:id',
    name: 'BookDetail',
    component: () => import('@/views/BookDetail.vue')
  },
  {
    path: '/book/:id/read/:chapter',
    name: 'BookReader',
    component: () => import('@/views/BookReader.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    // component:  () => import('@/views/Profile.vue'),
    component:Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// // 路由守卫
// router.beforeEach((to, from, next) => {
//   if (to.meta.requiresAuth && !store.state.isAuthenticated) {
//     next('/')
//   } else {
//     next()
//   }
// })
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (!store.getters.isAuthenticated) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });
// 合并路由守卫逻辑
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    if (!store.getters.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router