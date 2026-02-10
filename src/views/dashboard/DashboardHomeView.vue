<template>
  <DashboardSection>
    <article
      class="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <h2 class="text-2xl font-bold">Hey there, {{ authStore?.user?.name }}</h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
        Explore your dashboard. Here you can see the numbers of IPs and recently added IP addresses.
      </p>
    </article>

    <Suspense>
      <template #default>
        <DashboardMetrics @updated="handleSetIp" />
      </template>
      <template #fallback>
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article
            v-for="label in ['Recorded IP Address', 'Audit Logs']"
            :key="label"
            class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
          >
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ label }}</p>
            <p class="mt-2 text-2xl font-semibold">...</p>
          </article>
        </div>
      </template>
    </Suspense>

    <div
      id="recent-ips"
      class="flex-1 overflow-y-auto rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
    >
      <h3 class="mb-3 text-lg font-semibold">Recently Added IP Addresses</h3>
      <ul class="space-y-2">
        <p v-if="!recentActivity.length">No IP Address added</p>
        <li
          v-else
          v-for="item in recentActivity"
          :key="item.id"
          class="rounded-lg flex gap-3 item-center border border-slate-200 p-3 text-sm dark:border-slate-800"
        >
          <p class="font-medium">{{ item.ip }}</p>
          <p class="text-slate-500 dark:text-slate-400">was added by {{ item.createdBy?.name }}</p>
        </li>
      </ul>
    </div>
  </DashboardSection>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { IpAddress } from '@/types/IpAddress'
import DashboardSection from '@/components/sections/DashboardSection.vue'

const DashboardMetrics = defineAsyncComponent(
  () => import('@/components/dashboard/DashboardMetrics.vue'),
)

const recentActivity = ref<IpAddress[]>([])

const authStore = useAuthStore()

function handleSetIp(data: IpAddress[]) {
  recentActivity.value = data
}
</script>
