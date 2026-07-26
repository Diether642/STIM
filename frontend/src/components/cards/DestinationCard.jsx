import { Link } from 'react-router-dom'
import { StarDisplay } from '../common/StarRating'
import { getImageUrl } from '../../utils/helpers'

export default function DestinationCard({ destination }) {
  const image = destination.images?.[0]
  const imageUrl = getImageUrl(image?.image_path)

  return (
    <Link to={`/destinations/${destination.id}`} className="card group">
      <div className="aspect-4/3 overflow-hidden">
        <img
          src={imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {destination.category?.name}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {destination.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {destination.description?.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          <StarDisplay rating={destination.average_rating} size={14} />
          <span className="text-xs text-gray-400">{destination.municipality?.name}</span>
        </div>
      </div>
    </Link>
  )
}