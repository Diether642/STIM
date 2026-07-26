import { useEffect, useState } from 'react'
import { getAccommodations } from '../../api/accommodations'
import ListingCard from '../../components/cards/ListingCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'

export default function Accommodations() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', type: '', price_range: '', page: 1 })

  useEffect(() => {
    loadItems()
  }, [filters])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getAccommodations(filters)
      setItems(data.data || [])
      setPagination({ current_page: data.current_page, last_page: data.last_page })
    } finally {
      setLoading(false)
    }
  }

  if (loading && items.length === 0) return <LoadingSpinner size="lg" />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-primary-600 font-medium mb-2">Stay</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Accommodations</h1>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="input-field"
            placeholder="Search accommodations..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
          />
          <select className="input-field" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
            <option value="">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="resort">Resort</option>
            <option value="inn">Inn</option>
            <option value="homestay">Homestay</option>
          </select>
          <select className="input-field" value={filters.price_range} onChange={(e) => setFilters({ ...filters, price_range: e.target.value, page: 1 })}>
            <option value="">All Price Ranges</option>
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} basePath="/accommodations" typeLabel={item.type} />
          ))}
        </div>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} onPageChange={(page) => setFilters({ ...filters, page })} />
      </div>
    </div>
  )
}