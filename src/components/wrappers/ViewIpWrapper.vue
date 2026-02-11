<template>
  <Modal v-model="open" title="View IP Address">
    <div v-if="ipAddress" class="grid gap-3 text-sm">
      <IpItem label="IP Address" :value="ipAddress.ip" />
      <IpItem label="Label" :value="ipAddress.label" />
      <IpItem label="Comment" :value="ipAddress.comment" />
      <IpItem label="Created By" :value="ipAddress.createdBy?.name" />
      <IpItem label="Created At" :value="formatDate(ipAddress.createdAt)" />
      <IpItem label="Updated At" :value="formatDate(ipAddress.updatedAt)" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import { formatDate } from '@/lib/utils'
import type { IpAddress } from '@/types/IpAddress'
import IpItem from './items/IpItem.vue'

interface Props {
  modelValue: boolean
  ipAddress: IpAddress | null
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
