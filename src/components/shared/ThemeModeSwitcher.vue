<template>
  <div ref="containerRef" class="relative z-50">
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-md border border-slate-300 p-1.5 transition-colors hover:bg-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
      aria-label="Change theme mode"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="toggleMenu"
    >
      <SunIcon class="size-5" v-if="effectiveTheme === 'light'" />
      <MoonIcon class="size-5" v-else />
      <ChevronDownIcon class="size-3" />
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 z-20 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md dark:border-slate-700 dark:bg-slate-900"
      role="menu"
      aria-label="Theme mode options"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        role="menuitem"
        @click="setMode('light')"
      >
        <span>Light</span>
        <span v-if="mode === 'light'" aria-hidden="true">✓</span>
      </button>
      <button
        type="button"
        class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        role="menuitem"
        @click="setMode('dark')"
      >
        <span>Dark</span>
        <span v-if="mode === 'dark'" aria-hidden="true">✓</span>
      </button>
      <button
        type="button"
        class="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
        role="menuitem"
        @click="setMode('system')"
      >
        <span>System</span>
        <span v-if="mode === 'system'" aria-hidden="true">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SunIcon, MoonIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

type ThemeMode = 'light' | 'dark' | 'system'
type EffectiveTheme = 'light' | 'dark'

const THEME_MODE_KEY = 'theme_mode'
const mode = ref<ThemeMode>('system')
const effectiveTheme = ref<EffectiveTheme>('light')
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

let darkModeQuery: MediaQueryList | null = null

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system'

const getEffectiveTheme = (selectedMode: ThemeMode): EffectiveTheme =>
  selectedMode === 'system' ? (darkModeQuery?.matches ? 'dark' : 'light') : selectedMode

const applyTheme = (selectedMode: ThemeMode) => {
  const root = document.documentElement
  const nextTheme = getEffectiveTheme(selectedMode)

  effectiveTheme.value = nextTheme
  root.classList.toggle('dark', nextTheme === 'dark')
  root.style.colorScheme = nextTheme
}

const setMode = (selectedMode: ThemeMode) => {
  mode.value = selectedMode
  localStorage.setItem(THEME_MODE_KEY, selectedMode)
  applyTheme(selectedMode)
  isOpen.value = false
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const onSystemThemeChange = () => {
  if (mode.value === 'system') {
    applyTheme('system')
  }
}

const onDocumentClick = (event: MouseEvent) => {
  if (!isOpen.value || !containerRef.value) {
    return
  }

  if (!containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false
  }
}

onMounted(() => {
  darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  darkModeQuery.addEventListener('change', onSystemThemeChange)

  const storedMode = localStorage.getItem(THEME_MODE_KEY)
  mode.value = isThemeMode(storedMode) ? storedMode : 'system'
  effectiveTheme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  darkModeQuery?.removeEventListener('change', onSystemThemeChange)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>
