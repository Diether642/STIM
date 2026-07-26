import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiGrid, FiPlusCircle, FiList, FiUser, FiLogOut } from 'react-icons/fi'

const sidebarLinks = [
  { to: '/business', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/business/submit', icon: FiPlusCircle, label: 'Submit Listing' },
  { to: '/business/submissions', icon: FiList, label: 'My Submissions' },
  { to: '/business/profile', icon: FiUser, label: 'Profile' },
]

export default function BusinessLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <Link to="/" className="flex items-center gap-2">
          <img src="\public\images\logo.png" alt="Sorsogon" className="h-12 w-auto" />
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm w-full">
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto p-8">
        <Outlet />
      </div>
    </div>
  )
}