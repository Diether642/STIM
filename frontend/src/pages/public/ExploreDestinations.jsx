import { useEffect, useState } from 'react'
import { getDestinations } from '../../api/destinations'
import { getMunicipalities, getBarangays, getCategories } from '../../api/admin'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'

export default function ExploreDestinations() {
  const [destinations, setDestinations] = useState([])
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 })
  const [municipalities, setMunicipalities] = useState([])
  const [barangays, setBarangays] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: '',
    category_id: '',
    municipality_id: '',
    barangay_id: '',
    page: 1,
  })

  useEffect(() => {
    loadMeta()
  }, [])

  useEffect(() => {
    loadDestinations()
  }, [filters])

  useEffect(() => {
    if (filters.municipality_id) {
      getBarangays(filters.municipality_id).then(setBarangays)
    } else {
      setBarangays([])
    }
  }, [filters.municipality_id])

  const loadMeta = async () => {
    try {
      const [municipalityData, categoryData] = await Promise.all([
        getMunicipalities(),
        getCategories('destination'),
      ])
      setMunicipalities(municipalityData)
      setCategories(categoryData)
    } catch (e) {
      console.error(e)
    }
  }

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const data = await getDestinations(filters)
      setDestinations(data.data || [])
      setPagination({ current_page: data.current_page, last_page: data.last_page })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }))
  }

  if (loading && destinations.length === 0) return <LoadingSpinner size="lg" />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-primary-600 font-medium mb-2">Explore</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Destinations</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              value={filters.q}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className="input-field"
            />
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <select
              value={filters.municipality_id}
              onChange={(e) => handleFilterChange('municipality_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Municipalities</option>
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <select
              value={filters.barangay_id}
              onChange={(e) => handleFilterChange('barangay_id', e.target.value)}
              className="input-field"
            >
              <option value="">All Barangays</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {destinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <p className="text-gray-500">No destinations found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            />
          </>
        )}
      </div>
    </div>
  )
}