import DashboardLayout from '@/components/DashboardLayout';

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mockTranscript = [
    { speaker: 'AI', text: 'Hello! I\'m calling on behalf of our company. How are you doing today?', time: '10:30:15', confidence: 0.95 },
    { speaker: 'Customer', text: 'Hi, I\'m doing well, thanks. What is this about?', time: '10:30:22', confidence: 0.92 },
    { speaker: 'AI', text: 'I\'d love to schedule a brief 15-minute call with you to discuss how we can help with your business needs. Would you be available this week?', time: '10:30:28', confidence: 0.98 },
    { speaker: 'Customer', text: 'That sounds interesting. What day works best?', time: '10:30:35', confidence: 0.89 },
    { speaker: 'AI', text: 'Great! I have availability on Tuesday or Wednesday. Which would work better for you?', time: '10:30:42', confidence: 0.94 },
    { speaker: 'Customer', text: 'Tuesday would be perfect. What time?', time: '10:30:48', confidence: 0.91 },
    { speaker: 'AI', text: 'Excellent! How about 2:00 PM? I\'ll send you a calendar invite with all the details.', time: '10:30:55', confidence: 0.97 },
    { speaker: 'Customer', text: 'Perfect, I\'ll be there. Thank you!', time: '10:31:02', confidence: 0.88 },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Call Detail #{id}</h1>
          <p className="text-gray-600">Detailed view of call transcript and recording</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Call Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Lead Name</label>
                  <p className="text-sm text-gray-900 mt-1">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <p className="text-sm text-gray-900 mt-1">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="text-sm text-gray-900 mt-1">2024-01-15 10:30 AM</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration</label>
                  <p className="text-sm text-gray-900 mt-1">3 minutes 45 seconds</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Outcome</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Booked
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">AI Agent Version</label>
                  <p className="text-sm text-gray-900 mt-1">v1.0.0</p>
                </div>
              </div>
            </div>

            {/* Audio Recording */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Audio Recording</h2>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">call-20240115-1030.mp3</span>
                    <span className="text-xs text-gray-500">2.1 MB</span>
                  </div>
                  <audio controls className="w-full">
                    <source src="/path/to/recording.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                    Download
                  </button>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Full Transcript</h2>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm">
                  Export Transcript
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {mockTranscript.map((message, index) => (
                  <div key={index} className={`flex ${message.speaker === 'AI' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-2xl px-4 py-3 rounded-lg ${
                      message.speaker === 'AI' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${
                            message.speaker === 'AI' ? 'text-blue-800' : 'text-gray-800'
                          }`}>
                            {message.speaker}
                          </span>
                          <span className="text-xs text-gray-500">
                            Confidence: {(message.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Notes */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Notes</h2>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this call..."
                defaultValue="Customer was very interested in our services. Scheduled a follow-up call for Tuesday at 2:00 PM. They mentioned they are currently using a competitor but are open to switching if we can provide better value."
              />
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 