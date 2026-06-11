import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="dash-layout d-flex flex-column" style={{ minHeight: '100vh', background: '#0d0a1a' }}>
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ overflow: 'auto', background: '#120e1e' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
