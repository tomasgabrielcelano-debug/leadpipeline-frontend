import React, { useMemo, useState } from 'react'
import { api } from '../api/client'
import type { IncomingMessageDto, IngestResultDto } from '../api/types'
import ErrorBox from '../components/ErrorBox'
import { getWebhookApiKey, setWebhookApiKey } from '../utils/storage'

function isoNowUtc(): string {
  return new Date().toISOString()
}

export default function WebhookTesterPage() {
  const [apiKey, setApiKey] = useState<string>(() => getWebhookApiKey())

  const [form, setForm] = useState<IncomingMessageDto>(() => ({
    messageId: `m-${Math.random().toString(36).slice(2, 8)}`,
    conversationId: 'c1',
    from: '+549111111111',
    text: 'hola, cuanto sale el cambio de pantalla?',
    timestampUtc: isoNowUtc()
  }))

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [result, setResult] = useState<IngestResultDto | null>(null)

  const canSend = useMemo(() => {
    return !!form.messageId && !!form.conversationId && !!form.from && !!form.text
  }, [form])

  async function send() {
    setBusy(true)
    setErr('')
    setResult(null)

    try {
      setWebhookApiKey(apiKey)

      const res = await api.post<IngestResultDto>(
        '/webhook/messages',
        {
          messageId: form.messageId,
          conversationId: form.conversationId,
          from: form.from,
          text: form.text,
          timestampUtc: form.timestampUtc || null
        },
        {
          headers: {
            'X-Api-Key': apiKey
          }
        }
      )

      setResult(res.data)
    } catch (e: any) {
      const status = e?.response?.status
      if (status === 401) {
        setErr('401 Unauthorized: X-Api-Key inválida o faltante. Configurá el ApiKey en esta pantalla.')
      } else {
        const payload = e?.response?.data
        setErr(payload?.error ?? payload?.title ?? e?.message ?? 'Request failed')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card">
      <div className="headerRow">
        <h1 className="h1">Webhook tester</h1>
        <div className="row">
          <button className="btn" onClick={() => setForm((f) => ({ ...f, messageId: `m-${Math.random().toString(36).slice(2, 8)}` }))}>New messageId</button>
          <button className="btn" onClick={() => setForm((f) => ({ ...f, timestampUtc: isoNowUtc() }))}>Now (UTC)</button>
          <button className="btn primary" onClick={() => void send()} disabled={!canSend || busy}>Send</button>
        </div>
      </div>

      <div className="grid two">
        <div>
          <div className="muted small" style={{ marginBottom: 6 }}>X-Api-Key (solo para /webhook)</div>
          <input
            className="input"
            placeholder="dev-secret / tu api key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <div className="muted small" style={{ marginTop: 6 }}>
            En el backend: <span className="badge">Webhook:ApiKey</span> (appsettings.Development.json).
          </div>

          <hr />

          <div className="muted small" style={{ marginBottom: 6 }}>Payload</div>

          <div className="grid">
            <label className="small muted">messageId
              <input className="input" value={form.messageId} onChange={(e) => setForm({ ...form, messageId: e.target.value })} />
            </label>
            <label className="small muted">conversationId
              <input className="input" value={form.conversationId} onChange={(e) => setForm({ ...form, conversationId: e.target.value })} />
            </label>
            <label className="small muted">from
              <input className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
            </label>
            <label className="small muted">timestampUtc (ISO)
              <input className="input" value={form.timestampUtc ?? ''} onChange={(e) => setForm({ ...form, timestampUtc: e.target.value })} />
            </label>
            <label className="small muted">text
              <textarea className="textarea" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            </label>
          </div>
        </div>

        <div>
          <div className="muted small" style={{ marginBottom: 6 }}>Response</div>
          {err && <ErrorBox error={err} />}
          {result ? (
            <>
              <div className="row" style={{ marginBottom: 10 }}>
                <span className="badge">accepted: {String(result.accepted)}</span>
                <span className="badge">duplicate: {String(result.duplicate)}</span>
                <span className="badge">intent: {result.intent}</span>
                <span className="badge">conf: {result.confidence.toFixed(2)}</span>
              </div>
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </>
          ) : (
            <div className="muted">Send a request to see the ingest result.</div>
          )}

          <hr />

          <div className="muted small">
            Endpoint: <span className="badge">POST /webhook/messages</span>
          </div>
        </div>
      </div>
    </div>
  )
}
