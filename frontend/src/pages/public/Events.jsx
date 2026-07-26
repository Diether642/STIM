import { useEffect, useState } from 'react'
import { getEvents, getAnnouncements } from '../../api/events'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Events() {
  const [activeTab, setActiveTab] = useState('events')
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEvents(), getAnnouncements()])
      .then(([eventData, announcementData]) => {
        setEvents(eventData.data || [])
        setAnnouncements(announcementData.data || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-primary-600 font-medium mb-2">Updates</p>
          <h1 className="text-4xl font-heading font-bold text-gray-900">Events and Announcements</h1>
        </div>

        <div className="flex gap-3 mb-8">
          <button onClick={() => setActiveTab('events')} className={`px-5 py-2.5 rounded-lg font-medium ${activeTab === 'events' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200'}`}>
            Events
          </button>
          <button onClick={() => setActiveTab('announcements')} className={`px-5 py-2.5 rounded-lg font-medium ${activeTab === 'announcements' ? 'bg-primary-500 text-white' : 'bg-white border border-gray-200'}`}>
            Announcements
          </button>
        </div>

        {activeTab === 'events' ? (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="card p-6">
                <p className="text-sm text-primary-600 font-medium mb-2">
                  {new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">{event.title}</h3>
                {event.location && <p className="text-sm text-gray-500 mb-3">{event.location}</p>}
                <p className="text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="card p-6">
                {announcement.is_pinned && <span className="inline-block text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded mb-3">Pinned</span>}
                <h3 className="text-2xl font-heading font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{new Date(announcement.created_at).toLocaleDateString()}</p>
                <p className="text-gray-600">{announcement.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}