import DashboardLayout from '@/components/DashboardLayout';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mockCallHistory = [
    { id: 1, date: '2024-01-15 10:30', duration: '3:45', outcome: 'Booked', notes: 'Scheduled follow-up call' },
    { id: 2, date: '2024-01-10 14:20', duration: '2:15', outcome: 'Callback', notes: 'Requested call back next week' },
    { id: 3, date: '2024-01-05 09:45', duration: '1:30', outcome: 'Not Answered', notes: 'No response' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lead Detail #{id}</h1>
          <p className="text-gray-600">Detailed information and call history</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Lead Information</h2>
                <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
                  Edit
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900 mt-1">John Doe</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-sm text-gray-900 mt-1">+1 (555) 123-4567</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900 mt-1">john.doe@example.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Booked
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time Zone</label>
                  <p className="text-sm text-gray-900 mt-1">EST (UTC-5)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="text-sm text-gray-900 mt-1">2024-01-01</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Call</label>
                  <p className="text-sm text-gray-900 mt-1">2024-01-15 10:30</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md">
                  Call Now
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
                  Schedule Call
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md">
                  Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Call History & Notes */}
          <div className="lg:col-span-2">
            {/* Call History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Call History</h2>
              
              <div className="space-y-4">
                {mockCallHistory.map((call) => (
                  <div key={call.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">{call.date}</span>
                        <span className="text-sm text-gray-600">Duration: {call.duration}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        call.outcome === 'Booked' ? 'bg-green-100 text-green-800' :
                        call.outcome === 'Callback' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {call.outcome}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{call.notes}</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900 text-sm">
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-900 text-sm">
                        Listen
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 text-sm">
                        Transcript
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <textarea
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this lead..."
                defaultValue="John is a potential customer for our digital marketing services. He owns a small retail business and is looking to expand his online presence. Very responsive and seems genuinely interested in our services. He prefers to be contacted in the afternoons and is available for calls on weekdays."
              />
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Save Notes
                </button>
              </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Call completed - Booked</p>
                    <p className="text-sm text-gray-600">Jan 15, 2024 at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Callback requested</p>
                    <p className="text-sm text-gray-600">Jan 10, 2024 at 2:20 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Call not answered</p>
                    <p className="text-sm text-gray-600">Jan 5, 2024 at 9:45 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Lead created</p>
                    <p className="text-sm text-gray-600">Jan 1, 2024 at 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 