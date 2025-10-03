import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { shopService, productService } from '../services/api'
import { Star, MapPin, ShoppingBag } from 'lucide-react'
import ShopCard from '../components/ShopCard'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const { user, isAuthenticated } = useAuth()
  const [featuredShops, setFeaturedShops] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // السماح للبائعين بالوصول للصفحة الرئيسية أيضاً

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsResponse, productsResponse] = await Promise.all([
          shopService.getShops({ limit: 8 }), // عرض جميع المتاجر النشطة
          productService.getProducts({ limit: 8 }) // عرض جميع المنتجات النشطة
        ])
        
        console.log('🏠 Home - Shops response:', shopsResponse.data)
        console.log('🏠 Home - Products response:', productsResponse.data)
        
        setFeaturedShops(shopsResponse.data.shops || [])
        setFeaturedProducts(productsResponse.data.products || [])
        
        console.log('🏠 Home - Featured shops:', shopsResponse.data.shops || [])
        console.log('🏠 Home - Featured products:', productsResponse.data.products || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur Artisania
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Plateforme de connexion entre artisans et clients pour accéder aux produits artisanaux authentiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explorer les produits
            </Link>
            <Link
              to="/shops"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Parcourir les boutiques
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Boutiques en vedette</h2>
          <Link
            to="/shops"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Voir tout
          </Link>
        </div>
        
        {featuredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <ShopCard key={shop._id} shop={shop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune boutique en vedette pour le moment</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Produits en vedette</h2>
          <Link
            to="/products"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            Voir tout
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun produit en vedette pour le moment</p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Êtes-vous artisan ?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez la plateforme Artisania et partagez vos produits artisanaux avec les clients dans tout le Maroc
        </p>
        <Link
          to="/register"
          className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block"
        >
          Commencer maintenant
        </Link>
      </section>
    </div>
  )
}

export default Home
