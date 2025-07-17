'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmailTemplates } from '@/hooks/useEmailAutomation';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function CreateTemplatePage() {
  const router = useRouter();
  const { createTemplate, isLoading: creating } = useEmailTemplates();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    html_content: '',
    variables: '',
    category: 'general'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }
    
    if (!formData.subject.trim()) {
      alert('Please enter a subject line');
      return;
    }
    
    if (!formData.html_content.trim()) {
      alert('Please enter email content');
      return;
    }
    
    setIsLoading(true);
    try {
      const templateData = {
        ...formData,
        variables: formData.variables.split(',').map(v => v.trim()).filter(Boolean)
      };
      
      await createTemplate(templateData);
      router.push('/email-automation/templates');
    } catch (err) {
      console.error('Error creating template:', err);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/email-automation/templates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Template</h1>
            <p className="text-gray-600 mt-1">Create a reusable email template for your campaigns</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Welcome Email, Follow-up Template"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="general">General</option>
                  <option value="welcome">Welcome</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="qualification">Qualification</option>
                  <option value="promotional">Promotional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Use {{variable}} for dynamic content"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variables (comma-separated)
              </label>
              <input
                type="text"
                value={formData.variables}
                onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="name, email, company, niche"
              />
              <p className="text-sm text-gray-500 mt-1">
                These variables can be used in your content as {`{{variable}}`}.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content (HTML) *
              </label>
              <textarea
                value={formData.html_content}
                onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 font-mono text-sm"
                placeholder="<h1>Hello {{name}}</h1>
<p>Welcome to our platform!</p>
<p>We're excited to help you with {{niche}} marketing.</p>
<p>Best regards,<br>The Team</p>"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use HTML tags for formatting. Use variables like {`{{name}}`} for personalization.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link href="/email-automation/templates">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || creating}
              >
                {isLoading || creating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Template'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}