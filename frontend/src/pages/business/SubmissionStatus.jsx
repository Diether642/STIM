import { useEffect, useState } from 'react'
import { getBusinessSubmissions } from '../../api/business'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function SubmissionStatus() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBusinessSubmissions().then((data) => setSubmissions(data.data || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Business Owner Portal</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Submission Status</h1>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading font-semibold text-xl text-gray-900">{submission.business_name}</h3>
                  <p className="text-sm text-gray-500 capitalize mt-1">{submission.type.replace('_', ' ')}</p>
                  <p className="text-gray-600 mt-3">{submission.description}</p>
                  {submission.admin_notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-600">{submission.admin_notes}</p>
                    </div>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${submission.status === 'approved' ? 'bg-green-100 text-green-700' : submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {submission.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}