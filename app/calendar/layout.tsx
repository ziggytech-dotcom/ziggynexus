import PortalLayout from '@/components/PortalLayout'

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalLayout>{children}</PortalLayout>
}
