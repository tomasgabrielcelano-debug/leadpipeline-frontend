export default function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="card">
      <div className="muted">{label}</div>
    </div>
  )
}
