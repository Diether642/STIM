import { useState } from 'react'
import { INTERESTS, TRAVEL_PACES, BUDGETS } from '../../utils/constants'

export default function ItineraryPreferenceForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    num_days: 1,
    interests: ['nature'],
    travel_pace: 'moderate',
    budget: 'moderate',
    preferred_destinations: [],
  })

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.interests.length === 0) return
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Days
          </label>
          <select
            value={formData.num_days}
            onChange={(e) => setFormData({ ...formData, num_days: parseInt(e.target.value) })}
            className="input-field"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>{day} Day{day > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Travel Pace
          </label>
          <select
            value={formData.travel_pace}
            onChange={(e) => setFormData({ ...formData, travel_pace: e.target.value })}
            className="input-field"
          >
            {TRAVEL_PACES.map((pace) => (
              <option key={pace.value} value={pace.value}>{pace.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Interests
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {INTERESTS.map((interest) => (
            <label key={interest.value} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest.value)}
                onChange={() => toggleInterest(interest.value)}
                className="w-4 h-4 text-primary-500 rounded"
              />
              <span className="text-sm">{interest.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Preference
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {BUDGETS.map((budget) => (
            <button
              key={budget.value}
              type="button"
              onClick={() => setFormData({ ...formData, budget: budget.value })}
              className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                formData.budget === budget.value
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              {budget.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Generating Itinerary...' : 'Generate Itinerary'}
      </button>
    </form>
  )
}