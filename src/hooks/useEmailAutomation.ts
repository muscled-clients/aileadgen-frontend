import { useState, useEffect } from 'react';
import api from '@/lib/api';

// Email automation types
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  workflow_id?: string;
  created_at: string;
  updated_at: string;
}

interface EmailWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  target_audience: string;
  status: 'active' | 'paused' | 'draft';
  steps: WorkflowStep[];
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  total_triggered: number;
  emails_sent: number;
  open_rate: number;
  click_rate: number;
  last_activity?: string;
}

interface WorkflowStep {
  id: string;
  template_id: string;
  delay_days: number;
  delay_hours: number;
  conditions: Record<string, any>;
  order: number;
}

interface EmailHistoryItem {
  id: string;
  to_email: string;
  to_name: string;
  subject: string;
  content: string;
  template_id?: string;
  workflow_id?: string;
  lead_id?: string;
  resend_id?: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  sent_at: string;
  opened_at?: string;
  clicked_at?: string;
  failed_at?: string;
  error_message?: string;
}

interface EmailStats {
  sent: number;
  delivered: number;
  opened: number;
  active: number;
  sentChange: string;
  deliveredRate: string;
  openedRate: string;
  clickRate: string;
}

// Templates hooks
export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.templates.list();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch templates'));
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (templateData: Partial<EmailTemplate>) => {
    try {
      const newTemplate = await api.emailAutomation.templates.create(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create template');
    }
  };

  const updateTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    try {
      const updatedTemplate = await api.emailAutomation.templates.update(id, updates);
      setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update template');
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await api.emailAutomation.templates.delete(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete template');
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
};

// Workflows hooks
export const useEmailWorkflows = (triggerType?: string, status?: string) => {
  const [workflows, setWorkflows] = useState<EmailWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflows = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.workflows.list(triggerType, status);
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflows'));
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkflow = async (workflowData: Partial<EmailWorkflow>) => {
    try {
      const newWorkflow = await api.emailAutomation.workflows.create(workflowData);
      setWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create workflow');
    }
  };

  const updateWorkflow = async (id: string, updates: Partial<EmailWorkflow>) => {
    try {
      const updatedWorkflow = await api.emailAutomation.workflows.update(id, updates);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update workflow');
    }
  };

  const deleteWorkflow = async (id: string) => {
    try {
      await api.emailAutomation.workflows.delete(id);
      setWorkflows(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete workflow');
    }
  };

  const pauseWorkflow = async (id: string) => {
    try {
      const updatedWorkflow = await api.emailAutomation.workflows.pause(id);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to pause workflow');
    }
  };

  const activateWorkflow = async (id: string) => {
    try {
      const updatedWorkflow = await api.emailAutomation.workflows.activate(id);
      setWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to activate workflow');
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, [triggerType, status]);

  return {
    workflows,
    isLoading,
    error,
    refetch: fetchWorkflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    pauseWorkflow,
    activateWorkflow,
  };
};

// Email history hooks
export const useEmailHistory = (limit = 100, offset = 0) => {
  const [history, setHistory] = useState<EmailHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.history.list(limit, offset);
      setHistory(data.emails);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch email history'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [limit, offset]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
};

// Workflow history hooks
export const useWorkflowHistory = (workflowId: string) => {
  const [history, setHistory] = useState<EmailHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHistory = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.history.byWorkflow(workflowId);
      setHistory(data.emails);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflow history'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workflowId) {
      fetchHistory();
    }
  }, [workflowId]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
};

// Email stats hooks
export const useEmailStats = () => {
  const [stats, setStats] = useState<EmailStats>({
    sent: 0,
    delivered: 0,
    opened: 0,
    active: 0,
    sentChange: '+0%',
    deliveredRate: '0%',
    openedRate: '0%',
    clickRate: '0%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.workflows.stats();
      
      // Calculate stats from workflow data
      const calculatedStats = {
        sent: data.total_emails_sent || 0,
        delivered: Math.round((data.total_emails_sent || 0) * 0.95), // Estimate
        opened: Math.round((data.total_emails_sent || 0) * 0.45), // Estimate
        active: data.active_workflows || 0,
        sentChange: '+18%', // Static for now
        deliveredRate: '95.2%', // Static for now
        openedRate: '45.8%', // Static for now
        clickRate: '12.3%', // Static for now
      };
      
      setStats(calculatedStats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch email stats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

// Single template hook
export const useEmailTemplate = (templateId: string) => {
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplate = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.templates.get(templateId);
      setTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch template'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  return {
    template,
    isLoading,
    error,
    refetch: fetchTemplate,
  };
};

// Single workflow hook
export const useEmailWorkflow = (workflowId: string) => {
  const [workflow, setWorkflow] = useState<EmailWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkflow = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.workflows.get(workflowId);
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workflow'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workflowId) {
      fetchWorkflow();
    }
  }, [workflowId]);

  return {
    workflow,
    isLoading,
    error,
    refetch: fetchWorkflow,
  };
};

// Email sending hooks
export const useEmailSending = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendEmail = async (emailRequest: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.send(emailRequest);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send email'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async (toEmail: string, templateId: string, variables?: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.sendTest(toEmail, templateId, variables);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send test email'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sendEmail,
    sendTestEmail,
  };
};

// Lead email automation hooks
export const useLeadEmailAutomation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendWelcomeEmail = async (leadId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.leads.sendWelcome(leadId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send welcome email'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendQualificationEmail = async (leadId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.leads.sendQualification(leadId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send qualification email'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendFollowUpEmail = async (leadId: string, type = 'general') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.leads.sendFollowUp(leadId, type);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send follow-up email'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const processLead = async (leadId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await api.emailAutomation.leads.process(leadId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process lead'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sendWelcomeEmail,
    sendQualificationEmail,
    sendFollowUpEmail,
    processLead,
  };
};

// Bounce handling hooks
export const useBounceRecords = (limit = 100, offset = 0) => {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecords = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.bounces.records(limit, offset);
      setRecords(data.bounce_records);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bounce records'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBounce = async (email: string, bounceType: string, bounceReason: string, details?: any) => {
    try {
      setError(null);
      await api.emailAutomation.bounces.handle(email, bounceType, bounceReason, details);
      await fetchRecords(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to handle bounce'));
      throw err;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [limit, offset]);

  return {
    records,
    isLoading,
    error,
    handleBounce,
    refetch: fetchRecords,
  };
};

export const useDeliveryFailures = (limit = 100, offset = 0) => {
  const [failures, setFailures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFailures = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.bounces.failures(limit, offset);
      setFailures(data.delivery_failures);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch delivery failures'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryFailure = async (email: string, failureReason: string, details?: any) => {
    try {
      setError(null);
      await api.emailAutomation.bounces.handleFailure(email, failureReason, details);
      await fetchFailures(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to handle delivery failure'));
      throw err;
    }
  };

  useEffect(() => {
    fetchFailures();
  }, [limit, offset]);

  return {
    failures,
    isLoading,
    error,
    handleDeliveryFailure,
    refetch: fetchFailures,
  };
};

export const useBounceStats = () => {
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.bounces.stats();
      setStats(data.bounce_stats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bounce stats'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};

export const useRetryQueue = () => {
  const [retryEmails, setRetryEmails] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRetryQueue = async () => {
    try {
      setError(null);
      const data = await api.emailAutomation.bounces.retryQueue();
      setRetryEmails(data.retry_emails);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch retry queue'));
    } finally {
      setIsLoading(false);
    }
  };

  const markRetryComplete = async (email: string, resendId: string, success: boolean) => {
    try {
      setError(null);
      await api.emailAutomation.bounces.markRetryComplete(email, resendId, success);
      await fetchRetryQueue(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark retry complete'));
      throw err;
    }
  };

  useEffect(() => {
    fetchRetryQueue();
    
    // Poll every 30 seconds for retry queue
    const interval = setInterval(fetchRetryQueue, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    retryEmails,
    isLoading,
    error,
    markRetryComplete,
    refetch: fetchRetryQueue,
  };
};