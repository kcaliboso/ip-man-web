<template>
  <Modal v-model="open" title="View Audit Log">
    <div v-if="auditLog" class="grid gap-3 text-sm">
      <WrapperItem label="IP Address" :value="auditLog.event" />
      <WrapperItem label="Label" :value="auditLog.message" />
      <WrapperItem label="Comment" :value="auditLog.user?.name" />
      <WrapperItem label="Created By" :value="auditLog.ipAddress.ip" />
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
</script>
