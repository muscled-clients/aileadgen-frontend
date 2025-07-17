'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCampaigns, updateCampaignStatus } from '@/hooks/useCampaigns';

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

export default function CampaignsPage() {
  const { data: campaigns, isLoading: loading, error, refetch } = useCampaigns();

  const handleStartCampaign = async (campaignId: string) => {
    try {
      await updateCampaignStatus(campaignId, 'start');
      refetch(); // Manually refetch to update UI
    } catch (_err) {
      alert('Error starting campaign. Please try again.');
    }
  };

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await updateCampaignStatus(campaignId, 'pause');
      refetch(); // Manually refetch to update UI
    } catch (_err) {
      alert('Error pausing campaign. Please try again.');
    }
  };

  const handleResumeCampaign = async (campaignId: string) => {
    try {
      await updateCampaignStatus(campaignId, 'resume');
      refetch(); // Manually refetch to update UI
    } catch (_err) {
      alert('Error resuming campaign. Please try again.');
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
            Error: {error?.message || error?.toString() || 'An unexpected error occurred'}
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
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Manage your lead campaigns and track progress</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
          >
            Refresh
          </button>
        </div>

        {(campaigns || []).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500">
              <div className="text-lg font-medium mb-2">No campaigns found</div>
              <div className="text-sm">Create your first campaign from the Leads page by selecting leads and clicking "Create Campaign".</div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(campaigns || []).map((campaign) => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Leads:</span>
                    <span className="font-medium">{campaign.total_leads}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Called:</span>
                    <span className="font-medium">{campaign.called_leads}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Successful:</span>
                    <span className="font-medium text-green-600">{campaign.successful_calls}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Failed:</span>
                    <span className="font-medium text-red-600">{campaign.failed_calls}</span>
                  </div>

                  {campaign.niche && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Niche:</span>
                      <span className="font-medium">{campaign.niche}</span>
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(campaign)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(campaign)}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    Created: {new Date(campaign.created_at).toLocaleDateString('en-US', {
                      timeZone: 'America/New_York',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-2">
                  {campaign.status === 'created' && (
                    <button
                      onClick={() => handleStartCampaign(campaign.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Start Campaign
                    </button>
                  )}
                  
                  {campaign.status === 'running' && (
                    <button
                      onClick={() => handlePauseCampaign(campaign.id)}
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Pause Campaign
                    </button>
                  )}
                  
                  {campaign.status === 'paused' && (
                    <button
                      onClick={() => handleResumeCampaign(campaign.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                    >
                      Resume Campaign
                    </button>
                  )}
                  
                  <button
                    onClick={() => window.location.href = `/campaigns/${campaign.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}