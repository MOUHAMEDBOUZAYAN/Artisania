import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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
import ImageUpload from '../components/ImageUpload'

const ShopManagement = () => {
  console.log('🔄 ShopManagement component rendering...')
  
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  console.log('🔐 Auth state:', { user: user?.email, isAuthenticated, authLoading })
  
  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const hasFetched = useRef(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    banner: '',
    address: {
      street: '',
      city: '',
      country: 'Morocco',
      postalCode: ''
    },
    phone: '',
    email: '',
    workingHours: {
      open: '09:00',
      close: '18:00'
    },
    categories: []
  })

  const fetchShop = useCallback(async () => {
    console.log('🔍 fetchShop function called')
    try {
      console.log('📡 Making API call to /shops/my-shop')
      setLoading(true)
      const response = await api.get('/shops/my-shop')
      console.log('📡 API response received:', response.data)
      
      if (response.data && response.data.shop) {
        console.log('✅ Shop found, setting up edit mode')
        setShop(response.data.shop)
        setFormData({
          name: response.data.shop.name || '',
          description: response.data.shop.description || '',
          logo: response.data.shop.logo || '',
          banner: response.data.shop.banner || '',
          address: response.data.shop.address || { street: '', city: '', country: 'Morocco', postalCode: '' },
          phone: response.data.shop.contact?.phone || '',
          email: response.data.shop.contact?.email || '',
          workingHours: response.data.shop.workingHours || { open: '09:00', close: '18:00' },
          categories: response.data.shop.categories || []
        })
        setIsEditing(true)
      } else {
        console.log('❌ No shop data in response')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('❌ Error fetching shop:', error)
      console.error('❌ Error details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
      if (error.response?.status === 404) {
        console.log('ℹ️ No shop found (404), showing create form')
        setIsEditing(false)
      } else {
        console.log('❌ Unexpected error, showing create form as fallback')
        setIsEditing(false)
      }
    } finally {
      console.log('🏁 fetchShop completed, setting loading to false')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    console.log('🔄 useEffect called, hasFetched:', hasFetched.current)
    if (!hasFetched.current) {
      hasFetched.current = true
      console.log('🚀 Calling fetchShop for the first time')
      fetchShop()
    } else {
      console.log('⏭️ fetchShop already called, skipping')
    }
  }, []) // إزالة fetchShop من dependencies لتجنب التكرار

  console.log('✅ User authenticated as seller, proceeding with component')

  // جميع الـ conditional returns بعد الـ hooks
  if (authLoading) {
    console.log('⏳ Auth loading, showing spinner')
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'seller') {
    console.log('❌ User is not a seller, showing access denied')
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
        <p className="text-gray-600 mb-6">Vous devez être un vendeur pour accéder à cette page.</p>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Veuillez saisir le nom de la boutique'
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Veuillez saisir la description de la boutique'
    }
    
    if (!formData.address.street.trim()) {
      errors['address.street'] = 'Veuillez saisir l\'adresse de la rue'
    }
    
    if (!formData.address.city.trim()) {
      errors['address.city'] = 'Veuillez saisir la ville'
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Veuillez saisir le numéro de téléphone'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Veuillez saisir l\'adresse e-mail'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Veuillez saisir une adresse e-mail valide'
    }
    
    return errors
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
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form before submission
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    // Clear any previous validation errors
    setValidationErrors({})
    
    console.log('💾 Form submitted, saving shop...')
    console.log('📝 Form data:', formData)
    console.log('🏪 Shop exists:', !!shop)
    
    setSaving(true)

    try {
      if (shop) {
        console.log('🔄 Updating existing shop...')
        await api.put(`/shops/${shop._id}`, formData)
        console.log('✅ Shop updated successfully')
      } else {
        console.log('🆕 Creating new shop...')
        await api.post('/shops', formData)
        console.log('✅ Shop created successfully')
      }
      console.log('🔄 Refreshing shop data...')
      await fetchShop()
      setIsEditing(false)
    } catch (error) {
      console.error('❌ Error saving shop:', error)
      console.error('❌ Error details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
    } finally {
      console.log('🏁 Save operation completed')
      setSaving(false)
    }
  }

  if (loading) {
    console.log('⏳ Loading state, showing spinner')
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('🎨 Rendering main component, isEditing:', isEditing, 'shop:', !!shop)

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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Nom de votre boutique"
                  />
                </div>
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="+212 6XX XXX XXX"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
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
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.description ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Décrivez votre boutique et vos produits..."
                />
              </div>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
          </div>

          {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Logo de la boutique"
                  aspectRatio="logo"
                  existingImage={formData.logo}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, logo: url }))}
                  maxSize={2}
                />
                
                <ImageUpload
                  label="Bannière de la boutique"
                  aspectRatio="banner"
                  existingImage={formData.banner}
                  onImageUploaded={(url) => setFormData(prev => ({ ...prev, banner: url }))}
                  maxSize={5}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors['address.street'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Nom de la rue"
                  />
                </div>
                {validationErrors['address.street'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['address.street']}</p>
                )}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      validationErrors['address.city'] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Ville"
                  />
                </div>
                {validationErrors['address.city'] && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors['address.city']}</p>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Code postal"
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
