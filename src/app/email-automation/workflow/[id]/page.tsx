'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

interface EmailSequence {
  id: string;
  name: string;
  subject: string;
  delay: string;
  delayValue: number;
  delayUnit: 'immediate' | 'minutes' | 'hours' | 'days';
  openRate: string;
  clickRate: string;
  order: number;
  status: 'active' | 'paused';
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
}

interface WorkflowDetails {
  id: string;
  name: string;
  description: string;
  trigger: string;
  status: 'active' | 'paused';
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
  updatedAt: string;
  emails: EmailSequence[];
}

export default function WorkflowDetailPage() {
  const params = useParams();
  const workflowId = params.id as string;

  const [workflow, setWorkflow] = useState<WorkflowDetails>({
    id: workflowId,
    name: 'New Lead Welcome Series',
    description: 'A comprehensive welcome series for new leads that guides them through our value proposition and encourages engagement.',
    trigger: 'When new lead is created',
    status: 'active',
    totalSent: 3847,
    totalOpened: 2634,
    totalClicked: 584,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    emails: [
      {
        id: '1',
        name: 'Welcome Email',
        subject: 'Welcome to AI Lead Gen, {{name}}!',
        delay: 'Send immediately',
        delayValue: 0,
        delayUnit: 'immediate',
        openRate: '85.2%',
        clickRate: '18.4%',
        order: 1,
        status: 'active',
        totalSent: 3847,
        totalOpened: 3278,
        totalClicked: 707
      },
      {
        id: '2',
        name: 'Value Proposition',
        subject: 'Here\'s how we help {{niche}} businesses grow',
        delay: 'Wait 1 day',
        delayValue: 1,
        delayUnit: 'days',
        openRate: '72.8%',
        clickRate: '16.2%',
        order: 2,
        status: 'active',
        totalSent: 3278,
        totalOpened: 2386,
        totalClicked: 531
      },
      {
        id: '3',
        name: 'Social Proof',
        subject: 'See what other {{niche}} owners are saying...',
        delay: 'Wait 3 days',
        delayValue: 3,
        delayUnit: 'days',
        openRate: '68.5%',
        clickRate: '14.8%',
        order: 3,
        status: 'active',
        totalSent: 2386,
        totalOpened: 1634,
        totalClicked: 353
      },
      {
        id: '4',
        name: 'Case Study',
        subject: 'How {{company_name}} increased leads by 300%',
        delay: 'Wait 1 week',
        delayValue: 7,
        delayUnit: 'days',
        openRate: '61.2%',
        clickRate: '12.7%',
        order: 4,
        status: 'active',
        totalSent: 1634,
        totalOpened: 1000,
        totalClicked: 208
      },
      {
        id: '5',
        name: 'Call to Action',
        subject: 'Ready to get started? Let\'s schedule your call',
        delay: 'Wait 2 weeks',
        delayValue: 14,
        delayUnit: 'days',
        openRate: '58.9%',
        clickRate: '22.1%',
        order: 5,
        status: 'active',
        totalSent: 1000,
        totalOpened: 589,
        totalClicked: 221
      }
    ]
  });

  const [showAddEmailModal, setShowAddEmailModal] = useState(false);

  const toggleWorkflowStatus = () => {
    setWorkflow(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active'
    }));
  };

  const deleteWorkflow = () => {
    if (confirm('Are you sure you want to delete this workflow? This action cannot be undone.')) {
      // This would call an API to delete the workflow
      console.log('Delete workflow:', workflowId);
    }
  };

  const duplicateWorkflow = () => {
    // This would call an API to duplicate the workflow
    console.log('Duplicate workflow:', workflowId);
  };

  const toggleEmailStatus = (emailId: string) => {
    setWorkflow(prev => ({
      ...prev,
      emails: prev.emails.map(email =>
        email.id === emailId
          ? { ...email, status: email.status === 'active' ? 'paused' : 'active' }
          : email
      )
    }));
  };

  const deleteEmail = (emailId: string) => {
    if (confirm('Are you sure you want to delete this email from the sequence?')) {
      setWorkflow(prev => ({
        ...prev,
        emails: prev.emails.filter(email => email.id !== emailId)
      }));
    }
  };

  const calculateOverallStats = () => {
    const totalSent = workflow.totalSent;
    const totalOpened = workflow.totalOpened;
    const totalClicked = workflow.totalClicked;
    
    return {
      openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0',
      clickRate: totalSent > 0 ? ((totalClicked / totalSent) * 100).toFixed(1) : '0.0',
      conversionRate: totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : '0.0'
    };
  };

  const overallStats = calculateOverallStats();

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          
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
              <li className="text-gray-900 font-medium">{workflow.name}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${
                  workflow.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
                  <p className="text-gray-600 mt-2">{workflow.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>Trigger: {workflow.trigger}</span>
                    <span>•</span>
                    <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  workflow.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.status === 'active' ? 'Active' : 'Paused'}
                </span>
                <button 
                  onClick={toggleWorkflowStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    workflow.status === 'active'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {workflow.status === 'active' ? 'Pause Workflow' : 'Activate Workflow'}
                </button>
              </div>
            </div>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{workflow.totalSent.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Opened</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{workflow.totalOpened.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{overallStats.openRate}% open rate</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Total Clicked</p>
              </div>
              <p className="text-3xl font-bold text-purple-600">{workflow.totalClicked.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-1">{overallStats.clickRate}% click rate</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{overallStats.conversionRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Opens to clicks</p>
            </div>
          </div>

          {/* Email Sequence */}
          <div className="bg-white rounded-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Email Sequence</h2>
              <button
                onClick={() => setShowAddEmailModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add Email
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {workflow.emails.map((email, index) => (
                  <div key={email.id} className="relative">
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                            {email.order}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-lg">{email.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                email.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {email.status === 'active' ? 'Active' : 'Paused'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">Subject: {email.subject}</p>
                            <p className="text-sm text-gray-500">{email.delay}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/email-automation/template/${email.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleEmailStatus(email.id)}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            {email.status === 'active' ? 'Pause' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteEmail(email.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{email.totalSent.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Sent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{email.totalOpened.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{email.openRate} opened</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{email.totalClicked.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{email.clickRate} clicked</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {email.totalOpened > 0 ? ((email.totalClicked / email.totalOpened) * 100).toFixed(1) : '0.0'}%
                          </p>
                          <p className="text-xs text-gray-500">Conversion</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection line to next email */}
                    {index < workflow.emails.length - 1 && (
                      <div className="flex items-center justify-center mt-4 mb-2">
                        <div className="w-px h-8 bg-gray-300"></div>
                        <div className="absolute w-3 h-3 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setShowAddEmailModal(true)}
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Email to Sequence
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Link 
              href="/email-automation"
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Email Automation
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={duplicateWorkflow}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Duplicate Workflow
              </button>
              <button 
                onClick={deleteWorkflow}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Workflow
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}