import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ShopCard from '../components/ShopCard'
import api from '../services/api'
import { MapPin, Star, Search, Filter } from 'lucide-react'

const Shops = () => {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    category: '',
    minRating: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      setLoading(true)
      const response = await api.get('/shops')
      // Handle both array and object responses
      const shopsData = Array.isArray(response.data) 
        ? response.data 
        : response.data.shops || []
      setShops(shopsData)
    } catch (err) {
      setError('Erreur lors du chargement des boutiques')
      console.error('Error fetching shops:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredShops = (shops || []).filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         shop.description.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCity = !filters.city || shop.address?.city === filters.city
    const matchesCategory = !filters.category || shop.categories?.includes(filters.category)
    const matchesRating = !filters.minRating || (shop.rating?.average || 0) >= parseFloat(filters.minRating)
    
    return matchesSearch && matchesCity && matchesCategory && matchesRating
  })

  const cities = [...new Set((shops || []).map(shop => shop.address?.city).filter(Boolean))]
  const categories = [...new Set((shops || []).flatMap(shop => shop.categories || []))]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button 
          onClick={fetchShops}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Boutiques Artisanales</h1>
        <p className="text-gray-600">Découvrez les meilleures boutiques d'artisans de votre région</p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher une boutique..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-5 h-5" />
            Filtres
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <select
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les villes</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note minimum
              </label>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Toutes les notes</option>
                <option value="4">4 étoiles et plus</option>
                <option value="3">3 étoiles et plus</option>
                <option value="2">2 étoiles et plus</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredShops.length} boutique{filteredShops.length !== 1 ? 's' : ''} trouvée{filteredShops.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grille des boutiques */}
      {filteredShops.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">Aucune boutique trouvée</div>
          <p className="text-gray-400">Essayez de modifier vos filtres de recherche</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map(shop => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Shops