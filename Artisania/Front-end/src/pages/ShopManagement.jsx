import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Edit, 
  Eye, 
  MapPin, 
  Phone, 
  Clock,
  Star,
  Upload,
  Save,
  X
} from 'lucide-react'
import api from '../services/api'

const ShopManagement = () => {
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      country: 'Morocco'
    },
    phone: '',
    email: '',
    workingHours: {
      open: '09:00',
      close: '18:00'
    },
    categories: []
  })

  useEffect(() => {
    fetchShop()
  }, [])

  const fetchShop = async () => {
    try {
      setLoading(true)
      const response = await api.get('/shops/my-shop')
      if (response.data) {
        setShop(response.data)
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          address: response.data.address || { street: '', city: '', country: 'Morocco' },
          phone: response.data.phone || '',
          email: response.data.email || '',
          workingHours: response.data.workingHours || { open: '09:00', close: '18:00' },
          categories: response.data.categories || []
        })
      }
    } catch (error) {
      console.error('Error fetching shop:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else if (name.startsWith('workingHours.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (shop) {
        // Update existing shop
        await api.put(`/shops/${shop._id}`, formData)
      } else {
        // Create new shop
        await api.post('/shops', formData)
      }
      await fetchShop()
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving shop:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {shop ? 'Ma boutique' : 'Créer ma boutique'}
          </h1>
          <p className="text-gray-600">
            {shop ? 'Gérez les informations de votre boutique' : 'Configurez votre boutique pour commencer à vendre'}
          </p>
        </div>
        {shop && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4" />
            Modifier
          </button>
        )}
      </div>

      {/* Shop Info Display */}
      {shop && !isEditing && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-6">
            {/* Shop Logo */}
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              {shop.logo ? (
                <img src={shop.logo.url} alt={shop.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <span className="text-2xl font-bold text-gray-400">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Shop Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{shop.name}</h2>
              <p className="text-gray-600 mb-4">{shop.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{shop.address?.street}, {shop.address?.city}, {shop.address?.country}</span>
                </div>
                
                {shop.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{shop.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{shop.workingHours?.open} - {shop.workingHours?.close}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  <span>Note: {shop.rating?.average || 0}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Form */}
      {(isEditing || !shop) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la boutique *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de votre boutique"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez votre boutique et vos produits..."
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rue
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de la rue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ville"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Pays"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Horaires d'ouverture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure d'ouverture
                  </label>
                  <input
                    type="time"
                    name="workingHours.open"
                    value={formData.workingHours.open}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de fermeture
                  </label>
                  <input
                    type="time"
                    name="workingHours.close"
                    value={formData.workingHours.close}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ShopManagement
