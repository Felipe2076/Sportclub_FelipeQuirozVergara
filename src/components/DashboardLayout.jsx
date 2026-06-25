import Header from './Header'
import Sidebar from './Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="d-flex flex-column" style={{
      minHeight: '100vh',
      background: 'linear-gradient(rgba(26,38,80,0.9), rgba(18,26,62,0.85)), url(/dashboard-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }}>
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
