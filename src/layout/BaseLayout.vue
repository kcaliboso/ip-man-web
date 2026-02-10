<template>
  <div class="mx-auto w-full max-w-6xl flex flex-col min-h-dvh px-2 md:px-4 2xl:px-0">
    <NavBar />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/shared/NavBar.vue'
import { RouterView } from 'vue-router'
</script>
