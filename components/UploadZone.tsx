'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UploadZoneProps {
  clientId: string
}

interface UploadingFile {
  name: string
  progress: number
  error: string | null
  done: boolean
}

export default function UploadZone({ clientId }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadingFile[]>([])
  const [description, setDescription] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const updateUpload = (name: string, patch: Partial<UploadingFile>) => {
    setUploads((prev) =>
      prev.map((u) => (u.name === name ? { ...u, ...patch } : u))
    )
  }

  async function uploadFile(file: File) {
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setUploads((prev) => [...prev, { name: file.name, progress: 0, error: 'File exceeds 50MB limit', done: false }])
      return
    }

    setUploads((prev) => [...prev, { name: file.name, progress: 0, error: null, done: false }])

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      updateUpload(file.name, { error: 'Not authenticated' })
      return
    }

    const ext = file.name.split('.').pop() ?? ''
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `${clientId}/${Date.now()}_${sanitized}`

    // Upload to Supabase storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('client-uploads')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      })

    if (storageError) {
      updateUpload(file.name, { error: storageError.message })
      return
    }

    updateUpload(file.name, { progress: 80 })

    // Get signed URL valid for 1 year (365 days)
    const { data: urlData } = await supabase
      .storage
      .from('client-uploads')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365)

    const fileUrl = urlData?.signedUrl ?? null

    // Save record in DB
    const { error: dbError } = await supabase
      .from('client_uploads')
      .insert({
        client_id: clientId,
        file_name: file.name,
        file_path: storageData.path,
        file_url: fileUrl,
        file_size: file.size,
        file_type: file.type,
        description: description.trim() || null,
        uploaded_by: user.email,
      })

    if (dbError) {
      updateUpload(file.name, { error: dbError.message })
      return
    }

    updateUpload(file.name, { progress: 100, done: true })

    // Refresh page after short delay to show the new file
    setTimeout(() => {
      window.location.reload()
    }, 1200)
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    for (const file of Array.from(files)) {
      await uploadFile(file)
    }
    setDescription('')
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clientId, description]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const activeUploads = uploads.filter((u) => !u.done)

  return (
    <div>
      {/* Optional description */}
      <div style={{ marginBottom: '12px' }}>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a note for your team (optional)"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--gold-dim)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
        />
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#10b981' : 'var(--border)'}`,
          borderRadius: '12px',
          padding: '48px 32px',
          textAlign: 'center',
          background: dragging ? 'var(--gold-glow)' : 'var(--surface)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>
          {dragging ? '📥' : '📁'}
        </div>
        <p style={{ color: 'var(--text)', fontSize: '15px', fontWeight: 500, marginBottom: '6px' }}>
          {dragging ? 'Drop files here' : 'Tap to upload'}
        </p>
        <p className="hidden-mobile" style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
          Or drag &amp; drop — Images, PDFs, videos, docs up to 50MB
        </p>
        <span
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#10b981',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          Choose Files
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
          accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.csv"
        />
      </div>

      {/* Active uploads */}
      {activeUploads.length > 0 && (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeUploads.map((u) => (
            <div
              key={u.name}
              style={{
                padding: '12px 16px',
                background: 'var(--surface)',
                border: `1px solid ${u.error ? 'var(--status-rejected)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: u.error ? 0 : '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    marginRight: '12px',
                  }}
                >
                  {u.name}
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    color: u.error ? 'var(--status-rejected)' : '#10b981',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {u.error ? '✕ Error' : `${u.progress}%`}
                </span>
              </div>
              {u.error ? (
                <p style={{ fontSize: '12px', color: 'var(--status-rejected)', margin: '4px 0 0 0' }}>
                  {u.error}
                </p>
              ) : (
                <div
                  style={{
                    height: '3px',
                    background: 'var(--elevated)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${u.progress}%`,
                      background: 'linear-gradient(90deg, #10b981, var(--gold-light))',
                      transition: 'width 0.3s ease',
                      borderRadius: '2px',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
