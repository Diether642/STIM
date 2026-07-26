import { useNavigate } from 'react-router-dom'
import { FiMap, FiBriefcase, FiShield } from 'react-icons/fi'

const roles = [
  {
    id: 'tourist',
    icon: FiMap,
    title: 'Tourist',
    description: 'Explore destinations, plan trips with AI, and share reviews.',
    action: 'register',
  },
  {
    id: 'business_owner',
    icon: FiBriefcase,
    title: 'Business Owner',
    description: 'List your accommodation, restaurant, or retail product.',
    action: 'register',
  },
  {
    id: 'admin',
    icon: FiShield,
    title: 'Admin',
    description: 'Tourism Office staff. Login with existing credentials.',
    action: 'login',
  },
]

export default function RoleSelection() {
  const navigate = useNavigate()

  const handleSelect = (role) => {
    if (role.action === 'login') {
      navigate('/login/admin')
    } else {
      navigate(`/register/${role.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="Sosogon" className="h-12 mx-auto mb-6" onError={(e) => { e.target.style.display = 'none' }} />
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-3">Welcome to STIM</h1>
          <p className="text-gray-600">Select how you would like to use the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleSelect(role)}
              className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-primary-400 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <role.icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{role.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{role.description}</p>
              <p className="mt-4 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                {role.action === 'login' ? 'Login' : 'Get Started'} &rarr;
              </p>
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-primary-600 font-medium hover:text-primary-700">
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}