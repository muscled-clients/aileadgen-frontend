import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/config';

interface CallLog {
  id: number;
  date: string;
  leadName: string;
  campaignName: string;
  duration: string;
  outcome: 'booked' | 'callback' | 'not_answered' | 'failed' | 'completed';
  status: 'completed' | 'in_progress' | 'failed';
  leadId?: string;
  campaignId?: string;
}

// Mock data for now - replace with actual API when ready
const mockCallLogs: CallLog[] = [
  { id: 1, date: '2024-01-15 10:30', leadName: 'John Doe', campaignName: 'Tech Startup Outreach', duration: '3:45', outcome: 'booked', status: 'completed' },
  { id: 2, date: '2024-01-15 11:15', leadName: 'Jane Smith', campaignName: 'E-commerce Campaign', duration: '2:12', outcome: 'callback', status: 'completed' },
  { id: 3, date: '2024-01-15 14:20', leadName: 'Mike Johnson', campaignName: 'Tech Startup Outreach', duration: '0:45', outcome: 'not_answered', status: 'completed' },
  { id: 4, date: '2024-01-15 15:30', leadName: 'Sarah Wilson', campaignName: 'Healthcare Campaign', duration: '4:33', outcome: 'booked', status: 'completed' },
  { id: 5, date: '2024-01-15 16:45', leadName: 'Tom Brown', campaignName: 'E-commerce Campaign', duration: '1:20', outcome: 'failed', status: 'failed' },
  { id: 6, date: '2024-01-15 17:00', leadName: 'Lisa Davis', campaignName: 'Healthcare Campaign', duration: '2:55', outcome: 'completed', status: 'completed' },
];

export const useCallLogs = () => {
  const [data, setData] = useState<CallLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCallLogs = async () => {
    try {
      setError(null);
      // Try to fetch from active calls endpoint
      const response = await fetch(getApiUrl('/api/calls/active'));
      if (!response.ok) {
        // If endpoint doesn't work, fall back to mock data
        console.warn('Call logs endpoint not available, using mock data');
        await new Promise(resolve => setTimeout(resolve, 100));
        setData(mockCallLogs);
        return;
      }
      const callLogs = await response.json();
      setData(callLogs);
    } catch (err) {
      console.warn('Failed to fetch call logs, using mock data:', err);
      // Fall back to mock data on error
      setData(mockCallLogs);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchCallLogs();
  };

  useEffect(() => {
    fetchCallLogs();
    
    // Poll every 10 seconds for call logs (less frequent since they change less often)
    const interval = setInterval(fetchCallLogs, 10000);
    
    // Refetch when window gains focus
    const handleFocus = () => fetchCallLogs();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { data, isLoading, error, refetch };
};

// Hook for filtering call logs
export const useFilteredCallLogs = (searchTerm: string, campaignFilter: string, outcomeFilter: string) => {
  const { data: callLogs, isLoading, error, refetch } = useCallLogs();
  
  const filteredLogs = callLogs.filter(call => {
    const matchesCampaign = campaignFilter === '' || call.campaignName === campaignFilter;
    const matchesOutcome = outcomeFilter === '' || call.outcome === outcomeFilter;
    const matchesSearch = searchTerm === '' || 
      call.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCampaign && matchesOutcome && matchesSearch;
  });
  
  return {
    data: filteredLogs,
    isLoading,
    error,
    refetch
  };
};