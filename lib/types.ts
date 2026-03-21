export type DeliverableType = 'brand_asset' | 'website' | 'social' | 'report' | 'video'
export type DeliverableStatus = 'pending_review' | 'approved' | 'changes_requested' | 'rejected'
export type ProjectPhaseStatus = 'pending' | 'in_progress' | 'in_review' | 'complete' | 'on_hold'
export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'x'

export interface Client {
  id: string
  name: string
  slug: string
  email: string | null
  phone: string | null
  company: string | null
  avatar_url: string | null
  package: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Deliverable {
  id: string
  client_id: string
  title: string
  description: string | null
  type: DeliverableType
  status: DeliverableStatus
  file_url: string | null
  preview_url: string | null
  thumbnail_url: string | null
  version: number
  notes: string | null
  created_at: string
  updated_at: string
  reviewed_at: string | null
  reviewed_by: string | null
}

export interface DeliverableVersion {
  id: string
  deliverable_id: string
  version: number
  file_url: string | null
  preview_url: string | null
  notes: string | null
  created_by: string | null
  created_at: string
}

export interface ApprovalComment {
  id: string
  deliverable_id: string
  author: string
  author_role: 'client' | 'ztc_team'
  comment: string
  created_at: string
}

export interface ProjectPhase {
  id: string
  client_id: string
  phase: string
  status: ProjectPhaseStatus
  due_date: string | null
  notes: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface SocialCalendarItem {
  id: string
  client_id: string
  deliverable_id: string | null
  platform: SocialPlatform
  caption: string | null
  scheduled_at: string | null
  status: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  client_id: string
  type: string
  title: string
  message: string | null
  read: boolean
  created_at: string
}

// UI helpers
export const PHASE_LABELS: Record<string, string> = {
  discovery: 'Discovery & Research',
  brand_identity: 'Brand Identity',
  website: 'Website Build',
  content_social: 'Content & Social',
  launch: 'Launch',
}

export const PHASE_STATUS_LABELS: Record<ProjectPhaseStatus, string> = {
  pending: '⏳ Pending',
  in_progress: '🔄 In Progress',
  in_review: '🔁 In Review',
  complete: '✅ Complete',
  on_hold: '🚫 On Hold',
}

export const TYPE_LABELS: Record<DeliverableType, string> = {
  brand_asset: 'Brand Asset',
  website: 'Website',
  social: 'Social Content',
  report: 'Report',
  video: 'Video',
}

export const STATUS_LABELS: Record<DeliverableStatus, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  changes_requested: 'Changes Requested',
  rejected: 'Rejected',
}
