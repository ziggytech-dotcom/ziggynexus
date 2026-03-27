import { createClient } from '@/lib/supabase/server'
import type { Invoice } from '@/lib/types'
import BillingPortalButton from '@/components/BillingPortalButton'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user?.email)
    .single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('created_at', { ascending: false })

  const openInvoices = (invoices ?? []).filter((i: Invoice) => i.status === 'open')
  const paidInvoices = (invoices ?? []).filter((i: Invoice) => i.status === 'paid')

  const totalOutstanding = openInvoices.reduce((sum: number, i: Invoice) => sum + i.amount_cents, 0)

  function formatAmount(cents: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  function isOverdue(invoice: Invoice): boolean {
    if (invoice.status !== 'open' || !invoice.due_date) return false
    return new Date(invoice.due_date) < new Date()
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    draft: { label: 'Draft', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' },
    open: { label: 'Due', color: 'var(--status-pending)', bg: 'rgba(201,169,110,0.1)' },
    paid: { label: 'Paid', color: 'var(--status-approved)', bg: 'rgba(74,222,128,0.1)' },
    void: { label: 'Void', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' },
    uncollectible: { label: 'Uncollectible', color: 'var(--status-rejected)', bg: 'rgba(248,113,113,0.1)' },
  }

  // Check if client has any recurring invoices (to show Stripe portal)
  const hasStripeCustomer = (invoices ?? []).some((i: Invoice) => i.stripe_customer_id)

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '8px',
              fontWeight: 500,
            }}
          >
            NexusIQ™
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '36px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '6px',
            }}
          >
            Invoices
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {openInvoices.length > 0
              ? `${openInvoices.length} invoice${openInvoices.length === 1 ? '' : 's'} outstanding.`
              : 'All invoices are up to date.'}
          </p>
        </div>
        {hasStripeCustomer && (
          <BillingPortalButton />
        )}
      </div>

      {/* Outstanding summary */}
      {openInvoices.length > 0 && (
        <div
          style={{
            background: totalOutstanding > 0 ? 'var(--gold-glow)' : 'var(--surface)',
            border: `1px solid ${totalOutstanding > 0 ? 'var(--border)' : 'var(--border-subtle)'}`,
            borderRadius: '12px',
            padding: '24px 28px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Outstanding
            </div>
            <div
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '36px',
                color: 'var(--gold)',
                fontWeight: 400,
              }}
            >
              {formatAmount(totalOutstanding, 'usd')}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {openInvoices.length} invoice{openInvoices.length === 1 ? '' : 's'} due
          </div>
        </div>
      )}

      {/* Open invoices */}
      {openInvoices.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Outstanding
          </h2>
          <InvoiceList invoices={openInvoices} formatAmount={formatAmount} formatDate={formatDate} isOverdue={isOverdue} statusConfig={statusConfig} />
        </div>
      )}

      {/* Paid invoices */}
      {paidInvoices.length > 0 && (
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Paid
          </h2>
          <InvoiceList invoices={paidInvoices} formatAmount={formatAmount} formatDate={formatDate} isOverdue={isOverdue} statusConfig={statusConfig} />
        </div>
      )}

      {/* Empty state */}
      {(!invoices || invoices.length === 0) && (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 40px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '24px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '8px',
            }}
          >
            No invoices yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Invoices from your agency will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

function InvoiceList({
  invoices,
  formatAmount,
  formatDate,
  isOverdue,
  statusConfig,
}: {
  invoices: Invoice[]
  formatAmount: (cents: number, currency: string) => string
  formatDate: (d: string | null) => string
  isOverdue: (i: Invoice) => boolean
  statusConfig: Record<string, { label: string; color: string; bg: string }>
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {invoices.map((invoice) => {
        const overdue = isOverdue(invoice)
        const sc = statusConfig[invoice.status] ?? statusConfig.draft

        return (
          <div
            key={invoice.id}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${overdue ? 'rgba(248,113,113,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: '10px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            {/* Amount */}
            <div style={{ minWidth: '120px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '22px',
                  color: overdue ? 'var(--status-rejected)' : 'var(--text)',
                  fontWeight: 400,
                }}
              >
                {formatAmount(invoice.amount_cents, invoice.currency)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {invoice.invoice_number ?? invoice.id.slice(0, 8).toUpperCase()}
                {invoice.recurring && (
                  <span style={{ marginLeft: '6px', color: 'var(--gold)' }}>
                    ↻ {invoice.recurring_interval ?? 'recurring'}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ flex: 1, minWidth: '160px' }}>
              <div style={{ fontSize: '14px', color: 'var(--text)', marginBottom: '2px' }}>
                {invoice.description ?? 'Invoice'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Due: {formatDate(invoice.due_date)}
                {overdue && (
                  <span style={{ color: 'var(--status-rejected)', marginLeft: '8px' }}>
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Status badge */}
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '5px',
                color: overdue ? 'var(--status-rejected)' : sc.color,
                background: overdue ? 'rgba(248,113,113,0.1)' : sc.bg,
                whiteSpace: 'nowrap',
              }}
            >
              {overdue ? 'Overdue' : sc.label}
            </span>

            {/* Paid date */}
            {invoice.paid_at && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                Paid {formatDate(invoice.paid_at)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
