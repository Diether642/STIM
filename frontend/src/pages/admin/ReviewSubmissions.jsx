import { useEffect, useState } from 'react'
import { getAdminSubmissions, approveSubmission, rejectSubmission } from '../../api/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ReviewSubmissions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAdminSubmissions()
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      await approveSubmission(id, 'Approved by admin')
      toast.success('Submission approved')
      loadData()
    } catch {
      toast.error('Failed to approve')
    }
  }

  const handleReject = async (id) => {
    const notes = prompt('Enter rejection reason:')
    if (!notes) return
    try {
      await rejectSubmission(id, notes)
      toast.success('Submission rejected')
      loadData()
    } catch {
      toast.error('Failed to reject')
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Admin</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Review Business Submissions</h1>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-heading font-semibold text-xl text-gray-900">{item.business_name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'approved' ? 'bg-green-100 text-green-700' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 capitalize mb-3">{item.type.replace('_', ' ')} • Submitted by {item.user?.name}</p>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Address:</span> {item.address}</div>
                  <div><span className="text-gray-500">Contact:</span> {item.contact_number}</div>
                </div>
                {item.admin_notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700">Admin Notes</p>
                    <p className="text-sm text-gray-600 mt-1">{item.admin_notes}</p>
                  </div>
                )}
              </div>

              {item.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(item.id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
                    Approve
                  </button>
                  <button onClick={() => handleReject(item.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}