import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
import { Role } from '@/types/Enums/Role'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/BaseLayout.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'home' },
        },
        {
          path: 'home',
          name: 'home',
          component: () => import('../views/HomeView.vue'),
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../views/auth/RegisterView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          component: () => import('../views/auth/ForgotPasswordView.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('../views/auth/ResetPasswordView.vue'),
          meta: { guestOnly: true },
        },
      ],
    },
    {
      path: '/',
      component: () => import('../layout/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardHomeView.vue'),
        },
        {
          path: 'dashboard/audit-logs',
          name: 'audit-logs',
          component: () => import('../views/dashboard/DashboardAuditLogsView.vue'),
          meta: { roles: [Role.Admin] },
        },
        {
          path: 'dashboard/ip-addresses',
          name: 'ip-addresses',
          component: () => import('../views/dashboard/DashboardIpsView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home',
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)

  if (authStore.token && !authStore.isTokenValid && !authStore.canRefresh) {
    authStore.clearToken()
  }

  const loggedIn = authStore.isAuthenticated

  if (to.meta.requiresAuth && !loggedIn) {
    // this makes the redirect back after logging in
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // if user is already logged in and wants to access guest-only routes
  // they are redirected to dashboard. (except home route)
  if (to.meta.guestOnly && loggedIn) {
    return { name: 'dashboard' }
  }

  // 1. get the roles from declared routes
  // 2. get the current role of the logged in user
  // 3. check if the current role is in allowed roles
  // 4. push back to dashboard if not
  const allowedRoles = to.meta.roles as Role[] | undefined

  const currentRole = authStore.userRole

  if (allowedRoles?.length && (!currentRole || !allowedRoles.includes(currentRole))) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
