<template>
  <div class="mx-auto py-3 w-full max-w-6xl flex flex-col min-h-dvh px-2 md:px-4 2xl:px-0">
    <NavBar />

    <section class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/shared/NavBar.vue'
</script>
