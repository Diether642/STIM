import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(formData)
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'business_owner') navigate('/business')
      else navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500">Login to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" className="input-field" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/get-started" className="text-primary-600 font-medium hover:text-primary-700">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}