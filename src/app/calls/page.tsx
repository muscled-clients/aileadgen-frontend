'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, useRef } from 'react';
import { useFilteredCallLogs } from '@/hooks/useCallLogs';
import { useActiveCampaigns, updateCampaignStatus } from '@/hooks/useCampaigns';
import { useLeads } from '@/hooks/useLeads';

interface CallLog {
  id: number;
  date: string;
  leadName: string;
  campaignName: string;
  duration: string;
  outcome: 'booked' | 'callback' | 'not_answered' | 'failed' | 'completed';
  status: 'completed' | 'in_progress' | 'failed';
  leadId?: string;
}

interface TranscriptMessage {
  speaker: 'ai' | 'customer';
  text: string;
  timestamp: string;
}

interface CallStatus {
  status: string;
  duration: number;
  transcript: TranscriptMessage[];
}


interface Lead {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  niche?: string;
  status: string;
}

function OutcomeBadge({ outcome }: { outcome: CallLog['outcome'] }) {
  const colors = {
    booked: 'bg-green-100 text-green-800',
    callback: 'bg-yellow-100 text-yellow-800',
    not_answered: 'bg-red-100 text-red-800',
    failed: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[outcome]}`}>
      {outcome.replace('_', ' ')}
    </span>
  );
}


export default function CallsPage() {
  // State management
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [campaignFilter, setCampaignFilter] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simple hooks
  const { data: filteredCallLogs } = useFilteredCallLogs(searchTerm, campaignFilter, outcomeFilter);
  const { data: activeCampaigns, refetch: refetchActiveCampaigns } = useActiveCampaigns();
  const { data: leads } = useLeads();

  // Live call state
  const [callSid, setCallSid] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection for live updates
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket('ws://localhost:8000/ws/call-monitor');
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        
        if (data.type === 'call_status') {
          const callData = callSid ? data.data[callSid] : Object.values(data.data)[0];
          
          if (callData) {
            console.log('Call data received:', callData);
            setCallStatus(callData);
            
            if (callData.transcript && callData.transcript.length > 0) {
              setTranscript(callData.transcript);
            }
            
            if (callData.status === 'completed' || callData.status === 'failed') {
              setIsCallActive(false);
            } else if (callData.status === 'in-progress' || callData.status === 'ringing' || callData.status === 'initiated') {
              setIsCallActive(true);
            }
          } else if (callSid && !data.data[callSid]) {
            setIsCallActive(false);
          }
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setTimeout(connectWebSocket, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [callSid]);

  const initiateLeadCall = async () => {
    if (!selectedLead) {
      setError('Please select a lead');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/test/retell-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: selectedLead.phone_number }),
      });

      const result = await response.json();

      if (result.success) {
        setCallSid(result.call_id);
        setIsCallActive(true);
        setTranscript([]);
        console.log('Call initiated for lead:', selectedLead.name);
      } else {
        setError(result.error || 'Failed to initiate call');
      }
    } catch (err) {
      setError('Failed to connect to backend');
      console.error('Call initiation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'pause' | 'resume') => {
    try {
      await updateCampaignStatus(campaignId, action);
      refetchActiveCampaigns();
      console.log(`Campaign ${action}d successfully`);
    } catch (err) {
      console.error(`Error ${action}ing campaign:`, err);
    }
  };

  const uniqueCampaigns = [...new Set((filteredCallLogs || []).map(call => call.campaignName))];

  const endCall = async () => {
    if (!callSid) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/test/end-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ call_sid: callSid }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsCallActive(false);
      } else {
        setError(result.error || 'Failed to end call');
      }
    } catch (err) {
      setError('Failed to end call');
      console.error('End call error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calls</h1>
          <p className="text-gray-600">Campaign call history and live call management</p>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Left Column - Call History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Call History</h2>
            
            {/* Filters */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Search calls..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <select 
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Campaigns</option>
                {uniqueCampaigns.map(campaign => (
                  <option key={campaign} value={campaign}>{campaign}</option>
                ))}
              </select>
              <select 
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Outcomes</option>
                <option value="booked">Booked</option>
                <option value="callback">Callback</option>
                <option value="not_answered">Not Answered</option>
                <option value="failed">Failed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Call History Table */}
            <div className="h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(filteredCallLogs || []).map((call) => (
                    <tr key={call.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${selectedCall?.id === call.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedCall(call)}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {new Date(call.date).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                        {call.leadName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                        {call.campaignName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {call.duration}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <OutcomeBadge outcome={call.outcome} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Split into two sections */}
          <div className="space-y-4">
            {/* Top Right - Active Campaign Monitoring */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Campaigns</h2>
              
              <div className="space-y-3">
                {(activeCampaigns || []).map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{campaign.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        campaign.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress: {campaign.called_leads}/{campaign.total_leads}</span>
                      <span>{Math.round((campaign.called_leads / campaign.total_leads) * 100)}%</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {campaign.status === 'running' ? (
                        <button 
                          onClick={() => handleCampaignAction(campaign.id, 'pause')}
                          className="px-2 py-1 text-xs bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
                        >
                          Pause
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleCampaignAction(campaign.id, 'resume')}
                          className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                        >
                          Resume
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Right - Quick Call Feature */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Call</h2>
              
              {/* Lead Selection */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Lead</label>
                <select 
                  value={selectedLead?.id || ''}
                  onChange={(e) => setSelectedLead((leads || []).find(l => l.id === e.target.value) || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Choose a lead...</option>
                  {(leads || []).map(lead => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name} ({lead.phone_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Lead Info */}
              {selectedLead && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Name:</strong> {selectedLead.name}</div>
                    <div><strong>Phone:</strong> {selectedLead.phone_number}</div>
                    <div><strong>Email:</strong> {selectedLead.email || 'N/A'}</div>
                    <div><strong>Niche:</strong> {selectedLead.niche || 'N/A'}</div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Call Button */}
              <button 
                onClick={initiateLeadCall}
                disabled={!selectedLead || isCallActive || isLoading}
                className={`w-full font-medium py-2 px-4 rounded-md transition-colors text-sm ${
                  !selectedLead || isCallActive || isLoading
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? 'Initiating...' : isCallActive ? 'Call in Progress' : 'Start Call'}
              </button>

              {/* Call SID Display */}
              {callSid && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call ID</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">{callSid}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-4">
          {/* Live Transcript - 2/3 width */}
          <div className="col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  wsRef.current?.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-600">
                  {wsRef.current?.readyState === WebSocket.OPEN ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    {isCallActive ? 'Waiting for conversation...' : 'No active call. Start a call to see live transcription.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transcript.map((message, index) => (
                    <div key={index} className={`flex ${message.speaker === 'ai' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md px-4 py-2 rounded-lg ${
                        message.speaker === 'ai' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-900 border border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium opacity-75">
                            {message.speaker === 'ai' ? 'AI' : 'Customer'}
                          </span>
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Call Details - 1/3 width */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Details</h2>
            
            {selectedCall || isCallActive ? (
              <div className="space-y-4">
                {/* Show active call details if there's an active call, otherwise show selected call */}
                {isCallActive ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Active Call</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Lead:</strong> {selectedLead?.name || 'Unknown'}</div>
                      <div><strong>Phone:</strong> {selectedLead?.phone_number || 'Unknown'}</div>
                      <div><strong>Duration:</strong> {callStatus?.duration ? `${Math.floor(callStatus.duration / 60)}:${(callStatus.duration % 60).toString().padStart(2, '0')}` : '00:00'}</div>
                      <div><strong>Status:</strong> 
                        <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${
                          isCallActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {callStatus?.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={endCall}
                      disabled={!isCallActive}
                      className={`mt-4 w-full font-medium py-2 px-4 rounded-md transition-colors ${
                        !isCallActive
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      End Call
                    </button>
                  </div>
                ) : selectedCall ? (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Historical Call</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Lead:</strong> {selectedCall.leadName}</div>
                      <div><strong>Campaign:</strong> {selectedCall.campaignName}</div>
                      <div><strong>Date:</strong> {selectedCall.date}</div>
                      <div><strong>Duration:</strong> {selectedCall.duration}</div>
                      <div><strong>Outcome:</strong> <OutcomeBadge outcome={selectedCall.outcome} /></div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Add notes about this call..."
                      ></textarea>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">Select a call from history or start a new call to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 