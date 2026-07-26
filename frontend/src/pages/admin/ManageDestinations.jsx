import { useEffect, useState } from 'react'
import { getAdminDestinations, createDestination, deleteDestination, getMunicipalities, getBarangays, getCategories } from '../../api/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ManageDestinations() {
  const [items, setItems] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    municipality_id: '1',
    barangay_id: '',
    address: '',
    latitude: '',
    longitude: '',
    operating_hours: '',
    entrance_fee: '',
    contact_number: '',
    status: 'published',
  })

  useEffect(() => {
    loadData()
    loadMeta()
  }, [])

  useEffect(() => {
    if (formData.municipality_id) {
      getBarangays(formData.municipality_id).then(setBarangays)
    }
  }, [formData.municipality_id])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAdminDestinations()
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const loadMeta = async () => {
    const [m, c] = await Promise.all([getMunicipalities(), getCategories('destination')])
    setMunicipalities(m)
    setCategories(c)
    const b = await getBarangays(1)
    setBarangays(b)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = new FormData()

      // Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key === 'images') return // handle separately
        if (formData[key] !== '' && formData[key] !== null) {
          payload.append(key, formData[key])
        }
      })

      // Append image files
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          payload.append('images[]', file)
        })
      }

      await createDestination(payload)
      toast.success('Destination created')
      setShowForm(false)
      setFormData({
        name: '', description: '', category_id: '', municipality_id: '1', barangay_id: '',
        address: '', latitude: '', longitude: '', operating_hours: '', entrance_fee: '',
        contact_number: '', status: 'published',
      })
      loadData()
    } catch (e) {
      const errors = e.response?.data?.errors
      if (errors) Object.values(errors).flat().forEach((msg) => toast.error(msg))
      else toast.error('Failed to create destination')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this destination?')) return
    try {
      await deleteDestination(id)
      toast.success('Destination deleted')
      loadData()
    } catch {
      toast.error('Failed to delete destination')
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-primary-600 font-medium mb-2">Admin</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Manage Destinations</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Close Form' : 'Add Destination'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-100 mb-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input className="input-field" placeholder="Destination name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <select className="input-field" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <textarea className="input-field" rows={4} placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <input className="input-field" placeholder="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <select className="input-field" value={formData.municipality_id} onChange={(e) => setFormData({ ...formData, municipality_id: e.target.value, barangay_id: '' })}>
              {municipalities.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <select className="input-field" value={formData.barangay_id} onChange={(e) => setFormData({ ...formData, barangay_id: e.target.value })} required>
              <option value="">Select barangay</option>
              {barangays.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input type="number" step="0.0000001" className="input-field" placeholder="Latitude" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} required />
            <input type="number" step="0.0000001" className="input-field" placeholder="Longitude" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} required />
            <input className="input-field" placeholder="Operating hours" value={formData.operating_hours} onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Images
            </label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">Upload up to 10 images (JPEG, PNG, WebP, max 5MB each)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input type="number" step="0.01" className="input-field" placeholder="Entrance fee" value={formData.entrance_fee} onChange={(e) => setFormData({ ...formData, entrance_fee: e.target.value })} />
            <input className="input-field" placeholder="Contact number" value={formData.contact_number} onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })} />
            <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Save Destination</button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Category</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Views</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category?.name}</td>
                  <td className="px-6 py-4 text-sm capitalize">{item.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.view_count}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}