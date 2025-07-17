import { config } from './config';

const API_BASE_URL = config.API_BASE_URL;

// API client class
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers })
  }

  async post<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers
    })
  }

  async put<T>(endpoint: string, data?: any, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers
    })
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers })
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health')
  }

  // Lead operations
  async getLeads(skip = 0, limit = 100) {
    return this.request<any[]>(`/api/leads?skip=${skip}&limit=${limit}`)
  }

  async getLead(id: string) {
    return this.request<any>(`/api/leads/${id}`)
  }

  async createLead(lead: any) {
    return this.request<any>('/api/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    })
  }

  async updateLead(id: string, updates: any) {
    return this.request<any>(`/api/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteLead(id: string) {
    return this.request<void>(`/api/leads/${id}`, {
      method: 'DELETE',
    })
  }

  // Call operations
  async initiateCall(leadId: string) {
    return this.request<{
      call_sid: string
      call_log_id: string
      status: string
    }>('/calls/initiate', {
      method: 'POST',
      body: JSON.stringify({ lead_id: leadId }),
    })
  }

  async getCallLogs(skip = 0, limit = 100) {
    return this.request<any[]>(`/calls?skip=${skip}&limit=${limit}`)
  }

  async getCallLog(id: string) {
    return this.request<any>(`/calls/${id}`)
  }

  async updateCallLog(id: string, updates: any) {
    return this.request<any>(`/calls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats')
  }

  // Email automation - Templates
  async getEmailTemplates() {
    return this.request<any[]>('/api/email-automation/templates')
  }

  async getEmailTemplate(id: string) {
    return this.request<any>(`/api/email-automation/templates/${id}`)
  }

  async createEmailTemplate(template: any) {
    return this.request<any>('/api/email-automation/templates', {
      method: 'POST',
      body: JSON.stringify(template),
    })
  }

  async updateEmailTemplate(id: string, updates: any) {
    return this.request<any>(`/api/email-automation/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteEmailTemplate(id: string) {
    return this.request<void>(`/api/email-automation/templates/${id}`, {
      method: 'DELETE',
    })
  }

  // Email automation - Workflows
  async getEmailWorkflows(triggerType?: string, status?: string) {
    const params = new URLSearchParams()
    if (triggerType) params.append('trigger_type', triggerType)
    if (status) params.append('status', status)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<any[]>(`/api/email-automation/workflows${query}`)
  }

  async getEmailWorkflow(id: string) {
    return this.request<any>(`/api/email-automation/workflows/${id}`)
  }

  async createEmailWorkflow(workflow: any) {
    return this.request<any>('/api/email-automation/workflows', {
      method: 'POST',
      body: JSON.stringify(workflow),
    })
  }

  async updateEmailWorkflow(id: string, updates: any) {
    return this.request<any>(`/api/email-automation/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteEmailWorkflow(id: string) {
    return this.request<void>(`/api/email-automation/workflows/${id}`, {
      method: 'DELETE',
    })
  }

  async pauseEmailWorkflow(id: string) {
    return this.request<any>(`/api/email-automation/workflows/${id}/pause`, {
      method: 'POST',
    })
  }

  async activateEmailWorkflow(id: string) {
    return this.request<any>(`/api/email-automation/workflows/${id}/activate`, {
      method: 'POST',
    })
  }

  async triggerEmailWorkflow(id: string, leadId: string) {
    return this.request<any>(`/api/email-automation/workflows/${id}/trigger`, {
      method: 'POST',
      body: JSON.stringify({ lead_id: leadId }),
    })
  }

  // Email automation - Sending
  async sendEmail(emailRequest: any) {
    return this.request<any>('/api/email-automation/send', {
      method: 'POST',
      body: JSON.stringify(emailRequest),
    })
  }

  async sendTestEmail(toEmail: string, templateId: string, variables?: any) {
    return this.request<any>('/api/email-automation/send-test', {
      method: 'POST',
      body: JSON.stringify({ 
        to_email: toEmail, 
        template_id: templateId, 
        variables: variables || {} 
      }),
    })
  }

  // Email automation - History
  async getEmailHistory(limit = 100, offset = 0) {
    return this.request<{ emails: any[] }>(`/api/email-automation/history?limit=${limit}&offset=${offset}`)
  }

  async getEmailHistoryByWorkflow(workflowId: string) {
    return this.request<{ emails: any[] }>(`/api/email-automation/history/workflow/${workflowId}`)
  }

  async getEmailHistoryByLead(leadId: string) {
    return this.request<{ emails: any[] }>(`/api/email-automation/history/lead/${leadId}`)
  }

  // Email automation - Lead integration
  async sendWelcomeEmail(leadId: string) {
    return this.request<any>(`/api/email-automation/leads/${leadId}/welcome`, {
      method: 'POST',
    })
  }

  async sendQualificationEmail(leadId: string) {
    return this.request<any>(`/api/email-automation/leads/${leadId}/qualification`, {
      method: 'POST',
    })
  }

  async sendFollowUpEmail(leadId: string, followUpType = 'general') {
    return this.request<any>(`/api/email-automation/leads/${leadId}/follow-up?follow_up_type=${followUpType}`, {
      method: 'POST',
    })
  }

  async processLeadForAutomation(leadId: string) {
    return this.request<any>(`/api/email-automation/leads/${leadId}/process`, {
      method: 'POST',
    })
  }

  async bulkProcessLeads(leadIds: string[]) {
    return this.request<any>('/api/email-automation/leads/bulk-process', {
      method: 'POST',
      body: JSON.stringify({ lead_ids: leadIds }),
    })
  }

  // Email automation - Statistics
  async getWorkflowStats() {
    return this.request<any>('/api/email-automation/workflows/stats')
  }

  async getPendingWorkflowExecutions() {
    return this.request<{ executions: any[] }>('/api/email-automation/workflows/executions/pending')
  }

  async getLeadWorkflowExecutions(leadId: string) {
    return this.request<{ executions: any[] }>(`/api/email-automation/workflows/executions/lead/${leadId}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

// Helper functions for common operations
export const api = {
  // Health check
  healthCheck: () => apiClient.healthCheck(),

  // Lead operations
  leads: {
    list: (skip?: number, limit?: number) => apiClient.getLeads(skip, limit),
    get: (id: string) => apiClient.getLead(id),
    create: (lead: any) => apiClient.createLead(lead),
    update: (id: string, updates: any) => apiClient.updateLead(id, updates),
    delete: (id: string) => apiClient.deleteLead(id),
  },

  // Call operations
  calls: {
    initiate: (leadId: string) => apiClient.initiateCall(leadId),
    list: (skip?: number, limit?: number) => apiClient.getCallLogs(skip, limit),
    get: (id: string) => apiClient.getCallLog(id),
    update: (id: string, updates: any) => apiClient.updateCallLog(id, updates),
  },

  // Dashboard
  dashboard: {
    stats: () => apiClient.getDashboardStats(),
  },

  // Email automation
  emailAutomation: {
    // Templates
    templates: {
      list: () => apiClient.getEmailTemplates(),
      get: (id: string) => apiClient.getEmailTemplate(id),
      create: (template: any) => apiClient.createEmailTemplate(template),
      update: (id: string, updates: any) => apiClient.updateEmailTemplate(id, updates),
      delete: (id: string) => apiClient.deleteEmailTemplate(id),
    },

    // Workflows
    workflows: {
      list: (triggerType?: string, status?: string) => apiClient.getEmailWorkflows(triggerType, status),
      get: (id: string) => apiClient.getEmailWorkflow(id),
      create: (workflow: any) => apiClient.createEmailWorkflow(workflow),
      update: (id: string, updates: any) => apiClient.updateEmailWorkflow(id, updates),
      delete: (id: string) => apiClient.deleteEmailWorkflow(id),
      pause: (id: string) => apiClient.pauseEmailWorkflow(id),
      activate: (id: string) => apiClient.activateEmailWorkflow(id),
      trigger: (id: string, leadId: string) => apiClient.triggerEmailWorkflow(id, leadId),
      stats: () => apiClient.getWorkflowStats(),
    },

    // Email sending
    send: (emailRequest: any) => apiClient.sendEmail(emailRequest),
    sendTest: (toEmail: string, templateId: string, variables?: any) => 
      apiClient.sendTestEmail(toEmail, templateId, variables),

    // History
    history: {
      list: (limit?: number, offset?: number) => apiClient.getEmailHistory(limit, offset),
      byWorkflow: (workflowId: string) => apiClient.getEmailHistoryByWorkflow(workflowId),
      byLead: (leadId: string) => apiClient.getEmailHistoryByLead(leadId),
    },

    // Lead integration
    leads: {
      sendWelcome: (leadId: string) => apiClient.sendWelcomeEmail(leadId),
      sendQualification: (leadId: string) => apiClient.sendQualificationEmail(leadId),
      sendFollowUp: (leadId: string, type?: string) => apiClient.sendFollowUpEmail(leadId, type),
      process: (leadId: string) => apiClient.processLeadForAutomation(leadId),
      bulkProcess: (leadIds: string[]) => apiClient.bulkProcessLeads(leadIds),
    },

    // Executions
    executions: {
      pending: () => apiClient.getPendingWorkflowExecutions(),
      byLead: (leadId: string) => apiClient.getLeadWorkflowExecutions(leadId),
    },

    // Bounce handling
    bounces: {
      handle: (email: string, bounceType: string, bounceReason: string, details?: any) => 
        apiClient.post('/api/email-automation/bounces/handle', { email, bounce_type: bounceType, bounce_reason: bounceReason, ...details }),
      handleFailure: (email: string, failureReason: string, details?: any) => 
        apiClient.post('/api/email-automation/bounces/delivery-failure', { email, failure_reason: failureReason, ...details }),
      records: (limit?: number, offset?: number) => 
        apiClient.get('/api/email-automation/bounces/records', { params: { limit, offset } }),
      failures: (limit?: number, offset?: number) => 
        apiClient.get('/api/email-automation/bounces/failures', { params: { limit, offset } }),
      stats: () => apiClient.get('/api/email-automation/bounces/stats'),
      retryQueue: () => apiClient.get('/api/email-automation/bounces/retry-queue'),
      markRetryComplete: (email: string, resendId: string, success: boolean) => 
        apiClient.post('/api/email-automation/bounces/retry/complete', { email, resend_id: resendId, success }),
      processWebhook: (webhookData: any) => 
        apiClient.post('/api/email-automation/bounces/webhook', webhookData),
      cleanup: (daysOld?: number) => 
        apiClient.post('/api/email-automation/bounces/cleanup', { days_old: daysOld }),
    },
  },
}

export default api