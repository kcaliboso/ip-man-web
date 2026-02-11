<template>
  <Modal v-model="open" title="Edit IP Address">
    <form class="grid gap-4" @submit.prevent="handleSubmit">
      <Input v-model="ip" label="IP Address" placeholder="192.168.1.1" :error="errors.ip" required />
      <Input v-model="label" label="Label" placeholder="Office Router" :error="errors.label" required />

      <div class="grid gap-1">
        <label for="ip-comment" class="text-sm font-medium">Comment</label>
        <textarea
          id="ip-comment"
          v-model="comment"
          class="min-h-24 rounded-lg border border-slate-300 px-3 py-2 outline-none transition-colors focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500"
          placeholder="Optional note"
        />
        <p v-if="errors.comment" class="text-xs text-rose-600 dark:text-rose-400">
          {{ errors.comment }}
        </p>
      </div>

      <Button type="submit" class-name="w-full">
        <p v-if="isSubmitting">Saving Changes...</p>
        <p v-else>Save Changes</p>
      </Button>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import api from '@/lib/axios'
import { getServerErrorMessage } from '@/lib/authHelpers'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/shared/Modal.vue'
import type { IpAddress } from '@/types/IpAddress'

interface Props {
  modelValue: boolean
  ipAddress: IpAddress | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'updated'): void
}>()

const editIpSchema = z.object({
  ip: z.string().trim().min(1, 'IP address is required.'),
  label: z.string().trim().min(1, 'Label is required.'),
  comment: z.string().trim().optional(),
})

const ip = ref('')
const label = ref('')
const comment = ref('')
const isSubmitting = ref(false)
const errors = ref<{
  ip?: string
  label?: string
  comment?: string
}>({})

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

watch(
  () => [props.modelValue, props.ipAddress] as const,
  ([isOpen, ipAddress]) => {
    if (!isOpen || !ipAddress) {
      return
    }

    ip.value = ipAddress.ip
    label.value = ipAddress.label
    comment.value = ipAddress.comment ?? ''
    errors.value = {}
  },
  { immediate: true },
)

async function handleSubmit() {
  if (!props.ipAddress) {
    return
  }

  errors.value = {}
  isSubmitting.value = true

  const result = editIpSchema.safeParse({
    ip: ip.value,
    label: label.value,
    comment: comment.value,
  })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.value = {
      ip: fieldErrors.properties?.ip?.errors?.[0],
      label: fieldErrors.properties?.label?.errors?.[0],
      comment: fieldErrors.properties?.comment?.errors?.[0],
    }
    isSubmitting.value = false
    return
  }

  try {
    await api.patch(`/v1/ip-addresses/${props.ipAddress.id}`, {
      ip: result.data.ip,
      label: result.data.label,
      comment: result.data.comment ?? '',
    })

    toast.success('IP address updated.')
    emit('updated')
    emit('update:modelValue', false)
  } catch (error) {
    toast.error(getServerErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>
