<template>
  <aside
    :class="
      cn(
        'z-40 flex h-full flex-col justify-between bg-white transition-all duration-200 dark:bg-slate-900 border-r border-slate-200',
        'fixed inset-y-0 left-0 w-56 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        open ? 'lg:w-56' : 'lg:w-16',
      )
    "
  >
    <div class="flex flex-col">
      <div class="flex h-12 items-center justify-between px-3">
        <p v-if="open" class="font-semibold">IPman</p>
        <span v-else class="hidden font-semibold lg:block w-full text-center"><p>IP</p></span>

        <Button variant="link" class="lg:hidden" @click="$emit('closeSidebar')">
          <XMarkIcon class="size-6" />
        </Button>
      </div>

      <nav class="flex flex-col gap-1 p-2">
        <RouterLink
          v-for="item in roleNavItem"
          :key="item.name"
          :to="{ name: item.name }"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <a
            :href="href"
            @click="
              (event) => {
                navigate(event)
                handleNavClick()
              }
            "
            :class="
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                open ? 'justify-start lg:justify-start' : 'justify-start lg:justify-center',
              )
            "
          >
            <component :is="item.icon" class="size-5 shrink-0" />
            <span :class="cn(!open && 'lg:hidden')">{{ item.label }}</span>
          </a>
        </RouterLink>
      </nav>
    </div>

    <div class="h-12 flex items-center">
      <div
        class="flex w-full items-center gap-3 px-3 py-2 text-sm text-slate-700 transition-colors dark:text-slate-200"
      >
        <UserCircleIcon class="size-7 shrink-0" />
        <span :class="cn(!open && 'lg:hidden')">{{ authStore.user?.name }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { UserCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'

import { RouterLink } from 'vue-router'
import Button from '../ui/Button.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { Role } from '@/types/Enums/Role'
import { navs } from '@/lib/navItem'

const emit = defineEmits(['closeSidebar'])
const authStore = useAuthStore()

defineProps<{
  open: boolean
}>()

const roleNavItem = computed(() => {
  if (authStore.userRole !== Role.Admin) {
    return navs.filter((nav) => nav.name !== 'audit-logs')
  }
  return navs
})

const handleNavClick = () => {
  if (window.matchMedia('(max-width: 1023px)').matches) {
    emit('closeSidebar')
  }
}
</script>
