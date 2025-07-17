// Lead types
export type LeadStatus = 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed'

export interface Lead {
  id: string
  name: string
  phone_number: string
  timezone?: string
  status: LeadStatus
  last_call_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CreateLeadRequest {
  name: string
  phone_number: string
  timezone?: string
  notes?: string
}

export interface UpdateLeadRequest {
  name?: string
  phone_number?: string
  timezone?: string
  status?: LeadStatus
  notes?: string
}

// Call types
export type CallOutcome = 'booked' | 'callback' | 'not_answered' | 'failed' | 'completed' | 'busy'
export type CallStatus = 'pending' | 'initiated' | 'in_progress' | 'completed' | 'failed'

export interface CallLog {
  id: string
  lead_id: string
  timestamp: string
  outcome?: CallOutcome
  transcript?: TranscriptEntry[]
  recording_url?: string
  duration_sec?: number
  ai_agent_version?: string
  status?: CallStatus
  call_sid?: string
  created_at: string
  updated_at: string
  leads?: {
    name: string
    phone_number: string
  }
}

export interface TranscriptEntry {
  timestamp: string
  text: string
  speaker: 'ai' | 'customer'
  confidence?: number
}

export interface CallInitiateRequest {
  lead_id: string
}

export interface CallInitiateResponse {
  call_sid: string
  call_log_id: string
  status: string
}

// Dashboard types
export interface DashboardStats {
  totalLeads: number
  newLeads: number
  calledLeads: number
  bookedLeads: number
  callbackLeads: number
  notAnsweredLeads: number
  failedLeads: number
  totalCalls: number
  todaysCalls: number
  successfulCalls: number
  failedCalls: number
  averageDuration?: number
}

export interface RecentActivity {
  id: string
  action: string
  lead: string
  outcome: string
  time: string
}

// API response types
export interface ApiResponse<T> {
  data: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  skip: number
  limit: number
}

// Form types
export interface LeadFormData {
  name: string
  phone_number: string
  timezone: string
  notes: string
}

export interface CallOutcomeFormData {
  outcome: CallOutcome
  notes?: string
}

// UI types
export interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

export interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  current?: boolean
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: any
}

// Settings types
export interface CompanySettings {
  name: string
  service_area: string
  description: string
}

export interface CallSettings {
  recording_enabled: boolean
  recording_disclaimer: boolean
  auto_retry_failed: boolean
  max_duration_minutes: number
}

export interface UserSettings {
  first_name: string
  last_name: string
  email: string
  phone: string
  timezone: string
  role: 'admin' | 'manager' | 'agent'
  notifications: {
    email: boolean
    call_completion: boolean
    daily_reports: boolean
    weekly_reports: boolean
  }
}