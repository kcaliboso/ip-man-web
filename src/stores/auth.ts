import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { AuthSession } from '@/types/AuthSession'
import { getStoredSession, isJwtTokenValid } from '@/lib/authHelpers'
import type { User } from '@/types/User'

const AUTH_SESSION_KEY = 'auth_session'

export const useAuthStore = defineStore('auth', () => {
  // Single source of truth for persisted authentication state.
  const session = ref<AuthSession>(getStoredSession(AUTH_SESSION_KEY))

  watch(
    session,
    (nextSession) => {
      if (typeof window === 'undefined') {
        return
      }
      // Keep auth state persistent across page reloads.
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession))
    },
    { immediate: true },
  )

  // Convenience accessors for common auth checks.
  const token = computed(() => session.value.token)
  const refreshToken = computed(() => session.value.refreshToken)
  const user = computed(() => session.value.user)
  const isTokenValid = computed(() => isJwtTokenValid(token.value))
  const canRefresh = computed(() => Boolean(refreshToken.value))
  const isAuthenticated = computed(() => isTokenValid.value || canRefresh.value)

  // Replace session in one call (used on login success).
  function setSession(nextSession: Partial<AuthSession>) {
    session.value = {
      token: nextSession.token ?? '',
      refreshToken: nextSession.refreshToken ?? '',
      user: nextSession.user ?? null,
    }
  }

  // Update token while preserving current user and refresh token.
  function setToken(nextToken: string) {
    session.value = {
      ...session.value,
      token: nextToken,
    }
  }

  // Update refresh token while preserving current user and access token.
  function setRefreshToken(nextRefreshToken: string) {
    session.value = {
      ...session.value,
      refreshToken: nextRefreshToken,
    }
  }

  // Update user profile payload while preserving current tokens.
  function setUser(nextUser: User) {
    session.value = {
      ...session.value,
      user: nextUser,
    }
  }

  // Clear full auth session to logout client-side.
  function clearToken() {
    session.value = {
      token: '',
      refreshToken: '',
      user: null,
    }
  }

  return {
    session,
    user,
    token,
    refreshToken,
    isTokenValid,
    canRefresh,
    isAuthenticated,
    setSession,
    setUser,
    setToken,
    setRefreshToken,
    clearToken,
  }
})
