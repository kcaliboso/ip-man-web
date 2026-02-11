<template>
  <Modal v-model="open" title="Delete IP Address">
    <div class="grid gap-6">
      <p class="text-sm text-slate-700 dark:text-slate-200">
        Are you sure to delete this ip {{ ipAddress?.ip ? `(${ipAddress.ip})` : '' }}?
      </p>

      <div class="flex items-center justify-end gap-2">
        <Button variant="outline" type="button" @click="open = false">Cancel</Button>
        <Button
          type="button"
          class-name="bg-red-600 text-white hover:bg-red-700"
          :disabled="isSubmitting"
          @click="handleDelete"
        >
          <span v-if="isSubmitting">Proceeding...</span>
          <span v-else>Proceed</span>
        </Button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import api from '@/lib/axios'
import { getServerErrorMessage } from '@/lib/authHelpers'
import type { IpAddress } from '@/types/IpAddress'
import Modal from '@/components/shared/Modal.vue'
import Button from '@/components/ui/Button.vue'

interface Props {
  modelValue: boolean
  ipAddress: IpAddress | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'deleted'): void
}>()

const isSubmitting = ref(false)

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

async function handleDelete() {
  if (!props.ipAddress || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    await api.delete(`/v1/ip-addresses/${props.ipAddress.id}`)
    toast.success('IP address deleted.')
    emit('deleted')
    emit('update:modelValue', false)
  } catch (error) {
    toast.error(getServerErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>
