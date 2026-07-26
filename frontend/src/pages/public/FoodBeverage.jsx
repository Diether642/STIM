import { useEffect, useState } from 'react'
import { getFoodBeverages } from '../../api/foodBeverages'
import ListingCard from '../../components/cards/ListingCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'

export default function FoodBeverage() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', cuisine_type: '', price_range: '', page: 1 })

  useEffect(() => {
    loadItems()
  }, [filters])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getFoodBeverages(filters)
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
          <p className="text-primary-600 font-medium mb-2">Taste</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Food and Beverage</h1>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input className="input-field" placeholder="Search food places..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })} />
          <input className="input-field" placeholder="Cuisine type" value={filters.cuisine_type} onChange={(e) => setFilters({ ...filters, cuisine_type: e.target.value, page: 1 })} />
          <select className="input-field" value={filters.price_range} onChange={(e) => setFilters({ ...filters, price_range: e.target.value, page: 1 })}>
            <option value="">All Price Ranges</option>
            <option value="budget">Budget</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} basePath="/food-beverage" typeLabel={item.cuisine_type || 'Restaurant'} />
          ))}
        </div>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} onPageChange={(page) => setFilters({ ...filters, page })} />
      </div>
    </div>
  )
}