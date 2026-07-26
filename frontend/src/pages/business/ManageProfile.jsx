import { useEffect, useState } from 'react'
import { getBusinessProfile, updateBusinessProfile } from '../../api/business'
import toast from 'react-hot-toast'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function ManageProfile() {
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getBusinessProfile()
      .then((data) => setFormData({ name: data.name || '', phone: data.phone || '' }))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateBusinessProfile(formData)
      toast.success('Profile updated successfully')
    } catch (e) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Business Owner Portal</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Manage Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-100 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}