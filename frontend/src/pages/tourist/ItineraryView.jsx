import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getItinerary, deleteItinerary } from '../../api/itineraries'
import ItineraryDayCard from '../../components/itinerary/ItineraryDayCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ItineraryView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getItinerary(id).then(setItinerary).finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this itinerary?')) return
    try {
      await deleteItinerary(id)
      toast.success('Itinerary deleted')
      navigate('/my-itineraries')
    } catch (e) {
      toast.error('Failed to delete itinerary')
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!itinerary) return <div className="p-8 text-center">Itinerary not found</div>

  const grouped = {}
  itinerary.items?.forEach((item) => {
    if (!grouped[item.day_number]) grouped[item.day_number] = { stops: [] }
    grouped[item.day_number].stops.push(item)
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-xl p-8 border border-gray-100 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-primary-600 font-medium mb-2">Generated Itinerary</p>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-3">{itinerary.title}</h1>
              <p className="text-gray-600">
                {itinerary.num_days} day(s) • {itinerary.travel_pace} pace • Budget: {itinerary.budget} • Total distance: {itinerary.total_distance_km} km
              </p>
            </div>
            <button onClick={handleDelete} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {Object.keys(grouped).map((dayNumber) => (
            <ItineraryDayCard key={dayNumber} day={grouped[dayNumber]} dayNumber={dayNumber} />
          ))}
        </div>
      </div>
    </div>
  )
}