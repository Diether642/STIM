import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/accommodations', label: 'Accommodations' },
  { to: '/food-beverage', label: 'Food & Beverage' },
  { to: '/products', label: 'Products' },
  { to: '/events', label: 'Events' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin, isBusinessOwner } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getDashboardLink = () => {
    if (isAdmin) return '/admin'
    if (isBusinessOwner) return '/business'
    return '/dashboard'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="\public\images\logo.png" alt="Sorsogon" className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:text-primary-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <FiUser size={16} />
                  <span>{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link to={getDashboardLink()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setDropdownOpen(false)}>
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 font-medium">Login</Link>
                <Link to="/get-started" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2">
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 pt-4">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm text-gray-600 hover:text-primary-600">
                {link.label}
              </NavLink>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary-600">Dashboard</Link>
                  <button onClick={handleLogout} className="block px-3 py-2 text-sm text-gray-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-600">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-primary-600">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}