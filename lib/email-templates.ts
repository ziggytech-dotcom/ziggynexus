// Branded HTML email templates for ZiggyNexus
// All templates accept branding params so emails reflect the agency's look

interface BrandingParams {
  agencyName: string
  primaryColor: string
  logoUrl?: string | null
}

interface DeliverableEmailParams {
  branding: BrandingParams
  clientName: string
  deliverableTitle: string
  deliverableType: string
  portalUrl: string
  message?: string
}

interface InvoiceReminderParams {
  branding: BrandingParams
  clientName: string
  invoiceNumber: string
  amountDue: string
  dueDate: string
  daysOverdue: number
  portalUrl: string
}

interface WelcomeEmailParams {
  branding: BrandingParams
  clientName: string
  portalUrl: string
}

function baseTemplate(branding: BrandingParams, bodyContent: string): string {
  const color = branding.primaryColor || '#10b981'
  const agencyName = branding.agencyName || 'Your Agency'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${agencyName} Portal</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:'Helvetica Neue',Arial,sans-serif;color:#F5F0E8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              ${branding.logoUrl
                ? `<img src="${branding.logoUrl}" alt="${agencyName}" style="max-height:48px;max-width:200px;margin-bottom:12px;" />`
                : `<div style="font-size:11px;letter-spacing:0.15em;color:${color};text-transform:uppercase;font-weight:500;margin-bottom:4px;">${agencyName}</div>`
              }
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;background:#0D0D0D;border-radius:12px;border:1px solid rgba(255,255,255,0.06);margin-top:24px;">
              ${bodyContent}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0;text-align:center;">
              <p style="font-size:12px;color:rgba(245,240,232,0.35);margin:0;">
                Sent via your private client portal &middot; ${agencyName}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim()
}

export function newDeliverableEmail(params: DeliverableEmailParams): string {
  const { branding, clientName, deliverableTitle, deliverableType, portalUrl, message } = params
  const color = branding.primaryColor || '#10b981'

  const body = `
    <h1 style="font-size:28px;font-weight:400;color:#F5F0E8;margin:0 0 8px 0;line-height:1.2;">
      New Deliverable Ready
    </h1>
    <p style="font-size:15px;color:rgba(245,240,232,0.6);margin:0 0 28px 0;">
      Hi ${clientName}, something new is ready for your review.
    </p>
    <div style="background:#141414;border:1px solid rgba(255,255,255,0.06);border-left:3px solid ${color};border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${color};font-weight:500;margin-bottom:6px;">
        ${deliverableType}
      </div>
      <div style="font-size:18px;color:#F5F0E8;font-weight:500;">${deliverableTitle}</div>
      ${message ? `<p style="font-size:14px;color:rgba(245,240,232,0.6);margin:10px 0 0 0;line-height:1.5;">${message}</p>` : ''}
    </div>
    <p style="font-size:14px;color:rgba(245,240,232,0.6);margin:0 0 24px 0;line-height:1.6;">
      Review it in your portal and let us know your feedback. Nothing goes live without your approval.
    </p>
    <a href="${portalUrl}/approvals"
       style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,${color},${color}CC);border-radius:8px;color:#050505;font-size:14px;font-weight:600;text-decoration:none;letter-spacing:0.03em;">
      Review Now →
    </a>
  `
  return baseTemplate(branding, body)
}

export function approvalStatusEmail(params: DeliverableEmailParams & { newStatus: string }): string {
  const { branding, clientName, deliverableTitle, newStatus, portalUrl } = params
  const color = branding.primaryColor || '#10b981'

  const statusMap: Record<string, { label: string; color: string; message: string }> = {
    approved: { label: 'Approved', color: '#4ADE80', message: 'Your approval has been received. We\'ll move forward.' },
    changes_requested: { label: 'Changes Requested', color: '#FB923C', message: 'We\'ve received your feedback and will make the revisions.' },
    rejected: { label: 'Rejected', color: '#F87171', message: 'We\'ve received your rejection. We\'ll be in touch to discuss next steps.' },
  }
  const s = statusMap[newStatus] ?? { label: newStatus, color: color, message: 'Status updated.' }

  const body = `
    <h1 style="font-size:28px;font-weight:400;color:#F5F0E8;margin:0 0 8px 0;">
      Review Status Updated
    </h1>
    <p style="font-size:15px;color:rgba(245,240,232,0.6);margin:0 0 28px 0;">
      Hi ${clientName},
    </p>
    <div style="background:#141414;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <div style="font-size:14px;color:rgba(245,240,232,0.6);margin-bottom:6px;">${deliverableTitle}</div>
      <div style="display:inline-block;padding:4px 12px;border-radius:4px;font-size:13px;font-weight:600;color:${s.color};background:${s.color}20;border:1px solid ${s.color}40;">
        ${s.label}
      </div>
    </div>
    <p style="font-size:14px;color:rgba(245,240,232,0.6);margin:0 0 24px 0;line-height:1.6;">${s.message}</p>
    <a href="${portalUrl}/approvals"
       style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,${color},${color}CC);border-radius:8px;color:#050505;font-size:14px;font-weight:600;text-decoration:none;">
      View in Portal →
    </a>
  `
  return baseTemplate(branding, body)
}

export function invoiceReminderEmail(params: InvoiceReminderParams): string {
  const { branding, clientName, invoiceNumber, amountDue, dueDate, daysOverdue, portalUrl } = params
  const color = branding.primaryColor || '#10b981'

  const urgency = daysOverdue >= 14
    ? 'This invoice is significantly overdue. Please arrange payment at your earliest convenience.'
    : daysOverdue >= 7
    ? 'This invoice is now 7+ days overdue. Please review and arrange payment soon.'
    : 'This invoice became due recently. A quick reminder to arrange payment.'

  const body = `
    <h1 style="font-size:28px;font-weight:400;color:#F5F0E8;margin:0 0 8px 0;">
      Payment Reminder
    </h1>
    <p style="font-size:15px;color:rgba(245,240,232,0.6);margin:0 0 28px 0;">
      Hi ${clientName},
    </p>
    <div style="background:#141414;border:1px solid rgba(255,255,255,0.06);border-left:3px solid #F87171;border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div>
          <div style="font-size:12px;color:rgba(245,240,232,0.4);margin-bottom:4px;">Invoice ${invoiceNumber}</div>
          <div style="font-size:24px;color:#F5F0E8;font-weight:600;">${amountDue}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;color:rgba(245,240,232,0.4);">Due</div>
          <div style="font-size:14px;color:#F87171;">${dueDate}</div>
          <div style="font-size:12px;color:#F87171;margin-top:2px;">${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue</div>
        </div>
      </div>
    </div>
    <p style="font-size:14px;color:rgba(245,240,232,0.6);margin:0 0 24px 0;line-height:1.6;">${urgency}</p>
    <a href="${portalUrl}/invoices"
       style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,${color},${color}CC);border-radius:8px;color:#050505;font-size:14px;font-weight:600;text-decoration:none;">
      View Invoice →
    </a>
  `
  return baseTemplate(branding, body)
}

interface WorkspaceActivityParams {
  branding: BrandingParams
  clientName: string
  eventType: string
  eventDescription: string
  portalAdminUrl: string
  occurredAt: string
}

export function workspaceActivityEmail(params: WorkspaceActivityParams): string {
  const { branding, clientName, eventType, eventDescription, portalAdminUrl, occurredAt } = params
  const color = branding.primaryColor || '#10b981'

  const eventIcons: Record<string, string> = {
    file_viewed: '📂',
    deliverable_viewed: '👁',
    payment_made: '💳',
    message_sent: '💬',
    upload_completed: '📁',
    approval_submitted: '✓',
  }
  const icon = eventIcons[eventType] ?? '◆'

  const body = `
    <h1 style="font-size:24px;font-weight:400;color:#F5F0E8;margin:0 0 8px 0;">
      Client Portal Activity
    </h1>
    <p style="font-size:15px;color:rgba(245,240,232,0.6);margin:0 0 28px 0;">
      A client just took an action in their portal.
    </p>
    <div style="background:#141414;border:1px solid rgba(255,255,255,0.06);border-left:3px solid ${color};border-radius:8px;padding:20px 24px;margin-bottom:28px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <span style="font-size:24px;">${icon}</span>
        <div>
          <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${color};font-weight:500;margin-bottom:4px;">
            ${eventType.replace(/_/g, ' ')}
          </div>
          <div style="font-size:16px;color:#F5F0E8;font-weight:500;">${clientName}</div>
        </div>
      </div>
      <div style="font-size:14px;color:rgba(245,240,232,0.7);line-height:1.6;">${eventDescription}</div>
      <div style="font-size:12px;color:rgba(245,240,232,0.35);margin-top:10px;">${occurredAt}</div>
    </div>
    <a href="${portalAdminUrl}"
       style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,${color},${color}CC);border-radius:8px;color:#050505;font-size:14px;font-weight:600;text-decoration:none;">
      View Admin Panel →
    </a>
  `
  return baseTemplate(branding, body)
}

export function welcomeEmail(params: WelcomeEmailParams): string {
  const { branding, clientName, portalUrl } = params
  const color = branding.primaryColor || '#10b981'
  const agencyName = branding.agencyName || 'Your Agency'

  const body = `
    <h1 style="font-size:32px;font-weight:400;color:#F5F0E8;margin:0 0 12px 0;line-height:1.2;">
      Welcome to your portal
    </h1>
    <p style="font-size:16px;color:rgba(245,240,232,0.7);margin:0 0 32px 0;line-height:1.6;">
      Hi ${clientName}! Your private client portal is ready. This is where you'll review work,
      track your project, approve deliverables, and collaborate with the ${agencyName} team.
    </p>
    <div style="display:grid;gap:12px;margin-bottom:32px;">
      ${[
        ['✓ Approval Queue', 'Review and approve all deliverables before anything goes live'],
        ['◫ Asset Library', 'Access all your brand assets, designs, and files in one place'],
        ['◷ Content Calendar', 'See your entire social media content schedule'],
        ['📁 File Uploads', 'Upload briefs, assets, and references directly to your portal'],
      ].map(([title, desc]) => `
        <div style="background:#141414;border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:16px 20px;display:flex;gap:12px;align-items:flex-start;">
          <span style="font-size:18px;margin-top:1px;">${title.split(' ')[0]}</span>
          <div>
            <div style="font-size:14px;color:#F5F0E8;font-weight:500;margin-bottom:2px;">${title.split(' ').slice(1).join(' ')}</div>
            <div style="font-size:13px;color:rgba(245,240,232,0.5);">${desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <a href="${portalUrl}/onboarding"
       style="display:inline-block;padding:16px 32px;background:linear-gradient(135deg,${color},${color}CC);border-radius:8px;color:#050505;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.03em;">
      Set Up My Portal →
    </a>
  `
  return baseTemplate(branding, body)
}
