import { createClient } from '@/lib/supabase/server'
import SideNav from '@/components/SideNav'
import type { ClientBranding } from '@/lib/types'

// Shared server-side layout used by all portal sections.
// Fetches client branding once per request and injects brand CSS variables.
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let branding: ClientBranding = {
    brand_logo_url: null,
    brand_primary_color: null,
    brand_name: null,
  }

  if (user?.email) {
    const { data: client } = await supabase
      .from('clients')
      .select('brand_logo_url, brand_primary_color, brand_name')
      .eq('email', user.email)
      .single()

    if (client) {
      branding = client as ClientBranding
    }
  }

  // Build brand-specific CSS overrides. Only emit the style tag when a
  // non-default primary color is present — otherwise use the global defaults.
  const primaryColor = branding.brand_primary_color
  const brandCss = primaryColor && primaryColor !== '#C9A96E'
    ? `
      .portal-themed {
        --gold: ${primaryColor};
        --gold-light: ${primaryColor}EE;
        --gold-dim: ${primaryColor}4D;
        --gold-glow: ${primaryColor}14;
        --border: ${primaryColor}1F;
        --status-pending: ${primaryColor};
      }
    `.trim()
    : null

  return (
    <>
      {brandCss && (
        // Scoped brand color override — safe: value comes from agency-controlled DB
        // eslint-disable-next-line react/no-danger
        <style dangerouslySetInnerHTML={{ __html: brandCss }} />
      )}
      <div className="portal-themed portal-layout">
        <SideNav branding={branding} />
        <main className="portal-main">
          {children}
        </main>
      </div>
    </>
  )
}
