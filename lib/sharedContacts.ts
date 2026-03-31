import { createAdminClient } from './supabase/admin'

export interface SharedContactData {
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  phone?: string | null
  company?: string | null
}

/**
 * Upsert a client into shared_contacts from ZiggyNexus.
 * workspaceId should be SUPABASE_WORKSPACE_ID env var (hub admin's auth.uid).
 */
export async function upsertSharedContact(
  data: SharedContactData,
  externalClientId?: string,
): Promise<void> {
  const workspaceId = process.env.SUPABASE_WORKSPACE_ID
  if (!workspaceId) return // not configured — skip silently

  try {
    const supabase = createAdminClient()

    const payload = {
      workspace_id: workspaceId,
      source: 'ziggynexus' as const,
      first_name: data.first_name ?? null,
      last_name: data.last_name ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      company: data.company ?? null,
      external_ids: externalClientId ? { ziggynexus_client_id: externalClientId } : {},
      updated_at: new Date().toISOString(),
    }

    if (data.email) {
      const { data: existing } = await supabase
        .from('shared_contacts')
        .select('id, external_ids')
        .eq('workspace_id', workspaceId)
        .eq('email', data.email)
        .single()

      if (existing) {
        const mergedIds = {
          ...(existing.external_ids as Record<string, string> ?? {}),
          ...(payload.external_ids as Record<string, string>),
        }
        await supabase
          .from('shared_contacts')
          .update({ ...payload, external_ids: mergedIds })
          .eq('id', existing.id)
      } else {
        await supabase.from('shared_contacts').insert(payload)
      }
    } else {
      await supabase.from('shared_contacts').insert(payload)
    }
  } catch {
    // Best-effort
  }
}

/**
 * Look up shared contacts by workspace to show "Also in ZiggyHQ" badge.
 * Returns emails that exist with source='ziggyhq'.
 */
export async function getZiggyHQContactEmails(): Promise<Set<string>> {
  const workspaceId = process.env.SUPABASE_WORKSPACE_ID
  if (!workspaceId) return new Set()

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('shared_contacts')
      .select('email')
      .eq('workspace_id', workspaceId)
      .eq('source', 'ziggyhq')
      .not('email', 'is', null)

    return new Set((data ?? []).map((r: { email: string }) => r.email))
  } catch {
    return new Set()
  }
}
