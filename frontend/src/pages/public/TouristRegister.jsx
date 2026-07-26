import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { FiMap } from 'react-icons/fi'

function Field({ label, name, type = 'text', value, onChange, error, required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-red-500 text-xs mt-1">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
  )
}

export default function TouristRegister() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'tourist',
  })

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (formData.phone.length < 10) newErrors.phone = 'Phone must be at least 10 digits'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await register(formData)
      navigate('/dashboard')
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

  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:8000/api/v1/auth/google/redirect?role=tourist'
  }

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <FiMap size={28} className="text-primary-600" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-2">Tourist Registration</h1>
          <p className="text-gray-500 text-sm">Create your account to explore and plan trips</p>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="font-medium text-gray-700">Sign in with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button type="submit" className="btn-primary w-full justify-center mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Tourist Account'}
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