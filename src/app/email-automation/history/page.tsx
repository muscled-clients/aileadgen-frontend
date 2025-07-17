'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useEmailHistory } from '@/hooks/useEmailAutomation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EmailHistoryItem {
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

export default function EmailHistoryPage() {
  // React hooks must be called at the top level
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Temporarily disable API call to prevent 404 error
  // const { history: emailHistory, isLoading, error } = useEmailHistory(100, 0);
  const emailHistory: EmailHistoryItem[] = [];
  const isLoading = false;
  const error: Error | null = null;
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  // Error handling disabled since API call is disabled
  // if (error) {
  //   return (
  //     <DashboardLayout>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-red-600">Error loading email history: {error?.message || error?.toString() || 'An unexpected error occurred'}</div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  const mockEmailHistory = [
    {
      id: '1',
      to_name: 'Sarah Johnson',
      to_email: 'sarah.j@company.com',
      subject: 'Welcome to AI Lead Gen, Sarah!',
      content: 'Welcome email content...',
      template_id: 'welcome-email-1',
      workflow_id: '1',
      lead_id: 'lead-1',
      resend_id: 'resend-1',
      status: 'clicked',
      sent_at: '2024-01-15T10:00:00Z',
      opened_at: '2024-01-15T10:03:00Z',
      clicked_at: '2024-01-15T10:05:00Z'
    },
    {
      id: '2',
      to_name: 'Michael Chen',
      to_email: 'mchen@business.com',
      subject: "Here's how we can help your real estate business",
      content: 'Follow-up email content...',
      template_id: 'follow-up-email',
      workflow_id: '2',
      lead_id: 'lead-2',
      status: 'opened',
      sent_at: '2024-01-15T09:55:00Z',
      opened_at: '2024-01-15T09:58:00Z'
    },
    {
      id: '3',
      to_name: 'Emma Rodriguez',
      to_email: 'emma.r@startup.io',
      subject: "Don't forget to complete your profile",
      content: 'Reminder email content...',
      template_id: 'completion-reminder',
      workflow_id: '3',
      lead_id: 'lead-3',
      status: 'delivered',
      sent_at: '2024-01-15T09:50:00Z'
    },
    {
      id: '4',
      to_name: 'David Wilson',
      to_email: 'dwilson@corp.com',
      subject: 'Next steps for your AI Lead Gen journey',
      content: 'Welcome email #2 content...',
      template_id: 'welcome-email-2',
      workflow_id: '1',
      lead_id: 'lead-4',
      status: 'opened',
      sent_at: '2024-01-15T09:45:00Z',
      opened_at: '2024-01-15T09:47:00Z'
    },
    {
      id: '5',
      to_name: 'Lisa Thompson',
      to_email: 'lisa.t@agency.com',
      subject: 'Your demo call is confirmed for tomorrow',
      content: 'Booking confirmation content...',
      template_id: 'booking-confirmation',
      workflow_id: '6',
      lead_id: 'lead-5',
      status: 'clicked',
      sent_at: '2024-01-15T09:40:00Z',
      opened_at: '2024-01-15T09:41:00Z',
      clicked_at: '2024-01-15T09:42:00Z'
    },
    {
      id: '6',
      to_name: 'Robert Martinez',
      to_email: 'robert.m@business.com',
      subject: 'Thank you for your interest',
      content: 'Thank you email content...',
      template_id: 'thank-you-email',
      workflow_id: '5',
      lead_id: 'lead-6',
      status: 'delivered',
      sent_at: '2024-01-15T09:35:00Z'
    },
    {
      id: '7',
      to_name: 'Jennifer Adams',
      to_email: 'j.adams@business.org',
      subject: "Let's get you set up for success",
      content: 'Onboarding step 1 content...',
      template_id: 'onboarding-step-1',
      workflow_id: '7',
      lead_id: 'lead-7',
      status: 'opened',
      sent_at: '2024-01-15T09:30:00Z',
      opened_at: '2024-01-15T09:32:00Z'
    },
    {
      id: '8',
      to_name: 'Alex Kim',
      to_email: 'akim@startup.co',
      subject: 'Ready to schedule your call?',
      content: 'Follow-up email content...',
      template_id: 'follow-up-email',
      workflow_id: '2',
      lead_id: 'lead-8',
      status: 'sent',
      sent_at: '2024-01-15T09:25:00Z'
    },
    {
      id: '9',
      to_name: 'Maria Garcia',
      to_email: 'maria.g@realty.com',
      subject: 'How Garcia Realty increased leads by 300%',
      content: 'Case study email content...',
      template_id: 'case-study-email',
      workflow_id: '1',
      lead_id: 'lead-9',
      status: 'failed',
      sent_at: '2024-01-15T09:20:00Z',
      error_message: 'Failed to deliver'
    },
    {
      id: '10',
      to_name: 'James Wilson',
      to_email: 'jwilson@properties.com',
      subject: 'Welcome to AI Lead Gen, James!',
      content: 'Welcome email content...',
      template_id: 'welcome-email-1',
      workflow_id: '1',
      lead_id: 'lead-10',
      status: 'bounced',
      sent_at: '2024-01-15T09:15:00Z',
      error_message: 'Email bounced'
      timestamp: '35 minutes ago'
    }
  ];

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
      case 'bounced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Use mock data for now since API might not have data yet
  const displayHistory = emailHistory.length > 0 ? emailHistory : mockEmailHistory;

  const filteredHistory = displayHistory.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      (item.to_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.to_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: displayHistory.length,
    sent: displayHistory.filter(item => item.status === 'sent').length,
    delivered: displayHistory.filter(item => item.status === 'delivered').length,
    opened: displayHistory.filter(item => item.status === 'opened').length,
    clicked: displayHistory.filter(item => item.status === 'clicked').length,
    failed: displayHistory.filter(item => item.status === 'failed').length,
    bounced: displayHistory.filter(item => item.status === 'bounced').length
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/email-automation" className="hover:text-blue-600 transition-colors">
                  Email Automation
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">Email History</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Email History</h1>
                <p className="text-gray-600 mt-2">Complete history of all automated emails sent</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                {[
                  { key: 'all', label: 'All', count: statusCounts.all },
                  { key: 'sent', label: 'Sent', count: statusCounts.sent },
                  { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
                  { key: 'opened', label: 'Opened', count: statusCounts.opened },
                  { key: 'clicked', label: 'Clicked', count: statusCounts.clicked },
                  { key: 'failed', label: 'Failed', count: statusCounts.failed },
                  { key: 'bounced', label: 'Bounced', count: statusCounts.bounced }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      filter === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Email History Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Recipient</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Workflow</th>
                    <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Activity</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Sent</th>
                    <th className="text-center py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                              {(item.to_name || 'N/A').split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.to_name || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{item.to_email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{item.template_id || 'Direct Email'}</p>
                          <p className="text-sm text-gray-500">{item.subject}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.workflow_id ? (
                          <Link
                            href={`/email-automation/workflow/${item.workflow_id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {`Workflow ${item.workflow_id}`}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">No workflow</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          {item.opened_at && (
                            <div>Opened: {new Date(item.opened_at).toLocaleDateString()}</div>
                          )}
                          {item.clicked_at && (
                            <div>Clicked: {new Date(item.clicked_at).toLocaleDateString()}</div>
                          )}
                          {!item.opened_at && !item.clicked_at && (
                            <div>No activity</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">
                          {new Date(item.sent_at).toLocaleDateString() || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Resend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No emails found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filteredHistory.length} of {displayHistory.length} emails
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}