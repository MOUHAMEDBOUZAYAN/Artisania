import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'

const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isInCart, setIsInCart] = useState(false)
  
  console.log('📦 ProductCard received product:', product)
  console.log('🖼️ Product images:', product.images)
  console.log('🔍 First image:', product.images?.[0])
  console.log('🔍 First image URL:', product.images?.[0]?.url)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsInCart(!isInCart)
  }

  const handleToggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Container */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0].url || product.images[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('❌ Error loading product image:', product.images[0])
              e.target.style.display = 'none'
            }}
            onLoad={() => console.log('✅ Product image loaded:', product.images[0])}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📦</div>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`p-2 rounded-full ${
                isInCart 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleLike}
              className={`p-2 rounded-full ${
                isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2 rounded-full bg-white text-gray-700 hover:bg-gray-50 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Nouveau
            </span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{product.discount}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Shop Name */}
        {product.shop && (
          <p className="text-xs text-gray-500 mb-1 truncate">
            {product.shop.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < (product.averageRating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              {product.price} د.م
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice} د.م
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">
              {product.stock || 0} en stock
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard