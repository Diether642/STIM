import { useEffect, useState } from 'react'
import { getRetailProducts } from '../../api/retailProducts'
import ListingCard from '../../components/cards/ListingCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'

export default function RetailProducts() {
  const [items, setItems] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ q: '', product_type: '', page: 1 })

  useEffect(() => {
    loadItems()
  }, [filters])

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getRetailProducts(filters)
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
          <p className="text-primary-600 font-medium mb-2">Shop Local</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Retail Products</h1>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="input-field" placeholder="Search products..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })} />
          <input className="input-field" placeholder="Product type" value={filters.product_type} onChange={(e) => setFilters({ ...filters, product_type: e.target.value, page: 1 })} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ListingCard key={item.id} item={item} basePath="/products" typeLabel={item.product_type} />
          ))}
        </div>

        <Pagination currentPage={pagination.current_page} lastPage={pagination.last_page} onPageChange={(page) => setFilters({ ...filters, page })} />
      </div>
    </div>
  )
}