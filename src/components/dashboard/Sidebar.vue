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

    <div class="p-3" :class="{ 'lg:hidden': !open }">
      <slot>the side bar</slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import Button from '../ui/Button.vue'

const emits = defineEmits(['closeSidebar'])

defineProps<{
  open: boolean
}>()
</script>
