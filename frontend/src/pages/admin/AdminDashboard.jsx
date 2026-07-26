import { useEffect, useState } from 'react'
import { getAdminDashboard } from '../../api/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminDashboard().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  const stats = data?.stats || {}

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Admin Dashboard</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-gray-500">Destinations</p><p className="text-2xl font-bold text-primary-600 mt-2">{stats.total_destinations || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Pending Submissions</p><p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending_submissions || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Users</p><p className="text-2xl font-bold text-secondary-600 mt-2">{stats.total_users || 0}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Monthly Views</p><p className="text-2xl font-bold text-green-600 mt-2">{stats.monthly_views || 0}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-4">Pending Approvals</h2>
          {data?.pending_submissions?.length === 0 ? (
            <p className="text-gray-500">No pending submissions.</p>
          ) : (
            <div className="space-y-4">
              {data?.pending_submissions?.map((item) => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-900">{item.business_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">by {item.user?.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-4">Recent Activity</h2>
          {data?.recent_activity?.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {data?.recent_activity?.map((activity) => (
                <div key={activity.id} className="p-4 border border-gray-100 rounded-lg">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}