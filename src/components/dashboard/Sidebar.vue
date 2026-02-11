<template>
  <aside
    :class="
      cn(
        'z-40 flex h-full flex-col bg-white transition-all duration-200 dark:bg-slate-900 border-r border-slate-200',
        'fixed inset-y-0 left-0 w-56 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        open ? 'lg:w-56' : 'lg:w-16',
      )
    "
  >
    <div class="flex h-12 items-center justify-between px-3">
      <p v-if="open" class="font-semibold">IPman</p>
      <span v-else class="hidden font-semibold lg:block w-full text-center"><p>IP</p></span>

      <Button variant="link" class="lg:hidden" @click="$emit('closeSidebar')">
        <XMarkIcon class="size-6" />
      </Button>
    </div>

    <nav class="flex flex-col gap-1 p-2">
      <RouterLink
        v-for="item in navItems"
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
  </aside>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import {
  XMarkIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
} from '@heroicons/vue/24/solid'
import { RouterLink } from 'vue-router'
import Button from '../ui/Button.vue'

const emit = defineEmits(['closeSidebar'])

defineProps<{
  open: boolean
}>()

const navItems = [
  { name: 'dashboard', label: 'Dashboard', icon: Squares2X2Icon },
  { name: 'audit-logs', label: 'Audit Logs', icon: ClipboardDocumentListIcon },
  { name: 'ip-addresses', label: 'IP Addresses', icon: DocumentDuplicateIcon },
]

const handleNavClick = () => {
  if (window.matchMedia('(max-width: 1023px)').matches) {
    emit('closeSidebar')
  }
}
</script>
