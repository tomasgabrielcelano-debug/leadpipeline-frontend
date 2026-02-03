export type Conversation = {
  id: number
  externalId: string
  contact: string | null
  createdAtUtc: string
}

export type Message = {
  id: number
  conversationId: number
  externalMessageId: string
  from: string
  text: string
  receivedAtUtc: string
  intent: string
  confidence: number
  matchedRule?: string | null
}

export type OutboxItem = {
  id: number
  text: string
  status: string
  source: string
  createdAtUtc: string
}

export type IngestResultDto = {
  accepted: boolean
  duplicate: boolean
  conversationId: string
  messageId: string
  intent: string
  confidence: number
  matchedRule?: string | null
}

export type IncomingMessageDto = {
  messageId: string
  conversationId: string
  from: string
  text: string
  timestampUtc?: string | null
}
