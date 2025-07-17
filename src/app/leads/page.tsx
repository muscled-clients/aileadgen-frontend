'use client';

interface Lead {
  id: string;
  name: string;
  phone_number: string;
  status: 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed';
  last_call_time?: string;
  created_at: string;
  source?: 'call_system' | 'landing_page' | 'import' | 'manual';
  qualified?: boolean;
  email?: string;
  monthly_revenue?: string;
  marketing_budget?: string;
  pain_point?: string;
  notes?: string;
  niche?: string;
  completion_status?: 'incomplete' | 'partial' | 'complete';
}


import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { createCampaign } from '@/hooks/useCampaigns';

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [nicheFilter, setNicheFilter] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const { data: leads, isLoading: loading, error, refetch } = useLeads();

  const filteredLeads = (leads || []).filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (lead.niche && lead.niche.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    const matchesNiche = nicheFilter === '' || (lead.niche && lead.niche.toLowerCase() === nicheFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesNiche;
  });

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const getUniqueNiches = () => {
    const niches = (leads || []).map(lead => lead.niche).filter(Boolean);
    return [...new Set(niches)];
  };

  const getProgressionStatus = (lead: Lead) => {
    const { qualified, monthly_revenue, pain_point, marketing_budget } = lead;
    
    // Check if rejected
    if (qualified === false) {
      if (!monthly_revenue || monthly_revenue === 'Under $20K') {
        return {
          status: 'rejected',
          text: 'Rejected at Revenue',
          icon: '❌',
          color: 'bg-red-100 text-red-800'
        };
      }
      if (!marketing_budget || marketing_budget === 'Less than $2K') {
        return {
          status: 'rejected',
          text: 'Rejected at Budget',
          icon: '❌',
          color: 'bg-red-100 text-red-800'
        };
      }
    }
    
    // Check if qualified
    if (qualified === true) {
      return {
        status: 'complete',
        text: 'Complete',
        icon: '✅',
        color: 'bg-green-100 text-green-800'
      };
    }
    
    // Check progression based on fields
    if (!monthly_revenue) {
      return {
        status: 'incomplete',
        text: 'Stopped at Revenue',
        icon: '⏸️',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    if (!pain_point) {
      return {
        status: 'partial',
        text: 'Stopped at Pain Point',
        icon: '⏸️',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    if (!marketing_budget) {
      return {
        status: 'partial',
        text: 'Stopped at Budget',
        icon: '⏸️',
        color: 'bg-yellow-100 text-yellow-800'
      };
    }
    
    // All fields filled but not yet qualified
    return {
      status: 'processing',
      text: 'Processing',
      icon: '⏳',
      color: 'bg-blue-100 text-blue-800'
    };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error?.message || 'Failed to fetch leads'}
          </div>
          <button 
            onClick={() => refetch()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600">Manage your leads and track call outcomes</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Search leads by name, phone, email, or niche..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="called">Called</option>
            <option value="booked">Booked</option>
            <option value="callback">Callback</option>
            <option value="not_answered">Not Answered</option>
            <option value="failed">Failed</option>
          </select>
          <select 
            value={nicheFilter}
            onChange={(e) => setNicheFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">All Niches</option>
            {getUniqueNiches().map(niche => (
              <option key={niche} value={niche}>{niche}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {selectedLeads.length > 0 && (
            <button 
              onClick={() => setShowCampaignModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
            >
              Create Campaign ({selectedLeads.length})
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pain Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 && !loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg font-medium mb-2">No leads found</div>
                      <div className="text-sm">Leads will appear here when they are created from the landing page or imported.</div>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => handleSelectLead(lead.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.phone_number}</div>
                    {lead.email && (
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.monthly_revenue || <span className="text-gray-400">Not answered</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.pain_point || <span className="text-gray-400">Not answered</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lead.marketing_budget || <span className="text-gray-400">Not answered</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const progression = getProgressionStatus(lead);
                      const timeDiff = new Date().getTime() - new Date(lead.created_at).getTime();
                      const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
                      const timeText = hoursAgo < 1 ? 'Just now' : 
                                     hoursAgo === 1 ? '1 hour ago' : 
                                     hoursAgo < 24 ? `${hoursAgo} hours ago` : 
                                     `${Math.floor(hoursAgo / 24)} days ago`;
                      
                      return (
                        <div className="flex flex-col">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${progression.color} mb-1`}>
                            <span className="mr-1">{progression.icon}</span>
                            {progression.text}
                          </span>
                          <span className="text-xs text-gray-500">{timeText}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.qualified === true && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        ✅ Qualified
                      </span>
                    )}
                    {lead.qualified === false && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        ❌ Rejected
                      </span>
                    )}
                    {lead.qualified === null && (
                      <span className="text-gray-400 text-xs">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(lead.created_at).toLocaleDateString('en-US', { 
                        timeZone: 'America/New_York',
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleTimeString('en-US', { 
                        timeZone: 'America/New_York',
                        hour12: true,
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{filteredLeads.length}</span> of{' '}
          <span className="font-medium">{leads.length}</span> results
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <CampaignModal
          selectedLeads={selectedLeads}
          leads={leads}
          onClose={() => setShowCampaignModal(false)}
          onSuccess={() => {
            setShowCampaignModal(false);
            setSelectedLeads([]);
          }}
        />
      )}
      </div>
    </DashboardLayout>
  );
}

// Campaign Modal Component
function CampaignModal({ selectedLeads, leads, onClose, onSuccess }: {
  selectedLeads: string[];
  leads: Lead[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedLeadDetails = leads.filter(lead => selectedLeads.includes(lead.id));
  const primaryNiche = selectedLeadDetails.length > 0 ? selectedLeadDetails[0].niche : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const campaignData = {
        name: campaignName,
        description: description,
        lead_ids: selectedLeads,
        niche: primaryNiche,
        settings: {}
      };

      await createCampaign(campaignData);
      
      // Show success message
      alert(`Campaign "${campaignName}" created successfully with ${selectedLeads.length} leads!`);
      
      onSuccess();
    } catch (error) {
      alert(`Error creating campaign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Campaign</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Name *
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm text-gray-600 mb-2">Campaign Details:</div>
            <div className="text-sm"><strong>Leads:</strong> {selectedLeads.length}</div>
            <div className="text-sm"><strong>Primary Niche:</strong> {primaryNiche || 'Mixed'}</div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !campaignName.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium rounded-md transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 