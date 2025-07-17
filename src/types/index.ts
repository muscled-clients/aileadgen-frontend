/**
 * Unified TypeScript types for the AI Lead Gen application
 * Replaces scattered type definitions and removes 'any' types
 */

// === LEAD TYPES ===

export type LeadStatus = 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed';

export type LeadSource = 'landing_page' | 'call_system' | 'import' | 'manual';

export interface UnifiedLead {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  
  // Status and source
  status: LeadStatus;
  source: LeadSource;
  
  // Landing page specific fields
  first_name?: string;
  last_name?: string;
  monthly_revenue?: string;
  marketing_budget?: string;
  pain_point?: string;
  is_serious?: string;
  qualified?: boolean;
  niche?: string;
  
  // Call system specific fields
  timezone?: string;
  last_call_time?: string;
  notes?: string;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface LeadCreateRequest {
  // Core fields
  name?: string;
  phone_number?: string;
  email?: string;
  
  // Landing page fields
  first_name?: string;
  last_name?: string;
  phone?: string;
  monthly_revenue?: string;
  marketing_budget?: string;
  pain_point?: string;
  is_serious?: string;
  qualified?: boolean;
  niche?: string;
  
  // Call system fields
  timezone?: string;
  notes?: string;
}

export interface LeadUpdateRequest {
  name?: string;
  phone_number?: string;
  email?: string;
  status?: LeadStatus;
  notes?: string;
  qualified?: boolean;
}

// === DASHBOARD TYPES ===

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  calledLeads: number;
  bookedLeads: number;
  callbackLeads: number;
  notAnsweredLeads: number;
  failedLeads: number;
  qualifiedLeads: number;
  unqualifiedLeads: number;
  totalCalls: number;
  todaysCalls: number;
  successfulCalls: number;
  failedCalls: number;
  averageDuration: number;
}

// === CALL TYPES ===

export type CallStatus = 'initiated' | 'in-progress' | 'completed' | 'failed';

export interface ActiveCall {
  call_id: string;
  lead_id: string;
  phone_number: string;
  service: 'retell';
  agent_id: string;
  status: CallStatus;
  start_time: string;
  end_time?: string;
  transcript: TranscriptEntry[];
}

export interface TranscriptEntry {
  timestamp: string;
  text: string;
  speaker: 'customer' | 'ai';
  confidence?: number;
}

export interface CallInitiateRequest {
  lead_id: string;
}

export interface CallInitiateResponse {
  success: boolean;
  call_id: string;
  lead_id: string;
  message: string;
}

// === FORM TYPES ===

export interface ConditionalFormData {
  isSerious: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  monthlyRevenue: string;
  painPoint: string;
  marketingBudget: string;
}

export interface FormValidationErrors {
  [key: string]: string | undefined;
}

// === API TYPES ===

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// === UI COMPONENT TYPES ===

export interface BadgeProps {
  status: LeadStatus | 'qualified' | 'not_qualified';
  variant: 'status' | 'outcome' | 'qualification' | 'source';
  className?: string;
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

// === HOOK TYPES ===

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseFormResult<T> {
  values: T;
  errors: FormValidationErrors;
  touched: Record<string, boolean>;
  handleChange: (field: string, value: string) => void;
  handleBlur: (field: string) => void;
  handleSubmit: (onSubmit: (values: T) => void) => void;
  isValid: boolean;
  reset: () => void;
}

// === VALIDATION TYPES ===

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

// === ENVIRONMENT TYPES ===

export interface AppConfig {
  API_BASE_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  RETELL_API_KEY?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

// === ROUTE TYPES ===

export interface RouteParams {
  [key: string]: string | undefined;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

// === LANDING PAGE TYPES ===

export interface LandingPageData {
  niche: {
    name: string;
    slug: string;
  };
  landing_page: {
    headline: string;
    subheadline: string;
    video_url: string;
    cta_text: string;
  };
  pain_points: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  social_proof: Array<{
    stat_number: string;
    stat_text: string;
  }>;
  testimonials: Array<{
    name: string;
    company: string;
    text: string;
    result_metric: string;
  }>;
  cta_offer: {
    offer_title: string;
    benefits: string[];
    guarantee_text: string;
    button_text: string;
  };
}

// === UTILITY TYPES ===

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// === CONSTANTS ===

export const LEAD_STATUSES: Record<LeadStatus, string> = {
  new: 'New',
  called: 'Called',
  booked: 'Booked',
  callback: 'Callback',
  not_answered: 'Not Answered',
  failed: 'Failed'
};

export const LEAD_SOURCES: Record<LeadSource, string> = {
  landing_page: 'Landing Page',
  call_system: 'Call System',
  import: 'Import',
  manual: 'Manual'
};

export const CALL_STATUSES: Record<CallStatus, string> = {
  initiated: 'Initiated',
  'in-progress': 'In Progress',
  completed: 'Completed',
  failed: 'Failed'
};