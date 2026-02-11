<template>
  <form class="grid gap-4" @submit.prevent="handleCreateIpAddress">
    <Input v-model="ip" label="IP Address" placeholder="192.168.1.1" :error="errors.ip" required />
    <Input v-model="label" label="Label" placeholder="Office Router" :error="errors.label" required />
    <Input
      v-model="comment"
      label="Comment"
      placeholder="Optional note"
      :error="errors.comment"
    />

    <Button type="submit" class-name="w-full">
      <p v-if="isSubmitting">Creating IP Address...</p>
      <p v-else>Create IP Address</p>
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import api from '@/lib/axios'
import { getServerErrorMessage } from '@/lib/authHelpers'

const createIpSchema = z.object({
  ip: z.string().trim().min(1, 'IP address is required.'),
  label: z.string().trim().min(1, 'Label is required.'),
  comment: z.string().trim().optional(),
})

const emit = defineEmits<{
  (e: 'success'): void
}>()

const ip = ref('')
const label = ref('')
const comment = ref('')
const isSubmitting = ref(false)
const errors = ref<{
  ip?: string
  label?: string
  comment?: string
}>({})

async function handleCreateIpAddress() {
  errors.value = {}
  isSubmitting.value = true

  const result = createIpSchema.safeParse({
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
    await api.post('/v1/ip-addresses', {
      ip: result.data.ip,
      label: result.data.label,
      comment: result.data.comment ?? '',
    })

    ip.value = ''
    label.value = ''
    comment.value = ''
    emit('success')
    toast.success('IP address created.')
  } catch (error) {
    toast.error(getServerErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>
