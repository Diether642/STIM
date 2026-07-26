import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDestination } from '../../api/destinations'
import { useAuth } from '../../contexts/AuthContext'
import { submitRating } from '../../api/ratings'
import { StarDisplay, StarInput } from '../../components/common/StarRating'
import LocationMap from '../../components/maps/LocationMap'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function DestinationDetail() {
  const { id } = useParams()
  const { isAuthenticated, isTourist } = useAuth()
  const [destination, setDestination] = useState(null)
  const [nearby, setNearby] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadDestination()
  }, [id])

  const loadDestination = async () => {
    try {
      const data = await getDestination(id)
      setDestination(data.destination)
      setNearby(data.nearby || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!rating) return toast.error('Please select a rating')

    setSubmitting(true)
    try {
      await submitRating({
        rateable_type: 'destination',
        rateable_id: destination.id,
        score: rating,
        comment,
      })
      toast.success('Review submitted successfully')
      setRating(0)
      setComment('')
      loadDestination()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!destination) return <div className="p-8 text-center">Destination not found</div>

  const image = destination.images?.[0]
  const imageUrl = image ? `/storage/${image.image_path}` : 'https://placehold.co/1200x600/E8F5F0/0E6B4F?text=Sosogon'

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="h-400px relative">
        <img
          src={imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://placehold.co/1200x600/E8F5F0/0E6B4F?text=Sosogon' }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <span className="inline-block bg-primary-500 text-white text-sm px-3 py-1 rounded mb-3">
            {destination.category?.name}
          </span>
          <h1 className="text-4xl font-heading font-bold text-white mb-2">{destination.name}</h1>
          <p className="text-white/90">{destination.address}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <StarDisplay rating={destination.average_rating} size={20} />
                <span className="text-gray-600">
                  {destination.average_rating} ({destination.total_reviews} reviews)
                </span>
              </div>
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">About this destination</h2>
              <p className="text-gray-600 leading-relaxed">{destination.description}</p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4">Location</h2>
              <LocationMap
                latitude={destination.latitude}
                longitude={destination.longitude}
                title={destination.name}
              />
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6">Ratings and Reviews</h2>

              {isAuthenticated && isTourist && (
                <form onSubmit={handleSubmitReview} className="mb-8 pb-8 border-b border-gray-100">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                    <StarInput value={rating} onChange={setRating} />
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={4}
                    className="input-field mb-4"
                  />
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {destination.ratings?.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  destination.ratings?.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{review.user?.name}</p>
                        <StarDisplay rating={review.score} size={14} />
                      </div>
                      {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-4">Quick Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Municipality</p>
                  <p className="font-medium text-gray-900">{destination.municipality?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Barangay</p>
                  <p className="font-medium text-gray-900">{destination.barangay?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Operating Hours</p>
                  <p className="font-medium text-gray-900">{destination.operating_hours || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Entrance Fee</p>
                  <p className="font-medium text-gray-900">
                    {destination.entrance_fee ? `PHP ${destination.entrance_fee}` : 'Free'}
                  </p>
                </div>
              </div>
              {isAuthenticated && isTourist && (
                <Link to="/plan-trip" className="btn-primary w-full justify-center mt-6">
                  Add to Itinerary
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Nearby Destinations */}
        {nearby.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Nearby Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.map((item) => (
                <DestinationCard key={item.id} destination={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}