<template>
  <main class="bg-slate-50 text-black dark:bg-slate-800 dark:text-slate-50">
    <Toaster theme="system" />
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>
