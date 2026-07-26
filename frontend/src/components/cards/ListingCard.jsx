import { Link } from 'react-router-dom'
import { StarDisplay } from '../common/StarRating'

export default function ListingCard({ item, basePath, typeLabel }) {
  const image = item.images?.[0]
  const imageUrl = image ? `/storage/${image.image_path}` : 'https://placehold.co/400x300/E8F5F0/0E6B4F?text=Sosogon'

  return (
    <Link to={`${basePath}/${item.id}`} className="card group">
      <div className="aspect-4/3 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/E8F5F0/0E6B4F?text=Sosogon' }}
        />
      </div>
      <div className="p-4">
        {typeLabel && (
          <span className="text-xs font-medium text-secondary-500 bg-secondary-50 px-2 py-0.5 rounded">
            {typeLabel}
          </span>
        )}
        <h3 className="font-heading font-semibold text-gray-900 mt-1 mb-1 group-hover:text-primary-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {item.description?.substring(0, 100)}...
        </p>
        <div className="flex items-center justify-between">
          {item.average_rating !== undefined && <StarDisplay rating={item.average_rating} size={14} />}
          {item.price_range && (
            <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
              {item.price_range}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}