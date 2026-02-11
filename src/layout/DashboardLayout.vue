<template>
  <div class="relative flex h-screen w-full">
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <Sidebar :open="isSidebarOpen" @close-sidebar="() => (isSidebarOpen = false)" />

    <div id="dashboard-content" class="flex min-h-0 flex-1 flex-col">
      <header
        class="relative z-30 flex h-12 items-center justify-between px-4 drop-shadow-sm bg-white dark:bg-slate-900"
      >
        <div class="flex items-center gap-2">
          <Button variant="link" @click="toggleSidebar">
            <Bars3Icon class="size-6" />
          </Button>
        </div>
        <div class="flex items-center gap-3">
          <ThemeModeSwitcher />
          <Button v-show="authStore.token" variant="link" @click="logout">Logout</Button>
        </div>
      </header>

      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/lib/axios'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import ThemeModeSwitcher from '@/components/shared/ThemeModeSwitcher.vue'

const router = useRouter()
const authStore = useAuthStore()
const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

let lgMediaQuery: MediaQueryList | null = null

const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
  if (!event.matches) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  lgMediaQuery = window.matchMedia('(min-width: 1024px)')
  handleViewportChange(lgMediaQuery)
  lgMediaQuery.addEventListener('change', handleViewportChange)
})

onBeforeUnmount(() => {
  lgMediaQuery?.removeEventListener('change', handleViewportChange)
})

const logout = async () => {
  try {
    await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
  } catch {
    // Always clear local auth state even if backend logout request fails.
  } finally {
    authStore.clearToken()
    router.push({ name: 'home' })
  }
}
</script>
