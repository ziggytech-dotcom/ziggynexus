import { createClient } from '@/lib/supabase/server'
import type { ProjectPhase } from '@/lib/types'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name, package')
    .eq('email', user?.email)
    .single()

  const { data: phases } = await supabase
    .from('project_phases')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('order_index')

  // Compute overall progress from phase statuses + progress_pct
  const totalPhases = phases?.length ?? 0
  const overallPct = totalPhases === 0
    ? 0
    : Math.round(
        (phases ?? []).reduce((sum: number, p: ProjectPhase) => {
          if (p.status === 'complete') return sum + 100
          if (p.status === 'pending' || p.status === 'on_hold') return sum + 0
          return sum + (p.progress_pct ?? 0)
        }, 0) / totalPhases
      )

  const completedCount = (phases ?? []).filter((p: ProjectPhase) => p.status === 'complete').length
  const inProgressCount = (phases ?? []).filter((p: ProjectPhase) =>
    p.status === 'in_progress' || p.status === 'in_review'
  ).length

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          fontSize: '12px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '8px',
          fontWeight: 500,
        }}>
          Project Tracking
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair)',
          fontSize: '36px',
          fontWeight: 400,
          color: 'var(--text)',
          marginBottom: '8px',
        }}>
          Progress
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Track every phase of your project from kickoff to launch.
        </p>
      </div>

      {/* Overall progress card */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Overall Project Progress
            </div>
            <div style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '48px',
              color: 'var(--gold)',
              fontWeight: 400,
              lineHeight: 1,
            }}>
              {overallPct}%
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Stat label="Completed" value={String(completedCount)} color="var(--status-approved)" />
            <Stat label="In Progress" value={String(inProgressCount)} color="var(--gold)" />
            <Stat label="Remaining" value={String(totalPhases - completedCount - inProgressCount)} color="var(--text-muted)" />
          </div>
        </div>

        {/* Overall progress bar */}
        <ProgressBar pct={overallPct} height={12} />
      </div>

      {/* Phase milestones */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '18px',
            fontWeight: 400,
            color: 'var(--text)',
          }}>
            Milestones
          </h2>
        </div>

        {phases && phases.length > 0 ? (
          <div>
            {(phases as ProjectPhase[]).map((phase, idx) => (
              <PhaseRow
                key={phase.id}
                phase={phase}
                isLast={idx === phases.length - 1}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '48px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>◈</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              No project phases set up yet. Your team will add milestones here shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProgressBar({ pct, height = 8 }: { pct: number; height?: number }) {
  return (
    <div style={{
      width: '100%',
      height: `${height}px`,
      background: 'var(--elevated)',
      borderRadius: `${height}px`,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${Math.min(100, Math.max(0, pct))}%`,
        background: 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
        borderRadius: `${height}px`,
        transition: 'width 0.6s ease',
      }} />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '28px', fontFamily: 'var(--font-playfair)', color, fontWeight: 400 }}>{value}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function PhaseRow({ phase, isLast }: { phase: ProjectPhase; isLast: boolean }) {
  const statusConfig: Record<string, { icon: string; label: string; color: string }> = {
    complete:    { icon: '✓', label: 'Complete',    color: 'var(--status-approved)' },
    in_progress: { icon: '●', label: 'In Progress', color: 'var(--gold)' },
    in_review:   { icon: '↻', label: 'In Review',   color: 'var(--status-changes)' },
    pending:     { icon: '○', label: 'Pending',     color: 'var(--text-muted)' },
    on_hold:     { icon: '‖', label: 'On Hold',     color: 'var(--status-rejected)' },
  }
  const s = statusConfig[phase.status] ?? statusConfig.pending
  const phasePct = phase.status === 'complete' ? 100 : (phase.progress_pct ?? 0)

  const label = phase.phase.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

  return (
    <div style={{
      padding: '20px 28px',
      borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: phase.status === 'complete' ? 'rgba(74,222,128,0.12)' : 'var(--elevated)',
            color: s.color,
            fontSize: '14px',
            fontWeight: 600,
            border: `1px solid ${s.color}40`,
            flexShrink: 0,
          }}>
            {s.icon}
          </span>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)' }}>{label}</div>
            {phase.notes && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {phase.notes}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
          {phase.due_date && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'right' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
                Due
              </div>
              {new Date(phase.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          )}
          <span style={{
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            color: s.color,
            background: `${s.color}14`,
            border: `1px solid ${s.color}30`,
          }}>
            {s.label}
          </span>
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: phasePct === 100 ? 'var(--status-approved)' : 'var(--text-secondary)',
            minWidth: '38px',
            textAlign: 'right',
          }}>
            {phasePct}%
          </span>
        </div>
      </div>

      {/* Per-phase progress bar */}
      <div style={{
        width: '100%',
        height: '4px',
        background: 'var(--elevated)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${phasePct}%`,
          background: phasePct === 100
            ? 'var(--status-approved)'
            : 'linear-gradient(90deg, var(--gold-dim), var(--gold))',
          borderRadius: '4px',
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  )
}
