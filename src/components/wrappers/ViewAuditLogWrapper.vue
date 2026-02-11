<template>
  <Modal v-model="open" title="View Audit Log">
    <div v-if="auditLog" class="grid gap-3 text-sm">
      <WrapperItem label="Event" :value="auditLog.event" />
      <WrapperItem label="Message" :value="auditLog.message" />
      <WrapperItem label="User" :value="auditLog.user?.name ?? undefined" />
      <WrapperItem label="IP Address" :value="ipAddressValue" />
      <WrapperItem label="Created At" :value="formatDate(auditLog.createdAt)" />
      <WrapperItem label="Updated At" :value="formatDate(auditLog.updatedAt)" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import { formatDate } from '@/lib/utils'
import WrapperItem from './items/WrapperItem.vue'
import type { AuditLog } from '@/types/AuditLog'

interface Props {
  modelValue: boolean
  auditLog: AuditLog | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const ipAddressValue = computed(() => {
  const ipAddress = props.auditLog?.ipAddress

  if (!ipAddress) {
    return undefined
  }

  if (typeof ipAddress === 'string') {
    return ipAddress
  }

  return ipAddress.ip ?? undefined
})
</script>
