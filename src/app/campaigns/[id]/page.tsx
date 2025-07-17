'use client';

import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCampaign, updateCampaignStatus, deleteCampaign } from '@/hooks/useCampaigns';
import { useLeads } from '@/hooks/useLeads';

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'created' | 'running' | 'paused' | 'completed' | 'cancelled';
  niche?: string;
  lead_ids: string[];
  total_leads: number;
  called_leads: number;
  successful_calls: number;
  failed_calls: number;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
}

// interface Lead {
//   id: string;
//   name: string;
//   phone_number: string;
//   email?: string;
//   status: 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed';
//   niche?: string;
//   qualified?: boolean;
//   created_at: string;
// }

export default function CampaignDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const { data: campaign, isLoading: loading, error, refetch: refetchCampaign } = useCampaign(campaignId);
  const { data: allLeads } = useLeads();
  
  // Filter leads for this campaign
  const leads = (allLeads || []).filter(lead => campaign?.lead_ids.includes(lead.id));


  const handleStartCampaign = async () => {
    try {
      await updateCampaignStatus(campaignId, 'start');
      refetchCampaign();
    } catch (_err) {
      alert('Error starting campaign. Please try again.');
    }
  };

  const handlePauseCampaign = async () => {
    try {
      await updateCampaignStatus(campaignId, 'pause');
      refetchCampaign();
    } catch (_err) {
      alert('Error pausing campaign. Please try again.');
    }
  };

  const handleResumeCampaign = async () => {
    try {
      await updateCampaignStatus(campaignId, 'resume');
      refetchCampaign();
    } catch (_err) {
      alert('Error resuming campaign. Please try again.');
    }
  };

  const handleDeleteCampaign = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteCampaign(campaignId);
      alert('Campaign deleted successfully');
      router.push('/campaigns');
    } catch (_err) {
      alert('Error deleting campaign. Please try again.');
    }
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-gray-100 text-gray-800';
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'called':
        return 'bg-gray-100 text-gray-800';
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'callback':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_answered':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (campaign: Campaign) => {
    if (campaign.total_leads === 0) return 0;
    return Math.round((campaign.called_leads / campaign.total_leads) * 100);
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
            Error: {error instanceof Error ? error.message : 'An error occurred'}
          </div>
          <button 
            onClick={() => router.push('/campaigns')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Back to Campaigns
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Campaign not found</h2>
            <button 
              onClick={() => router.push('/campaigns')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Back to Campaigns
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <button 
              onClick={() => router.push('/campaigns')}
              className="text-blue-600 hover:text-blue-800 text-sm mb-2"
            >
              ← Back to Campaigns
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-gray-600 mt-1">{campaign.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(campaign.status)}`}>
              {campaign.status}
            </span>
            
            {campaign.status === 'created' && (
              <button
                onClick={handleStartCampaign}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Start Campaign
              </button>
            )}
            
            {campaign.status === 'running' && (
              <button
                onClick={handlePauseCampaign}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Pause Campaign
              </button>
            )}
            
            {campaign.status === 'paused' && (
              <button
                onClick={handleResumeCampaign}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Resume Campaign
              </button>
            )}
            
            <button
              onClick={handleDeleteCampaign}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Delete Campaign
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="text-2xl font-bold text-gray-900">{campaign.total_leads}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Called</h3>
            <p className="text-2xl font-bold text-blue-600">{campaign.called_leads}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Successful</h3>
            <p className="text-2xl font-bold text-green-600">{campaign.successful_calls}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Failed</h3>
            <p className="text-2xl font-bold text-red-600">{campaign.failed_calls}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Campaign Progress</h3>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{getProgressPercentage(campaign)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(campaign)}%` }}
            />
          </div>
        </div>

        {/* Campaign Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Campaign Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.niche && (
              <div>
                <span className="text-sm font-medium text-gray-500">Niche:</span>
                <span className="ml-2 text-sm text-gray-900">{campaign.niche}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Created:</span>
              <span className="ml-2 text-sm text-gray-900">
                {new Date(campaign.created_at).toLocaleDateString('en-US', {
                  timeZone: 'America/New_York',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {campaign.started_at && (
              <div>
                <span className="text-sm font-medium text-gray-500">Started:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(campaign.started_at).toLocaleDateString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            {campaign.completed_at && (
              <div>
                <span className="text-sm font-medium text-gray-500">Completed:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {new Date(campaign.completed_at).toLocaleDateString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Leads ({leads.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qualified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLeadStatusColor(lead.status)}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.qualified !== undefined && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          lead.qualified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {lead.qualified ? 'Qualified' : 'Not Qualified'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(lead.created_at).toLocaleDateString('en-US', {
                          timeZone: 'America/New_York',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}