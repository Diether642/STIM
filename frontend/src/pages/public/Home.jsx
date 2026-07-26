import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDestinations } from '../../api/destinations'
import { getEvents } from '../../api/events'
import DestinationCard from '../../components/cards/DestinationCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Home() {
  const [featuredDestinations, setFeaturedDestinations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDestinations({ per_page: 6 }),
      getEvents({ per_page: 3, upcoming: true }),
    ])
      .then(([destData, eventData]) => {
        setFeaturedDestinations(destData.data || [])
        setEvents(eventData.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-secondary-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-accent-400 font-medium mb-3">Province of Sorsogon Tourism Platform</p>
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Discover the beauty of Bulan, Sorsogon
            </h1>
            <p className="text-lg text-primary-100 mb-8 leading-relaxed">
              Explore verified destinations, accommodations, local food, and products. Plan your trip with AI-powered itineraries built from real local tourism data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/destinations" className="btn-accent">Explore Destinations</Link>
              <Link to="/plan-trip" className="btn-secondary">Plan Your Trip</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium mb-2">Featured Places</p>
              <h2 className="text-3xl font-heading font-bold text-gray-900">Explore Bulan</h2>
            </div>
            <Link to="/destinations" className="text-primary-600 font-medium hover:text-primary-700">
              View all destinations
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Planner CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-primary-50 rounded-2xl p-8 lg:p-12 text-center">
            <p className="text-primary-600 font-medium mb-2">AI-Based Itinerary Planning</p>
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
              Let Sosogon plan your trip
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Tell us how many days you have, what you enjoy, and your travel pace. The system will generate a personalized itinerary using verified local destinations from Bulan, Sorsogon.
            </p>
            <Link to="/plan-trip" className="btn-primary">Start Planning</Link>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-primary-600 font-medium mb-2">Happenings</p>
              <h2 className="text-3xl font-heading font-bold text-gray-900">Events and Announcements</h2>
            </div>
            <Link to="/events" className="text-primary-600 font-medium hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="card p-6">
                <p className="text-sm text-primary-600 font-medium mb-2">
                  {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}