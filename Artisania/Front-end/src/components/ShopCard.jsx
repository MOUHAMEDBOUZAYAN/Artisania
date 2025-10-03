import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Heart, Phone, Clock, ShoppingBag } from 'lucide-react'

const ShopCard = ({ shop }) => {
  const [isLiked, setIsLiked] = useState(false)
  
  console.log('🛍️ ShopCard received shop:', shop)
  console.log('🖼️ Shop banner:', shop.banner)
  console.log('🏷️ Shop logo:', shop.logo)

  const handleToggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const formatAddress = (address) => {
    if (!address) return 'Adresse non disponible'
    const parts = [address.street, address.city, address.country].filter(Boolean)
    return parts.join(', ')
  }

  const formatWorkingHours = (hours) => {
    if (!hours || !hours.open || !hours.close) return 'Horaires non disponibles'
    return `${hours.open} - ${hours.close}`
  }

  return (
    <Link
      to={`/shops/${shop._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Banner Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {shop.banner ? (
          <img
            src={shop.banner}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('❌ Error loading banner image:', shop.banner)
              e.target.style.display = 'none'
            }}
            onLoad={() => console.log('✅ Banner image loaded:', shop.banner)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-blue-400" />
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={handleToggleLike}
          className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            shop.isOpen 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {shop.isOpen ? 'Ouvert' : 'Fermé'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Shop Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {shop.logo ? (
              <img
                src={shop.logo}
                alt={shop.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                onError={(e) => {
                  console.error('❌ Error loading logo image:', shop.logo)
                  e.target.style.display = 'none'
                }}
                onLoad={() => console.log('✅ Logo image loaded:', shop.logo)}
              />
            ) : (
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {shop.name}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {shop.description}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (shop.rating?.average || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {shop.rating?.average?.toFixed(1) || '0.0'} ({shop.rating?.count || 0} avis)
          </span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2">
            {formatAddress(shop.address)}
          </p>
        </div>

        {/* Working Hours */}
        <div className="flex items-start gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">
            {formatWorkingHours(shop.workingHours)}
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              {shop.stats?.totalProducts || 0} produits
            </span>
            {shop.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Contact
              </span>
            )}
          </div>
          
          <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700">
            Voir la boutique →
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ShopCard