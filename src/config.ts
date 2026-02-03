/**
 * Runtime/build-time configuration for the frontend.
 *
 * In production (Cloudflare Pages), set:
 *   VITE_API_BASE_URL=https://api.lead.techxto.ar
 *
 * If VITE_API_BASE_URL is empty, the app will use relative URLs (handy for local dev with Vite proxy).
 */
export function normalizeBaseUrl(input?: string) {
  if (!input) return ''
  return input.replace(/\/+$/, '')
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)

/**
 * Webhook tester should NOT be enabled in production (it would expose your internal webhook api key entry UI).
 * Enable only for local testing:
 *   VITE_ENABLE_WEBHOOK_TESTER=true
 */
export const ENABLE_WEBHOOK_TESTER =
  String(import.meta.env.VITE_ENABLE_WEBHOOK_TESTER || '').toLowerCase() === 'true' || import.meta.env.DEV

export const USING_VITE_PROXY = API_BASE_URL === ''
