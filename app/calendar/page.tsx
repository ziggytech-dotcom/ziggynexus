import { createClient } from '@/lib/supabase/server'
import type { SocialCalendarItem } from '@/lib/types'

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  facebook: '👥',
  linkedin: '💼',
  tiktok: '🎵',
  youtube: '▶️',
  x: '𝕏',
}

const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#69C9D0',
  youtube: '#FF0000',
  x: '#1DA1F2',
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user?.email)
    .single()

  // Get this month's + next month's posts
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)

  const { data: posts } = await supabase
    .from('social_calendar')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .gte('scheduled_at', startOfMonth.toISOString())
    .lte('scheduled_at', endOfNextMonth.toISOString())
    .order('scheduled_at', { ascending: true })

  // Group posts by date
  const postsByDate: Record<string, SocialCalendarItem[]> = {}
  posts?.forEach((post: SocialCalendarItem) => {
    if (post.scheduled_at) {
      const dateKey = new Date(post.scheduled_at).toDateString()
      if (!postsByDate[dateKey]) postsByDate[dateKey] = []
      postsByDate[dateKey].push(post)
    }
  })

  // Build calendar grid for current month
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const calendarCells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]

  const statusColors: Record<string, string> = {
    draft: 'var(--text-muted)',
    pending_approval: 'var(--status-pending)',
    approved: 'var(--status-approved)',
    scheduled: 'var(--status-in-progress)',
    posted: 'var(--text-muted)',
  }

  const totalCount = posts?.length ?? 0
  const pendingApproval = posts?.filter((p: SocialCalendarItem) => p.status === 'pending_approval').length ?? 0

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#10b981',
            marginBottom: '8px',
            fontWeight: 500,
          }}
        >
          ZiggyNexus™
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '36px',
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: '6px',
              }}
            >
              Content Calendar
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              {totalCount > 0
                ? `${totalCount} post${totalCount === 1 ? '' : 's'} scheduled.${pendingApproval > 0 ? ` ${pendingApproval} need your approval.` : ''}`
                : 'Your content calendar will appear here as posts are planned.'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {totalCount > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Pending Approval', count: posts?.filter((p: SocialCalendarItem) => p.status === 'pending_approval').length ?? 0, color: 'var(--status-pending)' },
            { label: 'Approved', count: posts?.filter((p: SocialCalendarItem) => p.status === 'approved').length ?? 0, color: 'var(--status-approved)' },
            { label: 'Scheduled', count: posts?.filter((p: SocialCalendarItem) => p.status === 'scheduled').length ?? 0, color: 'var(--status-in-progress)' },
            { label: 'Posted', count: posts?.filter((p: SocialCalendarItem) => p.status === 'posted').length ?? 0, color: 'var(--text-muted)' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: '12px 18px',
                background: 'var(--surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '20px', fontWeight: 600, color: stat.color }}>
                {stat.count}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Calendar grid */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {/* Month header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '20px',
              fontWeight: 400,
              color: 'var(--text)',
            }}
          >
            {monthName}
          </h2>
        </div>

        {/* Day headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              style={{
                padding: '10px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
          }}
        >
          {calendarCells.map((date, i) => {
            const isToday = date?.toDateString() === now.toDateString()
            const dayPosts = date ? (postsByDate[date.toDateString()] ?? []) : []
            const isPast = date ? date < now && !isToday : false

            return (
              <div
                key={i}
                style={{
                  minHeight: '90px',
                  padding: '8px',
                  borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border-subtle)',
                  borderBottom: i < calendarCells.length - 7 ? '1px solid var(--border-subtle)' : 'none',
                  background: isToday ? 'var(--gold-glow)' : 'transparent',
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                {date && (
                  <>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: isToday ? 600 : 400,
                        color: isToday ? '#10b981' : 'var(--text-secondary)',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {date.getDate()}
                      {isToday && (
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            color: '#10b981',
                            textTransform: 'uppercase',
                          }}
                        >
                          Today
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayPosts.slice(0, 3).map((post: SocialCalendarItem) => (
                        <div
                          key={post.id}
                          style={{
                            fontSize: '10px',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            background: `${PLATFORM_COLORS[post.platform] ?? '#666'}20`,
                            color: PLATFORM_COLORS[post.platform] ?? 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          <span>{PLATFORM_ICONS[post.platform] ?? '📄'}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {post.platform}
                          </span>
                          {post.status === 'pending_approval' && (
                            <span style={{ color: 'var(--status-pending)', marginLeft: 'auto' }}>•</span>
                          )}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', paddingLeft: '4px' }}>
                          +{dayPosts.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming posts list */}
      {posts && posts.length > 0 && (
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '20px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            Upcoming Posts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {posts
              .filter((p: SocialCalendarItem) => p.scheduled_at && new Date(p.scheduled_at) >= now)
              .slice(0, 10)
              .map((post: SocialCalendarItem) => (
                <div
                  key={post.id}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${post.status === 'pending_approval' ? 'var(--border)' : 'var(--border-subtle)'}`,
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                  }}
                >
                  {/* Platform */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: `${PLATFORM_COLORS[post.platform] ?? '#666'}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {PLATFORM_ICONS[post.platform] ?? '📄'}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '2px' }}>
                      {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                    </div>
                    {post.caption && (
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {post.caption}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  {post.scheduled_at && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {new Date(post.scheduled_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  )}

                  {/* Status */}
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      color: statusColors[post.status] ?? 'var(--text-muted)',
                      background: `${statusColors[post.status] ?? 'var(--text-muted)'}15`,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {post.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!posts || posts.length === 0) && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 40px',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
          <h3
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '22px',
              fontWeight: 400,
              color: 'var(--text)',
              marginBottom: '8px',
            }}
          >
            Calendar is empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Your social content calendar will appear here once ContentIQ starts producing posts.
          </p>
        </div>
      )}
    </div>
  )
}
