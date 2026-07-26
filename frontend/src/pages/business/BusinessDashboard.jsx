import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getBusinessDashboard } from '../../api/business'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function BusinessDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBusinessDashboard().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Business Owner Portal</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-gray-500">Total Submissions</p><p className="text-2xl font-bold text-primary-600 mt-2">{data?.stats?.total_submissions || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600 mt-2">{data?.stats?.pending || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Approved</p><p className="text-2xl font-bold text-green-600 mt-2">{data?.stats?.approved || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Rejected</p><p className="text-2xl font-bold text-red-600 mt-2">{data?.stats?.rejected || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Total Views</p><p className="text-2xl font-bold text-secondary-600 mt-2">{data?.stats?.total_views || 0}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">Recent Submissions</h2>
            <Link to="/business/submissions" className="text-primary-600 text-sm font-medium">View all</Link>
          </div>
          {data?.recent_submissions?.length === 0 ? (
            <p className="text-gray-500">No submissions yet.</p>
          ) : (
            <div className="space-y-4">
              {data?.recent_submissions?.map((submission) => (
                <div key={submission.id} className="p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{submission.business_name}</h3>
                      <p className="text-sm text-gray-500 capitalize mt-1">{submission.type.replace('_', ' ')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${submission.status === 'approved' ? 'bg-green-100 text-green-700' : submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {submission.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-heading font-semibold mb-4">Submit a New Listing</h2>
            <p className="text-gray-600 mb-6">
              Add your accommodation, food establishment, or retail product to the Sosogon platform. All submissions are reviewed by the Tourism Office before becoming public.
            </p>
          </div>
          <Link to="/business/submit" className="btn-primary">Submit Listing</Link>
        </div>
      </div>
    </div>
  )
}