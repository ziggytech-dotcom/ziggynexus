import SideNav from '@/components/SideNav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav />
      <main
        style={{
          flex: 1,
          padding: '40px 48px',
          overflowY: 'auto',
          background: 'var(--bg)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
