import PortalLayout from '@/components/PortalLayout'

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PortalLayout>{children}</PortalLayout>
}
