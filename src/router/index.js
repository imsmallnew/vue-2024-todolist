import { createRouter, createWebHashHistory  } from 'vue-router'
import LoginPage from '../views/LoginPageView.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory (import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/SignUpPage',
      name: 'signUp',
      props: true,
      component: () => import('../views/SignUpPageView.vue')
    },
    {
      path: '/TodoList',
      name: 'todoList',
      component: () => import('../views/TodoListView.vue'),
    },
    // will match everything and put it under `route.params.pathMatch`
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

export default router
