<template>
  <Modal v-model="open" title="View Audit Log">
    <div v-if="auditLog" class="grid gap-3 text-sm">
      <WrapperItem label="Event" :value="auditLog.event" />
      <WrapperItem label="Message" :value="auditLog.message" />
      <WrapperItem label="User" :value="auditLog.user?.name ?? undefined" />
      <WrapperItem label="IP Address" :value="auditLog.ipAddress" />
      <div class="flex flex-col gap-1" v-show="auditLog.oldValues">
        <p class="font-medium">Old Values</p>
        <div class="grid grid-cols-2 gap-2">
          <WrapperItem label="IP Address" :value="auditLog.oldValues?.ip" />
          <WrapperItem label="Label" :value="auditLog.oldValues?.label" />
          <WrapperItem label="Comment" :value="auditLog.oldValues?.comment" />
        </div>
      </div>

      <div class="flex flex-col gap-1" v-show="auditLog.newValues">
        <p class="font-medium">New Values</p>
        <div class="grid grid-cols-2 gap-2">
          <WrapperItem label="IP Address" :value="auditLog.newValues?.ip" />
          <WrapperItem label="Label" :value="auditLog.newValues?.label" />
          <WrapperItem label="Comment" :value="auditLog.newValues?.comment" />
        </div>
      </div>
      <WrapperItem label="Created At" :value="formatDate(auditLog.createdAt)" />
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
