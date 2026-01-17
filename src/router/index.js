import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue')
  },
  { 
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { hideFooter: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { hideFooter: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue')
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('@/views/TransactionsView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue')
  },
  {
    path: '/add-transaction',
    name: 'add-transaction',
    component: () => import('@/views/AddTransactionView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
