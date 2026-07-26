import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFoodBeverage } from '../../api/foodBeverages'
import { StarDisplay } from '../../components/common/StarRating'
import LocationMap from '../../components/maps/LocationMap'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function FoodBeverageDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFoodBeverage(id).then(setItem).finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner size="lg" />
  if (!item) return <div className="p-8 text-center">Item not found</div>

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl p-8 border border-gray-100">
          <span className="inline-block bg-secondary-50 text-secondary-600 text-sm px-3 py-1 rounded mb-3">{item.cuisine_type || 'Food Place'}</span>
          <h1 className="text-4xl font-heading font-bold mb-3">{item.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <StarDisplay rating={item.average_rating} size={18} />
            <span className="capitalize text-gray-600">{item.price_range}</span>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">{item.description}</p>
          <LocationMap latitude={item.latitude} longitude={item.longitude} title={item.name} />
        </div>
      </div>
    </div>
  )
}