export default function ItineraryDayCard({ day, dayNumber }) {
  return (
    <div className="card p-6">
      <h3 className="text-xl font-heading font-semibold text-primary-600 mb-4">
        Day {dayNumber}
      </h3>
      <div className="space-y-4">
        {day.stops?.map((stop, index) => (
          <div key={index} className="border-l-2 border-primary-200 pl-4">
            <p className="text-sm font-medium text-primary-600">{stop.time_slot}</p>
            <h4 className="font-semibold text-gray-900 mt-1">
              {stop.destination?.name || `Destination ${stop.destination_id}`}
            </h4>
            {stop.notes && <p className="text-sm text-gray-600 mt-1">{stop.notes}</p>}
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span>Duration: {stop.duration_minutes} min</span>
              {stop.distance_from_prev_km && <span>Distance: {stop.distance_from_prev_km} km</span>}
              {stop.travel_time_from_prev && <span>Travel: {stop.travel_time_from_prev} min</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}