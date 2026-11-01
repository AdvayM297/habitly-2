import { useApp } from '../context/AppContext'

export default function Toast() {
  const { msg } = useApp()
  return <div>{msg && <div className="toast" role="status">{msg}</div>}</div>
}
