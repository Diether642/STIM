import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getItineraries } from '../../api/itineraries'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function SavedItineraries() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItineraries().then((data) => setItems(data.data || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary-600 font-medium mb-2">Tourist</p>
            <h1 className="text-4xl font-heading font-bold text-gray-900">Saved Itineraries</h1>
          </div>
          <Link to="/plan-trip" className="btn-primary">Plan New Trip</Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 mb-4">No itineraries yet.</p>
            <Link to="/plan-trip" className="btn-primary">Generate Your First Itinerary</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <Link key={item.id} to={`/itineraries/${item.id}`} className="block bg-white rounded-xl p-6 border border-gray-100 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-xl text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.num_days} day(s) • {item.travel_pace} pace • Budget: {item.budget}
                    </p>
                  </div>
                  <p className="text-primary-600 font-medium">View Details</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}