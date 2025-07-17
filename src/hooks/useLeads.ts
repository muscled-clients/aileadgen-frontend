import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/config';

console.log('🔍 useLeads hook loaded, getApiUrl:', getApiUrl);

interface Lead {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  status: 'new' | 'called' | 'booked' | 'callback' | 'not_answered' | 'failed';
  niche?: string;
  qualified?: boolean;
  created_at: string;
  source?: 'call_system' | 'landing_page' | 'import' | 'manual';
  monthly_revenue?: string;
  marketing_budget?: string;
  pain_point?: string;
  notes?: string;
}

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  totalCalls: number;
  todaysCalls: number;
  successfulCalls: number;
  failedCalls: number;
  calledLeads: number;
  bookedLeads: number;
  callbackLeads: number;
  notAnsweredLeads: number;
  failedLeads: number;
  unqualifiedLeads: number;
  averageDuration: number;
}

export const useLeads = () => {
  const [data, setData] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeads = async () => {
    try {
      setError(null);
      const response = await fetch('https://aileadgen-backend-production.up.railway.app/api/leads');
      if (!response.ok) {
        throw new Error('Failed to fetch leads');
      }
      const leads = await response.json();
      setData(leads);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchLeads();
  };

  useEffect(() => {
    fetchLeads();
    
    // Poll every 5 seconds for near real-time updates
    const interval = setInterval(fetchLeads, 5000);
    
    // Refetch when window gains focus
    const handleFocus = () => fetchLeads();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { data, isLoading, error, refetch };
};

export const useDashboardStats = () => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const url = 'https://aileadgen-backend-production.up.railway.app/dashboard/stats';
      console.log('🔍 Fetching dashboard stats from:', url);
      const response = await fetch(url);
      console.log('📊 Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status} ${response.statusText}`);
      }
      const stats = await response.json();
      console.log('📈 Dashboard stats:', stats);
      setData(stats);
    } catch (err) {
      console.error('❌ Dashboard stats error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    setIsLoading(true);
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
    
    // Poll every 10 seconds for dashboard stats
    const interval = setInterval(fetchStats, 10000);
    
    // Refetch when window gains focus
    const handleFocus = () => fetchStats();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return { data, isLoading, error, refetch };
};