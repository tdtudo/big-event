import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', component:() => import('@/views/login/LoginPage.vue')}, //登录页
    {
      path: '/',
      component:() => import('@/views/layout/LayoutContainer.vue'),
      redirect:'/article/manage',
      children:[
        {path:'/article/channel', component:() => import('@/views/article/ArticleChannel.vue')},
        {path:'/article/manage', component:() => import('@/views/article/ArticleManage.vue')},
        {path:'/user/avatar', component:() => import('@/views/user/UserAvatar.vue')},
        {path:'/user/password', component:() => import('@/views/user/UserPassword.vue')},
        {path:'/user/profile', component:() => import('@/views/user/UserProfile.vue')}      ]
    }
  ],
})

router.beforeEach((to, from) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login'){
    return '/login'
  }
  return true
})

export default router