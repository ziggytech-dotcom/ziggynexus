import PortalLayout from '@/components/PortalLayout'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalLayout>{children}</PortalLayout>
}
