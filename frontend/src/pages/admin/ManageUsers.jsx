import { useEffect, useState } from 'react'
import { getAdminUsers, updateAdminUser, deleteAdminUser } from '../../api/admin'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ManageUsers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getAdminUsers()
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active'
    try {
      await updateAdminUser(user.id, { status: newStatus })
      toast.success('User status updated')
      loadData()
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await deleteAdminUser(id)
      toast.success('User deleted')
      loadData()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete user')
    }
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      <div className="mb-8">
        <p className="text-primary-600 font-medium mb-2">Admin</p>
        <h1 className="text-4xl font-heading font-bold text-gray-900">Manage Users</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm capitalize text-gray-600">{user.role?.name?.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-sm capitalize">{user.status}</td>
                  <td className="px-6 py-4 flex gap-2">
                    {user.role?.name !== 'admin' && (
                      <>
                        <button onClick={() => toggleStatus(user)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          {user.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Delete
                        </button>
                      </>
                    )}
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