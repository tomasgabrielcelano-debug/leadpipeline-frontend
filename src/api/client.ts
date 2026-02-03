import axios from 'axios'
import { API_BASE_URL } from '../config'

export const api = axios.create({
  baseURL: API_BASE_URL, // empty => relative URLs (dev proxy), non-empty => absolute base URL
  timeout: 15000,
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Normalize network/timeout errors a bit for UI
    if (err?.code === 'ECONNABORTED') {
      err.message = 'Request timed out'
    }
    return Promise.reject(err)
  }
)
