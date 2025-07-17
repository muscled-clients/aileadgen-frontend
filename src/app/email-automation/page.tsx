'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useEmailWorkflows, useEmailStats, useEmailHistory } from '@/hooks/useEmailAutomation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

interface AutomationWorkflow {
  id: string;
  name: string;
  emailCount: number;
  status: 'active' | 'paused';
  trigger: string;
  totalSent: number;
  openRate: string;
  clickRate: string;
  lastActivity: string;
}

interface EmailActivity {
  id: string;
  to_name: string;
  to_email: string;
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

export default function EmailAutomationPage() {
  const { stats: emailStats, isLoading: statsLoading } = useEmailStats();
  const { workflows, isLoading: workflowsLoading, createWorkflow, pauseWorkflow, activateWorkflow } = useEmailWorkflows();
  const { history: recentActivity, isLoading: historyLoading } = useEmailHistory(8, 0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Show loading state
  if (statsLoading || workflowsLoading || historyLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'opened':
        return 'text-blue-600';
      case 'clicked':
        return 'text-purple-600';
      case 'sent':
        return 'text-gray-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'opened':
        return 'bg-blue-100 text-blue-800';
      case 'clicked':
        return 'bg-purple-100 text-purple-800';
      case 'sent':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleWorkflowStatus = async (workflowId: string) => {
    try {
      const workflow = workflows.find(w => w.id === workflowId);
      if (workflow) {
        if (workflow.status === 'active') {
          await pauseWorkflow(workflowId);
        } else {
          await activateWorkflow(workflowId);
        }
      }
    } catch (error) {
      console.error('Error toggling workflow status:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Automation</h1>
                <p className="text-gray-600">Manage automated email campaigns and workflows</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create New Automation
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <Link href="/email-automation/templates">
                <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Manage Templates
                </button>
              </Link>
              <Link href="/email-automation/workflows">
                <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Manage Workflows
                </button>
              </Link>
              <Link href="/email-automation/history">
                <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Email History
                </button>
              </Link>
            </div>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Emails Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{emailStats.sent.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    {emailStats.sentChange} from last month
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivered</p>
                  <p className="text-3xl font-bold text-gray-900">{emailStats.delivered.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">{emailStats.deliveredRate} delivery rate</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Opened</p>
                  <p className="text-3xl font-bold text-gray-900">{emailStats.opened.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">{emailStats.openedRate} open rate</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Workflows</p>
                  <p className="text-3xl font-bold text-gray-900">{emailStats.active}</p>
                  <p className="text-sm text-gray-600 mt-1">{emailStats.clickRate} avg click rate</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Automation Workflows - Table Format */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Automation Workflows</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{workflows.length} workflows</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-green-600">{workflows.filter(w => w.status === 'active').length} active</span>
                  </div>
                  <Link href="/email-automation/workflows">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Manage Workflows
                    </button>
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Workflow</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Trigger</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Emails</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Sent</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Open Rate</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Click Rate</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Last Activity</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map((workflow) => (
                      <tr key={workflow.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              workflow.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">{workflow.trigger_type}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm font-medium text-gray-900">{workflow.steps?.length || 0}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm text-gray-900">{workflow.emails_sent?.toLocaleString() || 0}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm font-medium text-blue-600">{workflow.open_rate ? `${workflow.open_rate}%` : '0%'}</span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-sm font-medium text-purple-600">{workflow.click_rate ? `${workflow.click_rate}%` : '0%'}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-500">
                            {workflow.last_activity ? new Date(workflow.last_activity).toLocaleDateString() : 'Never'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            workflow.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {workflow.status === 'active' ? 'Active' : 'Paused'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/email-automation/workflow/${workflow.id}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => toggleWorkflowStatus(workflow.id)}
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                              {workflow.status === 'active' ? 'Pause' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Enhanced Recent Email Activity */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Email Activity</h2>
                <Link
                  href="/email-automation/history"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Activity
                </Link>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {activity.to_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.to_name}</p>
                          <p className="text-sm text-gray-500">{activity.to_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                          <p className="text-xs text-gray-500">Template: {activity.template_id || 'N/A'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(activity.status)}`}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-400 min-w-0">
                          {activity.sent_at ? new Date(activity.sent_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Create New Automation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Automation Workflow</h2>
              <p className="text-gray-600 mt-1">Set up an automated email sequence for your leads</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Workflow Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Welcome Series, Follow-up Campaign"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Describe what this workflow does..."
                />
              </div>

              {/* Trigger Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Event
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900">
                  <option value="">Select a trigger event...</option>
                  <option value="lead_created">New lead is created</option>
                  <option value="lead_qualified">Lead becomes qualified</option>
                  <option value="form_incomplete">Form incomplete for 1 hour</option>
                  <option value="call_completed">Call is completed</option>
                  <option value="booking_made">Calendar booking is made</option>
                  <option value="no_activity">No activity for 30 days</option>
                  <option value="lead_becomes_customer">Lead becomes customer</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900">
                  <option value="">Select target audience...</option>
                  <option value="all_leads">All leads</option>
                  <option value="qualified_leads">Qualified leads only</option>
                  <option value="real_estate">Real estate leads</option>
                  <option value="high_revenue">High revenue leads ($40K+)</option>
                  <option value="incomplete_forms">Incomplete form leads</option>
                </select>
              </div>

              {/* Email Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Email Templates
                </label>
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Email 1 - Welcome</h4>
                      <span className="text-sm text-gray-500">Send immediately</span>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email subject line..."
                      defaultValue="Welcome to AI Lead Gen, {{name}}!"
                    />
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Email 2 - Follow-up</h4>
                      <select className="text-sm border border-gray-300 rounded px-2 py-1">
                        <option value="1">Wait 1 day</option>
                        <option value="2">Wait 2 days</option>
                        <option value="3">Wait 3 days</option>
                        <option value="7">Wait 1 week</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email subject line..."
                      defaultValue="Here's how we can help your {{niche}} business"
                    />
                  </div>
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    + Add Another Email
                  </button>
                </div>
              </div>

              {/* Workflow Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Settings
                </label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="start_immediately"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="start_immediately" className="ml-2 text-sm text-gray-700">
                      Start workflow immediately after creation
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="skip_weekends"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="skip_weekends" className="ml-2 text-sm text-gray-700">
                      Skip sending emails on weekends
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stop_on_reply"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <label htmlFor="stop_on_reply" className="ml-2 text-sm text-gray-700">
                      Stop workflow when lead replies
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    // Get form data (in a real implementation, you'd get this from form state)
                    const workflowData = {
                      name: 'New Workflow',
                      description: 'Automatically generated workflow',
                      trigger_type: 'new_lead',
                      target_audience: 'all_leads',
                      steps: [
                        {
                          template_id: 'default_welcome',
                          delay_days: 0,
                          delay_hours: 0,
                          conditions: {},
                          order: 1
                        }
                      ],
                      settings: {
                        start_immediately: true,
                        skip_weekends: false,
                        stop_on_reply: true
                      }
                    };
                    
                    await createWorkflow(workflowData);
                    setShowCreateModal(false);
                    alert('Workflow created successfully!');
                  } catch (error) {
                    console.error('Error creating workflow:', error);
                    alert('Failed to create workflow. Please try again.');
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}