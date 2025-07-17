'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEmailWorkflows, useEmailTemplates } from '@/hooks/useEmailAutomation';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function CreateWorkflowPage() {
  const router = useRouter();
  const { createWorkflow, isLoading: creating } = useEmailWorkflows();
  const { templates, isLoading: templatesLoading } = useEmailTemplates();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger_type: 'new_lead',
    steps: [{ type: 'email', template_id: '', delay_hours: 0 }]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    
    if (formData.steps.some(step => !step.template_id)) {
      alert('Please select a template for each step');
      return;
    }
    
    setIsLoading(true);
    try {
      await createWorkflow(formData);
      router.push('/email-automation/workflows');
    } catch (err) {
      console.error('Error creating workflow:', err);
      alert('Failed to create workflow. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { type: 'email', template_id: '', delay_hours: 0 }]
    });
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData({
        ...formData,
        steps: formData.steps.filter((_, i) => i !== index)
      });
    }
  };

  const updateStep = (index: number, field: string, value: any) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setFormData({ ...formData, steps: updatedSteps });
  };

  if (templatesLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/email-automation/workflows">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Workflows
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Workflow</h1>
            <p className="text-gray-600 mt-1">Set up an automated email sequence for your leads</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Welcome Series, Follow-up Campaign"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trigger Type
                </label>
                <select
                  value={formData.trigger_type}
                  onChange={(e) => setFormData({ ...formData, trigger_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                >
                  <option value="new_lead">New Lead</option>
                  <option value="qualified_lead">Qualified Lead</option>
                  <option value="manual">Manual Trigger</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                placeholder="Describe what this workflow does..."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Workflow Steps
                </label>
                <Button type="button" onClick={addStep} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              {formData.steps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Step {index + 1}</h4>
                    {formData.steps.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeStep(index)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Template *
                      </label>
                      <select
                        value={step.template_id}
                        onChange={(e) => updateStep(index, 'template_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                        required
                      >
                        <option value="">Select Template</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delay (hours)
                      </label>
                      <input
                        type="number"
                        value={step.delay_hours}
                        onChange={(e) => updateStep(index, 'delay_hours', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        min="0"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link href="/email-automation/workflows">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || creating}
              >
                {isLoading || creating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Workflow'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}