import { createClient } from '@/lib/supabase/server'
import UploadZone from '@/components/UploadZone'
import type { ClientUpload } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

export default async function UploadsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select('id, name')
    .eq('email', user?.email)
    .single()

  const { data: uploads } = await supabase
    .from('client_uploads')
    .select('*')
    .eq('client_id', client?.id ?? '')
    .order('created_at', { ascending: false })

  function formatBytes(bytes: number | null): string {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  function fileIcon(mimeType: string | null): string {
    if (!mimeType) return '📄'
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎬'
    if (mimeType === 'application/pdf') return '📕'
    if (mimeType.includes('zip')) return '📦'
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    return '📄'
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
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
            marginBottom: '8px',
          }}
        >
          File Uploads
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Upload briefs, assets, references, or anything else your team needs.
        </p>
      </div>

      {/* Upload zone */}
      {client && (
        <UploadZone clientId={client.id} />
      )}

      {/* Uploaded files list */}
      <div style={{ marginTop: '40px' }}>
        {uploads && uploads.length > 0 ? (
          <>
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Your Uploads ({uploads.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {uploads.map((file: ClientUpload) => (
                <div
                  key={file.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--elevated)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {fileIcon(file.file_type)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text)',
                        marginBottom: '2px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {file.file_name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>{formatBytes(file.file_size)}</span>
                      <span>
                        {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
                      </span>
                      {file.description && (
                        <span style={{ color: 'var(--text-secondary)' }}>{file.description}</span>
                      )}
                    </div>
                  </div>

                  {/* Download */}
                  {file.file_url && (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '13px',
                        color: 'var(--gold)',
                        textDecoration: 'none',
                        padding: '6px 12px',
                        background: 'var(--gold-glow)',
                        borderRadius: '6px',
                        border: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      ↗ View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'var(--surface)',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>📁</div>
            <h3
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: '22px',
                fontWeight: 400,
                color: 'var(--text)',
                marginBottom: '8px',
              }}
            >
              No files uploaded yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Use the upload area above to share briefs, assets, or references with your team.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
