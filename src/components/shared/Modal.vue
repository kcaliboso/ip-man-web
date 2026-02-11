<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click="handleOverlayClick"
    >
      <div
        class="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
        @click.stop
      >
        <div
          class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700"
        >
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ title }}
          </h2>
          <Button variant="link" aria-label="Close modal" @click="close">
            <XMarkIcon class="size-5" />
          </Button>
        </div>

        <div class="px-4 py-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import Button from '../ui/Button.vue'

interface Props {
  modelValue: boolean
  title?: string
  closeOnOutside?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Modal',
  closeOnOutside: true,
  closeOnEscape: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnOutside) {
    close()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.modelValue && props.closeOnEscape) {
    close()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleEscape)
      return
    }

    document.body.style.overflow = ''
    window.removeEventListener('keydown', handleEscape)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleEscape)
})
</script>
