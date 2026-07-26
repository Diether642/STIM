import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRetailProduct } from '../../api/retailProducts'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import LocationMap from '../../components/maps/LocationMap'

export default function RetailProductDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRetailProduct(id).then(setItem).finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner size="lg" />
  if (!item) return <div className="p-8 text-center">Product not found</div>

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <span className="inline-block bg-accent-50 text-accent-600 text-sm px-3 py-1 rounded mb-3">{item.product_type}</span>
          <h1 className="text-4xl font-heading font-bold mb-3">{item.name}</h1>
          {item.price && <p className="text-xl font-semibold text-primary-600 mb-4">PHP {item.price}</p>}
          <p className="text-gray-600 mb-8 leading-relaxed">{item.description}</p>
          {item.latitude && item.longitude && (
            <LocationMap latitude={item.latitude} longitude={item.longitude} title={item.name} />
          )}
        </div>
      </div>
    </div>
  )
}