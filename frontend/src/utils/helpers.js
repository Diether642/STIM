export function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function truncate(str, length = 100) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function getImageUrl(path) {
  if (!path) return 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&q=80'
  if (path.startsWith('http')) return path
  return `/storage/${path}`
}

export function getStatusBadgeClass(status) {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    archived: 'bg-gray-100 text-gray-600',
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-red-100 text-red-800',
  }
  return map[status] || 'bg-gray-100 text-gray-800'
}