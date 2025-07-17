'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useEmailTemplate, useEmailTemplates, useEmailSending } from '@/hooks/useEmailAutomation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

export default function EmailTemplateEditorPage() {
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<EmailTemplate>({
    id: templateId,
    name: 'Welcome Email',
    subject: 'Welcome to AI Lead Gen, {{name}}!',
    workflow_id: '1',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T09:00:00Z',
    variables: ['name', 'email', 'niche', 'phone', 'company_name', 'revenue', 'pain_point', 'calendar_link', 'profile_link'],
    content: `Hi {{name}},

Welcome to AI Lead Gen! We're thrilled to have you join our community of successful {{niche}} professionals.

Here's what you can expect from us:

🎯 **Qualified Leads**: We'll help you generate 100+ high-quality leads per month specifically for your {{niche}} business.

📈 **Proven Results**: Our AI-powered system has helped businesses like yours increase their lead generation by 300% in just 30 days.

🔧 **Tailored Solutions**: Based on your revenue range ({{revenue}}) and your main challenge of "{{pain_point}}", we'll customize our approach to meet your specific needs.

**Next Steps:**
1. Complete your profile setup: {{profile_link}}
2. Schedule your onboarding call: {{calendar_link}}
3. Start receiving qualified leads within 48 hours

Questions? Just reply to this email or call us at (555) 123-4567.

Welcome aboard!

Best regards,
The AI Lead Gen Team

P.S. Keep an eye on your inbox over the next few days - we'll be sharing some exclusive tips and strategies that have helped {{niche}} businesses like {{company_name}} achieve incredible results.

---
AI Lead Gen
Email: support@aileadgen.com
Phone: (555) 123-4567
Unsubscribe: [unsubscribe_link]`
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [showTestModal, setShowTestModal] = useState(false);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate(prev => ({ ...prev, subject: e.target.value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(prev => ({ ...prev, content: e.target.value }));
  };

  const saveTemplate = () => {
    // This would call an API to save the template
    console.log('Save template:', template);
    alert('Template saved successfully!');
  };

  const sendTestEmail = () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }
    // This would call an API to send a test email
    console.log('Send test email to:', testEmail);
    alert(`Test email sent to ${testEmail}`);
    setShowTestModal(false);
    setTestEmail('');
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('email-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = template.content.substring(0, start) + `{{${variable}}}` + template.content.substring(end);
      setTemplate(prev => ({ ...prev, content: newContent }));
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  // Preview data for template variables
  const previewData = {
    name: 'John Smith',
    email: 'john.smith@company.com',
    niche: 'real estate',
    phone: '(555) 123-4567',
    company_name: 'Smith Realty',
    revenue: '$40K - $80K',
    pain_point: 'Not enough qualified leads',
    calendar_link: 'https://calendly.com/ai-lead-gen/demo',
    profile_link: 'https://app.aileadgen.com/profile'
  };

  const renderPreview = () => {
    let previewContent = template.content;
    let previewSubject = template.subject;
    
    template.variables.forEach(variable => {
      const value = previewData[variable as keyof typeof previewData] || `{{${variable}}}`;
      const regex = new RegExp(`{{${variable}}}`, 'g');
      previewContent = previewContent.replace(regex, value);
      previewSubject = previewSubject.replace(regex, value);
    });

    return (
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>From:</span>
            <span className="font-medium">AI Lead Gen &lt;noreply@aileadgen.com&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>To:</span>
            <span className="font-medium">{previewData.name} &lt;{previewData.email}&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Subject:</span>
            <span className="font-medium">{previewSubject}</span>
          </div>
        </div>
        <div className="p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{previewContent}</div>
          </div>
        </div>
      </div>
    );
  };

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
              <li>
                <Link href={`/email-automation/workflow/${template.workflow_id}`} className="hover:text-blue-600 transition-colors">
                  {template.workflow_id ? `Workflow ${template.workflow_id}` : 'No Workflow'}
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 font-medium">{template.name}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Email Template</h1>
                <p className="text-gray-600 mt-2">Template: {template.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowVariables(!showVariables)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  {showVariables ? 'Hide' : 'Show'} Variables
                </button>
                <button 
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                    previewMode 
                      ? 'bg-gray-600 text-white hover:bg-gray-700' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button 
                  onClick={() => setShowTestModal(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Send Test
                </button>
                <button 
                  onClick={saveTemplate}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>

          {/* Template Variables Helper */}
          {showVariables && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-4">Available Template Variables</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {template.variables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium text-left"
                  >
                    {`{{${variable}}}`}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-blue-800">
                <p className="font-medium">Preview Values:</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(previewData).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium">{key}:</span>
                      <span className="ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className={`${previewMode ? 'hidden lg:block' : ''}`}>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Email Template Editor</h2>
                </div>
                <div className="p-6">
                  {/* Subject Line */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={template.subject}
                      onChange={handleSubjectChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email subject..."
                    />
                  </div>

                  {/* Email Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Content
                    </label>
                    <textarea
                      id="email-content"
                      value={template.content}
                      onChange={handleContentChange}
                      rows={24}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                      placeholder="Enter email content..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className={`${previewMode ? '' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
                  <p className="text-sm text-gray-500 mt-1">How your email will look to recipients</p>
                </div>
                <div className="p-6">
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Link 
              href={`/email-automation/workflow/${template.workflow_id}`}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2 font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Workflow
            </Link>
            
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button 
                onClick={saveTemplate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Test Email Modal */}
          {showTestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Test Email</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Email Address
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address..."
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendTestEmail}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Test
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}