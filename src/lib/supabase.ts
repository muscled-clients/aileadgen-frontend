import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export interface Lead {
  id: string
  name: string
  phone_number: string
  timezone?: string
  status: 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed'
  last_call_time?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface CallLog {
  id: string
  lead_id: string
  timestamp: string
  outcome?: 'booked' | 'callback' | 'not_answered' | 'failed' | 'completed' | 'busy'
  transcript?: any[]
  recording_url?: string
  duration_sec?: number
  ai_agent_version?: string
  status?: string
  call_sid?: string
  created_at: string
  updated_at: string
}

// Database helper functions
export const dbHelpers = {
  // Lead operations
  async getLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Lead[]
  },

  async getLead(id: string) {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Lead
  },

  async createLead(lead: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select()
      .single()
    
    if (error) throw error
    return data as Lead
  },

  async updateLead(id: string, updates: Partial<Lead>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Lead
  },

  async deleteLead(id: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Call log operations
  async getCallLogs() {
    const { data, error } = await supabase
      .from('call_logs')
      .select(`
        *,
        leads (
          name,
          phone_number
        )
      `)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getCallLog(id: string) {
    const { data, error } = await supabase
      .from('call_logs')
      .select(`
        *,
        leads (
          name,
          phone_number
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async createCallLog(callLog: Partial<CallLog>) {
    const { data, error } = await supabase
      .from('call_logs')
      .insert([callLog])
      .select()
      .single()
    
    if (error) throw error
    return data as CallLog
  },

  async updateCallLog(id: string, updates: Partial<CallLog>) {
    const { data, error } = await supabase
      .from('call_logs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as CallLog
  },

  // Dashboard stats
  async getDashboardStats() {
    const { data: leadStats, error: leadError } = await supabase
      .from('leads')
      .select('status')
    
    const { data: callStats, error: callError } = await supabase
      .from('call_logs')
      .select('outcome, timestamp')
    
    if (leadError) throw leadError
    if (callError) throw callError

    // Process the stats
    const stats = {
      totalLeads: leadStats?.length || 0,
      newLeads: leadStats?.filter(l => l.status === 'new').length || 0,
      calledLeads: leadStats?.filter(l => l.status === 'called').length || 0,
      bookedLeads: leadStats?.filter(l => l.status === 'booked').length || 0,
      totalCalls: callStats?.length || 0,
      todaysCalls: callStats?.filter(c => {
        const today = new Date().toISOString().split('T')[0]
        return c.timestamp.startsWith(today)
      }).length || 0,
      successfulCalls: callStats?.filter(c => c.outcome === 'booked').length || 0,
    }

    return stats
  }
}