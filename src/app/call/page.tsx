'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, useRef } from 'react';
import { getApiUrl, getWebSocketUrl } from '@/lib/config';

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

export default function CallInterfacePage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callSid, setCallSid] = useState<string | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callOutcome, setCallOutcome] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection for live updates
  useEffect(() => {
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(getWebSocketUrl('/ws/call-monitor'));
      
      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        
        if (data.type === 'call_status') {
          // Find our specific call
          const callData = callSid ? data.data[callSid] : Object.values(data.data)[0];
          
          if (callData) {
            console.log('Call data received:', callData);
            setCallStatus(callData);
            
            // Update transcript if it exists
            if (callData.transcript && callData.transcript.length > 0) {
              setTranscript(callData.transcript);
            }
            
            // Update call state based on status
            if (callData.status === 'completed' || callData.status === 'failed') {
              setIsCallActive(false);
            } else if (callData.status === 'in-progress' || callData.status === 'ringing' || callData.status === 'initiated') {
              setIsCallActive(true);
            }
          } else if (callSid && !data.data[callSid]) {
            // Call not found in active calls - probably ended
            setIsCallActive(false);
          }
        }
      };
      
      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        // Reconnect after 3 seconds
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

  const initiateCall = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/test/retell-call'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      });

      const result = await response.json();

      if (result.success) {
        setCallSid(result.call_id);
        setIsCallActive(true);
        setTranscript([]);
        setCallOutcome('');
        console.log('Retell.ai call initiated successfully:', result.call_id);
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

  const endCall = async () => {
    if (!callSid) return;

    setIsLoading(true);
    
    try {
      const response = await fetch(getApiUrl('/test/end-call'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ call_sid: callSid }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsCallActive(false);
        // Don't clear callSid and transcript immediately - let WebSocket handle updates
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
          <h1 className="text-2xl font-bold text-gray-900">AI Call Interface</h1>
          <p className="text-gray-600">Initiate AI-powered calls with natural conversation using Retell.ai</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Controls</h2>
              
              {/* Phone Number Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 555-123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Call SID Display */}
              {callSid && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call SID</label>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">{callSid}</p>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Call Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isCallActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isCallActive ? (callStatus?.status || 'Active') : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Duration</span>
                  <span className="text-sm text-gray-900">
                    {callStatus?.duration ? `${Math.floor(callStatus.duration / 60)}:${(callStatus.duration % 60).toString().padStart(2, '0')}` : '00:00'}
                  </span>
                </div>
              </div>

              {/* Call Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={initiateCall}
                  disabled={isCallActive || isLoading}
                  className={`w-full font-medium py-3 px-4 rounded-md transition-colors ${
                    isCallActive || isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isLoading ? 'Initiating...' : isCallActive ? 'AI Call Active' : 'Start AI Call'}
                </button>
                <button 
                  onClick={endCall}
                  disabled={!isCallActive}
                  className={`w-full font-medium py-3 px-4 rounded-md transition-colors ${
                    !isCallActive
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  End Call
                </button>
              </div>

              {/* Call Outcome */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">Call Outcome</label>
                <select 
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select outcome...</option>
                  <option value="booked">Booked</option>
                  <option value="callback">Callback</option>
                  <option value="not_answered">Not Answered</option>
                  <option value="not_interested">Not Interested</option>
                  <option value="failed">Failed</option>
                </select>
                {callOutcome && (
                  <p className="mt-2 text-sm text-gray-600">
                    Outcome: <span className="font-medium">{callOutcome}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Live Transcript */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Transcript</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto">
                {transcript.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center">
                      {isCallActive ? 'Waiting for conversation...' : 'No active call. Start a call to see live transcription.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transcript.map((message, index) => (
                      <div key={index} className={`flex ${message.speaker === 'ai' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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

              {/* Connection Status */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    wsRef.current?.readyState === WebSocket.OPEN ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {wsRef.current?.readyState === WebSocket.OPEN ? 'Connected to live updates' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Information */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Test Number</label>
              <p className="text-sm text-gray-900 mt-1">{phoneNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Call ID (Retell.ai)</label>
              <p className="text-sm text-gray-900 mt-1 font-mono">{callSid || 'None'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service</label>
              <p className="text-sm text-gray-900 mt-1">Retell.ai</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <p className="text-sm text-gray-900 mt-1">{isCallActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes about this call..."
            ></textarea>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 