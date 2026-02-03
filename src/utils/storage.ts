const KEY = 'leadpipeline.webhookApiKey'

export function getWebhookApiKey(): string {
  return localStorage.getItem(KEY) ?? ''
}

export function setWebhookApiKey(v: string): void {
  localStorage.setItem(KEY, v)
}
