import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getItineraries } from '../../api/itineraries'
import { getMyReviews } from '../../api/ratings'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function TouristDashboard() {
  const { user } = useAuth()
  const [itineraries, setItineraries] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getItineraries(), getMyReviews()])
      .then(([itineraryData, reviewData]) => {
        setItineraries(itineraryData.data || [])
        setReviews(reviewData.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-primary-600 font-medium mb-2">Tourist Dashboard</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Welcome, {user?.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-500 mb-2">Saved Itineraries</p>
            <p className="text-3xl font-heading font-bold text-primary-600">{itineraries.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-500 mb-2">Reviews Submitted</p>
            <p className="text-3xl font-heading font-bold text-primary-600">{reviews.length}</p>
          </div>
          <div className="card p-6 flex flex-col justify-between">
            <p className="text-sm text-gray-500 mb-4">Quick Actions</p>
            <div className="flex gap-2">
              <Link to="/plan-trip" className="btn-primary text-sm px-4 py-2">Plan Trip</Link>
              <Link to="/destinations" className="btn-secondary text-sm px-4 py-2">Explore</Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold">Recent Itineraries</h2>
              <Link to="/my-itineraries" className="text-primary-600 text-sm font-medium">View all</Link>
            </div>
            {itineraries.length === 0 ? (
              <p className="text-gray-500">No itineraries yet.</p>
            ) : (
              <div className="space-y-4">
                {itineraries.slice(0, 5).map((item) => (
                  <Link key={item.id} to={`/itineraries/${item.id}`} className="block p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.num_days} day(s) • {item.travel_pace} pace</p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-heading font-semibold">My Reviews</h2>
              <Link to="/my-reviews" className="text-primary-600 text-sm font-medium">View all</Link>
            </div>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="p-4 border border-gray-100 rounded-lg">
                    <h3 className="font-medium text-gray-900">{review.rateable?.name || 'Item'}</h3>
                    <p className="text-sm text-gray-500 mt-1">Rating: {review.score}/5</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}