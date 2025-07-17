import { useState, useEffect } from 'react';

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

export const useCampaigns = () => {
  const [data, setData] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8000/api/campaigns');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const campaigns = await response.json();
      setData(campaigns);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchCampaigns();
  };

  useEffect(() => {
    fetchCampaigns();
    
    // Poll every 5 seconds for near real-time updates
    const interval = setInterval(fetchCampaigns, 5000);
    
    // Refetch when window gains focus
    const handleFocus = () => fetchCampaigns();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { data, isLoading, error, refetch };
};

export const useCampaign = (id: string) => {
  const [data, setData] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaign = async () => {
    if (!id) return;
    
    try {
      setError(null);
      const response = await fetch(`http://localhost:8000/api/campaigns/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign');
      }
      const campaign = await response.json();
      setData(campaign);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchCampaign();
  };

  useEffect(() => {
    fetchCampaign();
    
    // Poll every 5 seconds for near real-time updates
    const interval = setInterval(fetchCampaign, 5000);
    
    // Refetch when window gains focus
    const handleFocus = () => fetchCampaign();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [id]);

  return { data, isLoading, error, refetch };
};

// Campaign actions
export const createCampaign = async (campaignData: any) => {
  const response = await fetch('http://localhost:8000/api/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(campaignData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create campaign: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export const updateCampaignStatus = async (id: string, action: 'start' | 'pause' | 'resume') => {
  const response = await fetch(`http://localhost:8000/api/campaigns/${id}/${action}`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} campaign`);
  }

  return response.json();
};

export const deleteCampaign = async (id: string) => {
  const response = await fetch(`http://localhost:8000/api/campaigns/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete campaign');
  }
};

// Helper hook for active campaigns
export const useActiveCampaigns = () => {
  const { data: campaigns, isLoading, error, refetch } = useCampaigns();
  
  const activeCampaigns = campaigns.filter(campaign => 
    campaign.status === 'running' || campaign.status === 'paused'
  );
  
  return {
    data: activeCampaigns,
    isLoading,
    error,
    refetch
  };
};