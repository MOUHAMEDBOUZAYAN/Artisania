import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Search,
  Filter,
  Package,
  Star,
  DollarSign,
  X
} from 'lucide-react'
import api from '../services/api'
import ImageUpload from '../components/ImageUpload'
import DeleteConfirmation from '../components/DeleteConfirmation'
import { validateProductForm } from '../utils/validation'

const ProductManagement = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  })

  const fetchProducts = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)
      console.log('🔄 Fetching products...')
      const response = await api.get('/products/my-products')
      console.log('📦 Products response:', response.data)
      setProducts(response.data.products || [])
      console.log('✅ Products updated:', response.data.products?.length || 0, 'products')
    } catch (error) {
      console.error('❌ Error fetching products:', error)
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // جميع الـ conditional returns بعد الـ hooks
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'seller') {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form data
    const validation = validateProductForm(formData)
    if (!validation.isValid) {
      setFormErrors(validation.errors)
      return
    }
    
    setFormErrors({})
    
    try {
      // تحويل البيانات قبل الإرسال
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0
      }
      
      console.log('📦 Sending product data:', productData)
      
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productData)
      } else {
        await api.post('/products', productData)
      }
      await fetchProducts()
      setShowAddForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: []
      })
    } catch (error) {
      console.error('Error saving product:', error)
      if (error.response?.data?.errors) {
        const backendErrors = {}
        error.response.data.errors.forEach(err => {
          backendErrors[err.path] = err.msg
        })
        setFormErrors(backendErrors)
      }
    }
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return
    
    try {
      setDeleting(true)
      console.log('🗑️ Deleting product:', productToDelete._id)
      
      // Mise à jour immédiate de l'état local
      setProducts(prevProducts => 
        prevProducts.filter(product => product._id !== productToDelete._id)
      )
      
      await api.delete(`/products/${productToDelete._id}`)
      console.log('✅ Product deleted successfully')
      
      // Recharger les produits pour s'assurer de la synchronisation
      await fetchProducts(false)
      
      setShowDeleteConfirm(false)
      setProductToDelete(null)
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      // En cas d'erreur, recharger les produits pour restaurer l'état
      await fetchProducts(false)
      alert('Erreur lors de la suppression du produit')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setProductToDelete(null)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock || '',
      images: product.images || []
    })
    setShowAddForm(true)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(product => product.category))]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes produits</h1>
          <p className="text-gray-600">Gérez votre inventaire de produits</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              stock: '',
              images: []
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false)
                setEditingProduct(null)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.name 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="Nom du produit"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="ceramics">Céramique</option>
                  <option value="textiles">Textile</option>
                  <option value="jewelry">Bijoux</option>
                  <option value="painting">Peinture</option>
                  <option value="woodwork">Menuiserie</option>
                  <option value="metalwork">Métallurgie</option>
                  <option value="glasswork">Verre</option>
                  <option value="leatherwork">Cuir</option>
                  <option value="pottery">Poterie</option>
                  <option value="sculpture">Sculpture</option>
                  <option value="food">Nourriture</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (MAD) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images du produit
              </label>
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <ImageUpload
                      label={`Image ${index + 1}`}
                      aspectRatio="square"
                      existingImage={image.url}
                      onImageUploaded={(url) => {
                        const newImages = [...formData.images]
                        newImages[index] = { ...image, url }
                        setFormData(prev => ({ ...prev, images: newImages }))
                      }}
                      maxSize={5}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index)
                        setFormData(prev => ({ ...prev, images: newImages }))
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, { url: '', alt: '' }]
                    }))
                  }}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une image
                </button>
              </div>
            </div>

            <div>
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
                  formErrors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Décrivez votre produit en détail..."
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingProduct(null)
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingProduct ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Produits ({filteredProducts.length})
          </h3>
        </div>
        
        <div className="p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Aucun produit trouvé</p>
              <p className="text-gray-400">
                {searchTerm || filterCategory 
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Commencez par ajouter votre premier produit'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                        onError={(e) => {
                          console.error('❌ Error loading product image in management:', product.images[0])
                          e.target.style.display = 'none'
                        }}
                        onLoad={() => console.log('✅ Product image loaded in management:', product.images[0])}
                      />
                    ) : (
                      <Package className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{product.price} MAD</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.averageRating || 0}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteClick(product)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ?"
        itemName={productToDelete?.name}
        isLoading={deleting}
      />
    </div>
  )
}

export default ProductManagement
