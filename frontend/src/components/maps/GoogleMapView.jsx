import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const defaultCenter = {
  lat: 12.6744,
  lng: 123.8756,
}

export default function GoogleMapView({
  markers = [],
  center = defaultCenter,
  directions = null,
  zoom = 12,
  height = '400px',
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

  if (!apiKey) {
    return (
      <div className="bg-gray-100 rounded-xl flex items-center justify-center text-gray-500" style={{ height }}>
        Google Maps API key not configured
      </div>
    )
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={center}
        zoom={zoom}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id || `${marker.lat}-${marker.lng}`}
            position={{ lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) }}
            title={marker.title}
          />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  )
}