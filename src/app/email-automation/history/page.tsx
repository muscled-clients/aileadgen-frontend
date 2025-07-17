'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useEmailHistory } from '@/hooks/useEmailAutomation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EmailHistoryItem {
  id: string;
  recipientName: string;
  recipientEmail: string;
  emailType: string;
  workflowName: string;
  workflowId: string;
  subject: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'bounced';
  timestamp: string;
  openedAt?: string;
  clickedAt?: string;
}

export default function EmailHistoryPage() {
  // Temporarily disable API call to prevent 404 error
  // const { history: emailHistory, isLoading, error } = useEmailHistory(100, 0);
  const emailHistory: any[] = [];
  const isLoading = false;
  const error = null;
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">Error loading email history: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  const mockEmailHistory = [
    {
      id: '1',
      recipientName: 'Sarah Johnson',
      recipientEmail: 'sarah.j@company.com',
      emailType: 'Welcome Email #1',
      workflowName: 'New Lead Welcome Series',
      workflowId: '1',
      subject: 'Welcome to AI Lead Gen, Sarah!',
      status: 'clicked',
      timestamp: '2 minutes ago',
      openedAt: '3 minutes ago',
      clickedAt: '2 minutes ago'
    },
    {
      id: '2',
      recipientName: 'Michael Chen',
      recipientEmail: 'mchen@business.com',
      emailType: 'Follow-up Email',
      workflowName: 'Qualified Lead Follow-up',
      workflowId: '2',
      subject: "Here's how we can help your real estate business",
      status: 'opened',
      timestamp: '5 minutes ago',
      openedAt: '3 minutes ago'
    },
    {
      id: '3',
      recipientName: 'Emma Rodriguez',
      recipientEmail: 'emma.r@startup.io',
      emailType: 'Completion Reminder',
      workflowName: 'Form Completion Reminder',
      workflowId: '3',
      subject: "Don't forget to complete your profile",
      status: 'delivered',
      timestamp: '8 minutes ago'
    },
    {
      id: '4',
      recipientName: 'David Wilson',
      recipientEmail: 'dwilson@corp.com',
      emailType: 'Welcome Email #2',
      workflowName: 'New Lead Welcome Series',
      workflowId: '1',
      subject: 'See what other real estate owners are saying...',
      status: 'opened',
      timestamp: '12 minutes ago',
      openedAt: '10 minutes ago'
    },
    {
      id: '5',
      recipientName: 'Lisa Thompson',
      recipientEmail: 'lisa.t@agency.com',
      emailType: 'Booking Confirmation',
      workflowName: 'Booking Confirmation Series',
      workflowId: '6',
      subject: 'Your demo call is confirmed for tomorrow',
      status: 'clicked',
      timestamp: '15 minutes ago',
      openedAt: '14 minutes ago',
      clickedAt: '13 minutes ago'
    },
    {
      id: '6',
      recipientName: 'Robert Martinez',
      recipientEmail: 'rmartinez@company.net',
      emailType: 'Re-engagement Email',
      workflowName: 'Re-engagement Campaign',
      workflowId: '5',
      subject: "We miss you! Here's what's new",
      status: 'delivered',
      timestamp: '18 minutes ago'
    },
    {
      id: '7',
      recipientName: 'Jennifer Adams',
      recipientEmail: 'j.adams@business.org',
      emailType: 'Onboarding Step 1',
      workflowName: 'Onboarding Sequence',
      workflowId: '7',
      subject: "Let's get you set up for success",
      status: 'opened',
      timestamp: '22 minutes ago',
      openedAt: '20 minutes ago'
    },
    {
      id: '8',
      recipientName: 'Alex Kim',
      recipientEmail: 'akim@startup.co',
      emailType: 'Follow-up Email',
      workflowName: 'Qualified Lead Follow-up',
      workflowId: '2',
      subject: 'Ready to schedule your call?',
      status: 'sent',
      timestamp: '25 minutes ago'
    },
    {
      id: '9',
      recipientName: 'Maria Garcia',
      recipientEmail: 'maria.g@realty.com',
      emailType: 'Case Study Email',
      workflowName: 'New Lead Welcome Series',
      workflowId: '1',
      subject: 'How Garcia Realty increased leads by 300%',
      status: 'failed',
      timestamp: '30 minutes ago'
    },
    {
      id: '10',
      recipientName: 'James Wilson',
      recipientEmail: 'jwilson@properties.com',
      emailType: 'Welcome Email #1',
      workflowName: 'New Lead Welcome Series',
      workflowId: '1',
      subject: 'Welcome to AI Lead Gen, James!',
      status: 'bounced',
      timestamp: '35 minutes ago'
    }
  ];

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
      (item.to_name || item.recipientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.to_email || item.recipientEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                              {(item.to_name || item.recipientName || 'N/A').split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.to_name || item.recipientName || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">{item.to_email || item.recipientEmail || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">{item.template_id || item.emailType || 'Direct Email'}</p>
                          <p className="text-sm text-gray-500">{item.subject}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {item.workflow_id ? (
                          <Link
                            href={`/email-automation/workflow/${item.workflow_id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {item.workflowName || `Workflow ${item.workflow_id}`}
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
                          {(item.opened_at || item.openedAt) && (
                            <div>Opened: {item.openedAt || new Date(item.opened_at).toLocaleDateString()}</div>
                          )}
                          {(item.clicked_at || item.clickedAt) && (
                            <div>Clicked: {item.clickedAt || new Date(item.clicked_at).toLocaleDateString()}</div>
                          )}
                          {!(item.opened_at || item.openedAt) && !(item.clicked_at || item.clickedAt) && (
                            <div>No activity</div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-500">
                          {item.timestamp || (item.sent_at && new Date(item.sent_at).toLocaleDateString()) || 'Unknown'}
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