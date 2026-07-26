import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAccommodation } from '../../api/accommodations'
import { StarDisplay } from '../../components/common/StarRating'
import LocationMap from '../../components/maps/LocationMap'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AccommodationDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAccommodation(id)
      .then(setItem)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner size="lg" />
  if (!item) return <div className="p-8 text-center">Accommodation not found</div>

  const image = item.images?.[0]
  const imageUrl = image ? `/storage/${image.image_path}` : 'https://placehold.co/1200x600/E8F5F0/0E6B4F?text=Accommodation'

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="h-[350px]">
        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <span className="inline-block bg-secondary-50 text-secondary-600 text-sm px-3 py-1 rounded mb-3 capitalize">{item.type}</span>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-3">{item.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <StarDisplay rating={item.average_rating} size={18} />
                <span className="text-gray-600 capitalize">{item.price_range}</span>
              </div>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-heading font-semibold mb-4">Location</h2>
              <LocationMap latitude={item.latitude} longitude={item.longitude} title={item.name} />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 h-fit">
            <h3 className="font-heading font-semibold text-lg mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div><p className="text-gray-500">Address</p><p className="font-medium">{item.address}</p></div>
              <div><p className="text-gray-500">Contact</p><p className="font-medium">{item.contact_number || 'Not available'}</p></div>
              <div><p className="text-gray-500">Operating Hours</p><p className="font-medium">{item.operating_hours || 'Not specified'}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}