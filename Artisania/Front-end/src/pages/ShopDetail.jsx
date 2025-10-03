import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { MapPin, Phone, Mail, Clock, Star, ArrowLeft, Edit } from 'lucide-react'

const ShopDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      fetchShop()
    }
  }, [id])

  const fetchShop = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/shops/${id}`)
      setShop(response.data.shop)
    } catch (err) {
      setError('Boutique non trouvée')
      console.error('Error fetching shop:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Boutique non trouvée</h1>
        <p className="text-gray-600 mb-6">Cette boutique n'existe pas ou a été supprimée.</p>
        <Link to="/shops" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Retour aux boutiques
        </Link>
      </div>
    )
  }

  const isOwner = isAuthenticated && user?.id === shop.ownerId?._id

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/shops" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux boutiques
        </Link>
        
        {isOwner && (
          <Link 
            to="/dashboard/shop" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 float-right"
          >
            <Edit className="w-4 h-4" />
            Modifier ma boutique
          </Link>
        )}
      </div>

      {/* Shop Info */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Banner */}
        {shop.banner && (
          <div className="h-48 bg-gray-200">
            <img 
              src={shop.banner} 
              alt={`Bannière de ${shop.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          {/* Shop Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {shop.logo && (
                <img 
                  src={shop.logo} 
                  alt={`Logo de ${shop.name}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
                <p className="text-gray-600 mt-1">{shop.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {shop.rating?.average || 0} ({shop.rating?.totalReviews || 0} avis)
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {shop.stats?.totalProducts || 0} produits
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
              <div className="space-y-3">
                {shop.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{shop.contact.phone}</span>
                  </div>
                )}
                {shop.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`mailto:${shop.contact.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {shop.contact.email}
                    </a>
                  </div>
                )}
                {shop.contact?.website && (
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 text-gray-400">🌐</span>
                    <a 
                      href={shop.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {shop.contact.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-700">{shop.address?.street}</p>
                    <p className="text-gray-700">
                      {shop.address?.city} {shop.address?.postalCode}
                    </p>
                    <p className="text-gray-700">{shop.address?.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          {shop.workingHours && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {shop.workingHours.open} - {shop.workingHours.close}
                </span>
              </div>
            </div>
          )}

          {/* Categories */}
          {shop.categories && shop.categories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
              <div className="flex flex-wrap gap-2">
                {shop.categories.map((category, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner Info */}
          {shop.ownerId && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétaire</h3>
              <div className="flex items-center gap-3">
                {shop.ownerId.avatar && (
                  <img 
                    src={shop.ownerId.avatar} 
                    alt={`Avatar de ${shop.ownerId.firstName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {shop.ownerId.firstName} {shop.ownerId.lastName}
                  </p>
                  <p className="text-sm text-gray-600">Propriétaire de la boutique</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopDetail
