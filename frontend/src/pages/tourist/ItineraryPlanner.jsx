import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateItinerary } from '../../api/itineraries'
import ItineraryPreferenceForm from '../../components/itinerary/ItineraryPreferenceForm'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function ItineraryPlanner() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [generatedItinerary, setGeneratedItinerary] = useState(null)

  const handleGenerate = async (preferences) => {
    setLoading(true)
    try {
      const data = await generateItinerary(preferences)
      setGeneratedItinerary(data.itinerary)
      toast.success('Itinerary generated successfully!')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to generate itinerary')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-primary-600 font-medium mb-2">AI Planner</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Plan Your Trip</h1>
          <p className="text-gray-600 mt-3 max-w-2xl">
            Enter your travel preferences and Sosogon will generate a personalized itinerary using verified local destinations from Bulan, Sorsogon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-gray-100">
            <ItineraryPreferenceForm onSubmit={handleGenerate} loading={loading} />
          </div>

          <div className="bg-white rounded-xl p-8 border border-gray-100">
            {loading ? (
              <div className="text-center py-20">
                <LoadingSpinner size="lg" />
                <p className="text-gray-500 mt-4">Generating your itinerary...</p>
              </div>
            ) : generatedItinerary ? (
              <div>
                <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-3">
                  {generatedItinerary.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {generatedItinerary.num_days} day(s) • {generatedItinerary.travel_pace} pace • Total distance: {generatedItinerary.total_distance_km} km
                </p>
                <div className="space-y-4 mb-6">
                  {generatedItinerary.items?.slice(0, 5).map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-primary-600">Day {item.day_number} • {item.time_slot}</p>
                      <p className="font-semibold text-gray-900 mt-1">{item.destination?.name}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(`/itineraries/${generatedItinerary.id}`)} className="btn-primary w-full justify-center">
                  View Full Itinerary
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500">Your generated itinerary will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}