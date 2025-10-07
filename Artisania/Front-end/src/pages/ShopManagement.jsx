import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Plus, 
  Edit, 
  Eye, 
  MapPin, 
  Phone, 
  Star,
  Upload,
  Save,
  X
} from 'lucide-react'
import api, { shopService } from '../services/api'
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
    categories: [],
    isOpen: true
  })

  const fetchShop = useCallback(async () => {
    console.log('🔍 Checking if user has an existing shop...')
    console.log('👤 Current user:', { email: user?.email, role: user?.role })
    console.log('🔐 Authentication status:', { isAuthenticated, authLoading })
    
    try {
      setLoading(true)
      console.log('📡 Calling shopService.checkMyShop()...')
      const result = await shopService.checkMyShop()
      console.log('📥 Result from checkMyShop:', result)
      
      if (result.exists && result.data?.shop) {
        console.log('✅ Shop found, setting up edit mode')
        console.log('🏪 Shop data:', result.data.shop)
        setShop(result.data.shop)
        setFormData({
          name: result.data.shop.name || '',
          description: result.data.shop.description || '',
          logo: result.data.shop.logo || '',
          banner: result.data.shop.banner || '',
          address: result.data.shop.address || { street: '', city: '', country: 'Morocco', postalCode: '' },
          phone: result.data.shop.contact?.phone || '',
          email: result.data.shop.contact?.email || '',
          categories: result.data.shop.categories || [],
          isOpen: result.data.shop.isOpen !== undefined ? result.data.shop.isOpen : true
        })
        setIsEditing(true)
        console.log('✏️ Edit mode activated')
      } else {
        console.log('ℹ️ User does not have a shop yet - showing create form')
        console.log('🆕 Create mode activated')
        setIsEditing(false)
      }
    } catch (error) {
      console.error('❌ Error checking shop:', error)
      console.error('❌ Error details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
      setIsEditing(false)
    } finally {
      console.log('🏁 fetchShop completed')
      setLoading(false)
    }
  }, [user, isAuthenticated, authLoading])

  useEffect(() => {
    console.log('🔄 useEffect called, hasFetched:', hasFetched.current)
    console.log('🔐 Auth state in useEffect:', { 
      user: user?.email, 
      isAuthenticated, 
      authLoading 
    })
    
    if (!hasFetched.current) {
      hasFetched.current = true
      console.log('🚀 Calling fetchShop for the first time')
      fetchShop()
    } else {
      console.log('⏭️ fetchShop already called, skipping')
    }
  }, [fetchShop, user, isAuthenticated, authLoading])

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
    console.log('🔍 Starting form validation...')
    console.log('📋 Current form data:', formData)
    
    const errors = {}
    
    if (!formData.name.trim()) {
      console.log('❌ Validation error: Name is empty')
      errors.name = 'Veuillez saisir le nom de la boutique'
    } else {
      console.log('✅ Name validation passed:', formData.name)
    }
    
    if (!formData.description.trim()) {
      console.log('❌ Validation error: Description is empty')
      errors.description = 'Veuillez saisir la description de la boutique'
    } else {
      console.log('✅ Description validation passed')
    }
    
    if (!formData.address.street.trim()) {
      console.log('❌ Validation error: Street address is empty')
      errors['address.street'] = 'Veuillez saisir l\'adresse de la rue'
    } else {
      console.log('✅ Street validation passed:', formData.address.street)
    }
    
    if (!formData.address.city.trim()) {
      console.log('❌ Validation error: City is empty')
      errors['address.city'] = 'Veuillez saisir la ville'
    } else {
      console.log('✅ City validation passed:', formData.address.city)
    }
    
    if (!formData.phone.trim()) {
      console.log('❌ Validation error: Phone is empty')
      errors.phone = 'Veuillez saisir le numéro de téléphone'
    } else {
      console.log('✅ Phone validation passed:', formData.phone)
    }
    
    console.log('📧 Checking email field:', { 
      email: formData.email, 
      emailType: typeof formData.email,
      emailTrimmed: formData.email?.trim(),
      isEmpty: !formData.email?.trim()
    })
    
    if (!formData.email.trim()) {
      console.log('❌ Validation error: Email is empty')
      errors.email = 'Veuillez saisir l\'adresse e-mail'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      console.log('❌ Validation error: Email format is invalid')
      errors.email = 'Veuillez saisir une adresse e-mail valide'
    } else {
      console.log('✅ Email validation passed:', formData.email)
    }
    
    console.log('🔍 Validation completed. Errors found:', Object.keys(errors).length)
    console.log('📝 Validation errors:', errors)
    
    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('📝 Input changed:', { name, value })
    
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      console.log('🏠 Address field changed:', { field, value })
      setFormData(prev => {
        const newData = {
          ...prev,
          address: {
            ...prev.address,
            [field]: value
          }
        }
        console.log('📋 New form data after address change:', newData)
        return newData
      })
    } else {
      console.log('📋 Regular field changed:', { name, value })
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: value
        }
        console.log('📋 New form data after field change:', newData)
        return newData
      })
    }
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      console.log('🧹 Clearing validation error for:', name)
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('🚀 Form submit started!')
    
    // Validate form before submission
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      console.log('❌ Form validation failed, stopping submission')
      console.log('📝 Setting validation errors:', errors)
      setValidationErrors(errors)
      return
    }
    
    // Clear any previous validation errors
    setValidationErrors({})
    
    console.log('💾 Form submitted, saving shop...')
    console.log('📝 Form data to be sent:', JSON.stringify(formData, null, 2))
    console.log('🏪 Shop exists:', !!shop)
    console.log('🔐 User info:', { 
      email: user?.email, 
      role: user?.role, 
      isAuthenticated 
    })
    
    setSaving(true)

    try {
      if (shop) {
        console.log('🔄 Updating existing shop...')
        console.log('📡 Making PUT request to:', `/shops/${shop._id}`)
        console.log('📤 Data being sent:', formData)
        const updateResponse = await api.put(`/shops/${shop._id}`, formData)
        console.log('✅ Shop updated successfully:', updateResponse.data)
      } else {
        console.log('🆕 Creating new shop...')
        console.log('📡 Making POST request to /shops')
        console.log('📤 Data being sent:', formData)
        const createResponse = await shopService.createShop(formData)
        console.log('✅ Shop created successfully:', createResponse.data)
      }
      console.log('🔄 Refreshing shop data...')
      await fetchShop()
      setIsEditing(false)
      console.log('🎉 Shop operation completed successfully!')
    } catch (error) {
      console.error('❌ Error saving shop:', error)
      console.error('❌ Error details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      })
      
      // عرض رسائل الخطأ للمستخدم
      if (error.response?.data?.errors) {
        console.log('📝 Server validation errors:', error.response.data.errors)
        const serverErrors = {}
        error.response.data.errors.forEach(err => {
          if (err.path) {
            serverErrors[err.path] = err.msg
          }
        })
        setValidationErrors(serverErrors)
      } else if (error.response?.data?.message) {
        console.log('📝 Server error message:', error.response.data.message)
        setValidationErrors({ general: error.response.data.message })
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        console.log('🌐 Network error detected')
        setValidationErrors({ general: 'Impossible de se connecter au serveur. Vérifiez que le serveur backend est démarré.' })
      } else {
        console.log('❓ Unknown error type')
        setValidationErrors({ general: 'Une erreur est survenue lors de la sauvegarde' })
      }
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
          {/* General Error Messages */}
          {validationErrors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <strong>Erreur:</strong> {validationErrors.general}
            </div>
          )}
          
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

          {/* Shop Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">État de la boutique</h3>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData(prev => ({ ...prev, isOpen: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Boutique ouverte
                </span>
              </label>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                formData.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.isOpen ? 'Ouvert' : 'Fermé'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="+212 6XX XXX XXX"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="votre@email.com"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
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
