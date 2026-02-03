export default function ErrorBox({ error }: { error: string }) {
  return (
    <div className="error">
      <b>Error:</b> {error}
    </div>
  )
}
