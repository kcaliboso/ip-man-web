<template>
  <section class="flex-1 w-full flex flex-col justify-center items-center gap-2">
    <div class="text-center">
      <h1 class="text-3xl font-bold">Login</h1>
      <p class="mt-2 text-sm dark:text-slate-200">Sign in to access your dashboard.</p>
    </div>

    <form class="mt-2 grid gap-4" @submit.prevent="handleLogin">
      <Input
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        :error="errors.email"
        required
      />

      <Input
        v-model="password"
        label="Password"
        type="password"
        autocomplete="current-password"
        :error="errors.password"
        required
      />

      <Button type="submit">
        <p v-if="isSubmitting">Logging In...</p>
        <p v-else>Login</p>
      </Button>
    </form>

    <div class="mt-6 gap-2 flex flex-col items-center justify-between text-sm">
      <RouterLink class="underline" :to="{ name: 'forgot-password' }">Forgot password?</RouterLink>
      <RouterLink class="underline" :to="{ name: 'register' }">Create account</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/ui/Input.vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import { z } from 'zod'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import { extractToken, extractUser, getServerErrorMessage } from '@/lib/auth'

const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email.' }),
  password: z.string().min(1, 'Password is required.'),
})

const email = ref('')
const password = ref('')
const errors = ref<{ email?: string; password?: string }>({})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const isSubmitting = ref(false)

async function handleLogin() {
  errors.value = {}
  isSubmitting.value = true

  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    const fieldErrors = z.treeifyError(result.error)
    errors.value = {
      email: fieldErrors.properties?.email?.errors?.[0],
      password: fieldErrors.properties?.password?.errors?.[0],
    }
    isSubmitting.value = false
    return
  }

  try {
    const response = await api.post('/auth/login', {
      email: result.data.email,
      password: result.data.password,
    })

    const token = extractToken(response.data)

    if (!token) {
      toast.warning('Token is not available.')
      return
    }

    authStore.setSession({
      token,
      user: extractUser(response.data),
    })

    if (!authStore.isTokenValid) {
      authStore.clearToken()
      toast.error('Invalid or expired token.')
      return
    }

    const redirectTarget =
      typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    router.push(redirectTarget)
  } catch (error) {
    toast.error(getServerErrorMessage(error))
  } finally {
    isSubmitting.value = false
  }
}
</script>
