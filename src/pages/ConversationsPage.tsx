import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Conversation } from '../api/types'
import Loading from '../components/Loading'
import ErrorBox from '../components/ErrorBox'
import { fmtUtc } from '../utils/time'

export default function ConversationsPage() {
  const [take, setTake] = useState<number>(50)
  const [items, setItems] = useState<Conversation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [err, setErr] = useState<string>('')

  async function load() {
    setLoading(true)
    setErr('')
    try {
      const res = await api.get<Conversation[]>(`/api/conversations`, { params: { take } })
      setItems(res.data)
    } catch (e: any) {
      setErr(e?.response?.data?.error ?? e?.message ?? 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const summary = useMemo(() => {
    if (!items.length) return 'No conversations yet.'
    return `${items.length} conversation(s)`
  }, [items.length])

  return (
    <div className="card">
      <div className="headerRow">
        <h1 className="h1">Conversations</h1>
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
              onChange={(e) => setTake(Math.max(1, Math.min(200, Number(e.target.value) || 50)))}
            />
          </label>
          <button className="btn primary" onClick={() => void load()} disabled={loading}>Refresh</button>
        </div>
      </div>

      <div className="muted" style={{ marginBottom: 12 }}>{summary}</div>

      {err && <ErrorBox error={err} />}
      {loading ? (
        <Loading />
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>External ID</th>
              <th>Contact</th>
              <th>Created (UTC)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td><span className="badge">{c.externalId}</span></td>
                <td>{c.contact ?? <span className="muted">(none)</span>}</td>
                <td>{fmtUtc(c.createdAtUtc)}</td>
                <td style={{ textAlign: 'right' }}>
                  <Link className="btn" to={`/conversations/${encodeURIComponent(c.externalId)}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <div className="muted small">
        Endpoint: <span className="badge">GET /api/conversations?take=...</span>
      </div>
    </div>
  )
}
