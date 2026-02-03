import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Message, OutboxItem } from '../api/types'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'
import { fmtUtc } from '../utils/time'

type Tab = 'messages' | 'outbox'

export default function ConversationDetailPage() {
  const { externalId } = useParams<{ externalId: string }>()
  const convId = externalId ? decodeURIComponent(externalId) : ''

  const [tab, setTab] = useState<Tab>('messages')
  const [take, setTake] = useState<number>(200)
  const [messages, setMessages] = useState<Message[]>([])
  const [outbox, setOutbox] = useState<OutboxItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [err, setErr] = useState<string>('')

  async function loadAll() {
    if (!convId) return
    setLoading(true)
    setErr('')
    try {
      const [m, o] = await Promise.all([
        api.get<Message[]>(`/api/conversations/${encodeURIComponent(convId)}/messages`, { params: { take } }),
        api.get<OutboxItem[]>(`/api/outbox/${encodeURIComponent(convId)}`, { params: { take } })
      ])
      setMessages(m.data)
      setOutbox(o.data)
    } catch (e: any) {
      const msg = e?.response?.status === 404
        ? 'Conversation not found (404). Check the externalId.'
        : (e?.response?.data?.error ?? e?.message ?? 'Failed to load conversation data')
      setErr(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convId])

  const header = useMemo(() => {
    return convId ? `Conversation: ${convId}` : 'Conversation'
  }, [convId])

  return (
    <div className="card">
      <div className="headerRow">
        <div>
          <div className="muted small"><Link to="/">← Back</Link></div>
          <h1 className="h1">{header}</h1>
        </div>
        <div className="row">
          <label className="pill" style={{ gap: 8 }}>
            <span className="muted small">take</span>
            <input
              className="input"
              style={{ width: 110 }}
              type="number"
              min={1}
              max={200}
              value={take}
              onChange={(e) => setTake(Math.max(1, Math.min(200, Number(e.target.value) || 200)))}
            />
          </label>
          <button className="btn primary" onClick={() => void loadAll()} disabled={loading}>Refresh</button>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 12 }}>
        <button className={`btn ${tab === 'messages' ? 'primary' : ''}`} onClick={() => setTab('messages')}>Messages</button>
        <button className={`btn ${tab === 'outbox' ? 'primary' : ''}`} onClick={() => setTab('outbox')}>Outbox</button>
      </div>

      {err && <ErrorBox error={err} />}
      {loading ? (
        <Loading />
      ) : tab === 'messages' ? (
        <MessagesTable items={messages} />
      ) : (
        <OutboxTable items={outbox} />
      )}

      <hr />
      <div className="muted small">
        Endpoints: <span className="badge">GET /api/conversations/{'{id}'}/messages</span>{' '}
        <span className="badge">GET /api/outbox/{'{id}'}</span>
      </div>
    </div>
  )
}

function MessagesTable({ items }: { items: Message[] }) {
  if (!items.length) return <div className="muted">No messages.</div>

  return (
    <table className="table">
      <thead>
        <tr>
          <th>When</th>
          <th>From</th>
          <th>Text</th>
          <th>Intent</th>
          <th>Confidence</th>
          <th>Rule</th>
        </tr>
      </thead>
      <tbody>
        {items.map((m) => (
          <tr key={m.id}>
            <td>{fmtUtc(m.receivedAtUtc)}</td>
            <td><span className="badge">{m.from}</span></td>
            <td style={{ whiteSpace: 'pre-wrap' }}>{m.text}</td>
            <td><span className="badge">{m.intent}</span></td>
            <td>{(m.confidence ?? 0).toFixed(2)}</td>
            <td>{m.matchedRule ? <span className="badge">{m.matchedRule}</span> : <span className="muted">-</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function OutboxTable({ items }: { items: OutboxItem[] }) {
  if (!items.length) return <div className="muted">No outbox items.</div>

  return (
    <table className="table">
      <thead>
        <tr>
          <th>When</th>
          <th>Status</th>
          <th>Source</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {items.map((o) => (
          <tr key={o.id}>
            <td>{fmtUtc(o.createdAtUtc)}</td>
            <td><span className="badge">{o.status}</span></td>
            <td><span className="badge">{o.source}</span></td>
            <td style={{ whiteSpace: 'pre-wrap' }}>{o.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
