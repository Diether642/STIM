import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSubmission } from '../../api/business'
import { getMunicipalities, getBarangays } from '../../api/admin'
import { SUBMISSION_TYPES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function SubmitListing() {
  const navigate = useNavigate()
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    business_name: '',
    type: 'accommodation',
    description: '',
    address: '',
    municipality_id: '1',
    barangay_id: '',
    latitude: '',
    longitude: '',
    contact_number: '',
    operating_hours: '',
    business_permit: null,
  })

  useEffect(() => {
    getMunicipalities().then(setMunicipalities)
    getBarangays(1).then(setBarangays)
  }, [])

  useEffect(() => {
    if (formData.municipality_id) {
      getBarangays(formData.municipality_id).then(setBarangays)
    }
  }, [formData.municipality_id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = new FormData()
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) payload.append(key, formData[key])
    })

    setLoading(true)
    try {
      await createSubmission(payload)
      toast.success('Submission created successfully')
      navigate('/business/submissions')
    } catch (e) {
      const errors = e.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((msg) => toast.error(msg))
      else toast.error('Failed to submit listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Business Owner Portal</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Submit Business Listing</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <input className="input-field" value={formData.business_name} onChange={(e) => setFormData({ ...formData, business_name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
            <select className="input-field" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
              {SUBMISSION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea rows={5} className="input-field" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input className="input-field" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Municipality</label>
            <select className="input-field" value={formData.municipality_id} onChange={(e) => setFormData({ ...formData, municipality_id: e.target.value, barangay_id: '' })}>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barangay</label>
            <select className="input-field" value={formData.barangay_id} onChange={(e) => setFormData({ ...formData, barangay_id: e.target.value })} required>
              <option value="">Select Barangay</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
            <input type="number" step="0.0000001" className="input-field" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
            <input type="number" step="0.0000001" className="input-field" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input className="input-field" value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
            <input className="input-field" value={formData.operating_hours} onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Permit</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFormData({ ...formData, business_permit: e.target.files[0] })} className="input-field" required />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  )
}