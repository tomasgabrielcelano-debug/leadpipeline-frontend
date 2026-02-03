import React from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import ConversationsPage from './pages/ConversationsPage'
import ConversationDetailPage from './pages/ConversationDetailPage'
import WebhookTesterPage from './pages/WebhookTesterPage'
import { API_BASE_URL, ENABLE_WEBHOOK_TESTER, USING_VITE_PROXY } from './config'

export default function App() {
  const backendLabel = USING_VITE_PROXY ? '/api (Vite proxy)' : API_BASE_URL

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">LeadPipeline</div>

        <div className="navlinks">
          <NavLink to="/" className={({ isActive }) => `pill ${isActive ? 'active' : ''}`}>
            Conversations
          </NavLink>

          {ENABLE_WEBHOOK_TESTER && (
            <NavLink to="/webhook" className={({ isActive }) => `pill ${isActive ? 'active' : ''}`}>
              Webhook tester
            </NavLink>
          )}
        </div>

        <div style={{ marginLeft: 'auto' }} className="muted small">
          Backend: <span className="badge">{backendLabel || '(not set)'}</span>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<ConversationsPage />} />
        <Route path="/conversations/:externalId" element={<ConversationDetailPage />} />
        {ENABLE_WEBHOOK_TESTER && <Route path="/webhook" element={<WebhookTesterPage />} />}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="muted small" style={{ marginTop: 18 }}>
        {USING_VITE_PROXY ? (
          <>
            Dev mode: requests go through the Vite proxy configured in <span className="badge">vite.config.ts</span>.
          </>
        ) : (
          <>
            Prod mode: backend URL comes from <span className="badge">VITE_API_BASE_URL</span>.
          </>
        )}
      </div>
    </div>
  )
}
