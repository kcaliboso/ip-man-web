<template>
  <Modal v-model="open" title="Create IP Address">
    <CreateIpAddressForm @success="handleSuccess" />
  </Modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Modal from '@/components/shared/Modal.vue'
import CreateIpAddressForm from '@/components/forms/CreateIpAddressForm.vue'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created'): void
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

function handleSuccess() {
  emit('update:modelValue', false)
  emit('created')
}
</script>
