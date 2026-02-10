import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

if (!import.meta.env.VITE_API_URL && import.meta.env.DEV) {
  console.warn('[api] Missing VITE_API_URL. Requests will use the current origin.')
}

export default api
