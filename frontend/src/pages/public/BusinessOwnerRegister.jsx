import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../../api/auth'
import { getMunicipalities, getBarangays } from '../../api/admin'
import toast from 'react-hot-toast'
import { FiBriefcase } from 'react-icons/fi'

function Field({ label, name, type = 'text', value, onChange, error, required = true, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          type={type}
          className={`input-field ${error ? 'border-red-400' : ''}`}
          value={value || ''}
          onChange={onChange}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  )
}

export default function BusinessOwnerRegister() {
  const navigate = useNavigate()
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'business_owner',
    business_name: '',
    business_type: 'accommodation',
    business_address: '',
    municipality_id: '',
    barangay_id: '',
    business_permit_number: '',
    business_permit_file: null,
    owner_id_type: 'national_id',
    owner_id_number: '',
  })

  useEffect(() => {
    getMunicipalities().then(setMunicipalities)
  }, [])

  useEffect(() => {
    if (formData.municipality_id) {
      getBarangays(formData.municipality_id).then(setBarangays)
    }
  }, [formData.municipality_id])

  const validate = () => {
    const e = {}
    if (!formData.name.trim()) e.name = 'Full name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email'
    if (!formData.phone.trim()) e.phone = 'Phone is required'
    if (!formData.password) e.password = 'Password is required'
    else if (formData.password.length < 8) e.password = 'Minimum 8 characters'
    if (formData.password !== formData.password_confirmation) e.password_confirmation = 'Passwords do not match'
    if (!formData.business_name.trim()) e.business_name = 'Business name is required'
    if (!formData.business_address.trim()) e.business_address = 'Business address is required'
    if (!formData.municipality_id) e.municipality_id = 'Municipality is required'
    if (!formData.barangay_id) e.barangay_id = 'Barangay is required'
    if (!formData.business_permit_number.trim()) e.business_permit_number = 'Permit number is required'
    if (!formData.business_permit_file) e.business_permit_file = 'Permit document is required'
    if (!formData.owner_id_number.trim()) e.owner_id_number = 'ID number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('password', formData.password)
      payload.append('password_confirmation', formData.password_confirmation)
      payload.append('role', 'business_owner')
      payload.append('business_name', formData.business_name)
      payload.append('business_type', formData.business_type)
      payload.append('business_address', formData.business_address)
      payload.append('municipality_id', formData.municipality_id)
      payload.append('barangay_id', formData.barangay_id)
      payload.append('business_permit_number', formData.business_permit_number)
      payload.append('owner_id_type', formData.owner_id_type)
      payload.append('owner_id_number', formData.owner_id_number)
      if (formData.business_permit_file) {
        payload.append('business_permit_file', formData.business_permit_file)
      }

      await registerUser(payload)
      toast.success('Registration submitted! Your account is pending admin approval.')
      navigate('/registration-pending')
    } catch (e) {
      const serverErrors = e.response?.data?.errors
      if (serverErrors) {
        setErrors(serverErrors)
        Object.values(serverErrors).flat().forEach((msg) => toast.error(msg))
      } else {
        toast.error(e.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <FiBriefcase size={28} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Business Owner Registration</h1>
          <p className="text-gray-500 text-sm">Submit your details for verification. Account requires admin approval.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="Full Name" 
                name="name"
                value={formData.name}
                error={errors.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              <Field 
                label="Email Address" 
                name="email" 
                type="email"
                value={formData.email}
                error={errors.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <Field 
                label="Phone Number" 
                name="phone" 
                type="tel"
                value={formData.phone}
                error={errors.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
              <Field label="Owner ID Type" name="owner_id_type" error={errors.owner_id_type}>
                <select className="input-field" value={formData.owner_id_type} onChange={(e) => handleInputChange('owner_id_type', e.target.value)}>
                  <option value="national_id">National ID</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="passport">Passport</option>
                  <option value="voters_id">Voter's ID</option>
                </select>
              </Field>
              <Field 
                label="Owner ID Number" 
                name="owner_id_number"
                value={formData.owner_id_number}
                error={errors.owner_id_number}
                onChange={(e) => handleInputChange('owner_id_number', e.target.value)}
              />
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="Business Name" 
                name="business_name"
                value={formData.business_name}
                error={errors.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
              />
              <Field label="Business Type" name="business_type" error={errors.business_type}>
                <select className="input-field" value={formData.business_type} onChange={(e) => handleInputChange('business_type', e.target.value)}>
                  <option value="accommodation">Accommodation</option>
                  <option value="food_beverage">Food and Beverage</option>
                  <option value="retail_product">Retail / Local Products</option>
                </select>
              </Field>
              <Field 
                label="Business Address" 
                name="business_address"
                value={formData.business_address}
                error={errors.business_address}
                onChange={(e) => handleInputChange('business_address', e.target.value)}
              />
              <Field label="Municipality" name="municipality_id" error={errors.municipality_id}>
                <select className={`input-field ${errors.municipality_id ? 'border-red-400' : ''}`} value={formData.municipality_id} onChange={(e) => { setFormData({ ...formData, municipality_id: e.target.value, barangay_id: '' }); setErrors({ ...errors, municipality_id: '' }) }}>
                  <option value="">Select Municipality</option>
                  {municipalities.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </Field>
              <Field label="Barangay" name="barangay_id" error={errors.barangay_id}>
                <select className={`input-field ${errors.barangay_id ? 'border-red-400' : ''}`} value={formData.barangay_id} onChange={(e) => handleInputChange('barangay_id', e.target.value)}>
                  <option value="">Select Barangay</option>
                  {barangays.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <Field 
                label="Business Permit Number" 
                name="business_permit_number"
                value={formData.business_permit_number}
                error={errors.business_permit_number}
                onChange={(e) => handleInputChange('business_permit_number', e.target.value)}
              />
              <Field label="Business Permit Document" name="business_permit_file" error={errors.business_permit_file}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className={`input-field ${errors.business_permit_file ? 'border-red-400' : ''}`}
                  onChange={(e) => handleInputChange('business_permit_file', e.target.files[0])}
                />
              </Field>
            </div>
          </div>

          {/* Password */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">Account Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field 
                label="Password" 
                name="password" 
                type="password"
                value={formData.password}
                error={errors.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              <Field 
                label="Confirm Password" 
                name="password_confirmation" 
                type="password"
                value={formData.password_confirmation}
                error={errors.password_confirmation}
                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
              />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            Your account will be set to "Pending" status after submission. You will not be able to log in until an administrator reviews and approves your application.
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Registration for Approval'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}