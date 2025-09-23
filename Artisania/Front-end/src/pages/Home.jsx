import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { shopService, productService } from '../services/api'
import { Star, MapPin, ShoppingBag } from 'lucide-react'

const Home = () => {
  const [featuredShops, setFeaturedShops] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsResponse, productsResponse] = await Promise.all([
          shopService.getFeaturedShops(),
          productService.getProducts({ limit: 8, featured: true })
        ])
        
        setFeaturedShops(shopsResponse.data.shops || [])
        setFeaturedProducts(productsResponse.data.products || [])
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
            مرحباً بك في Artisania
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            منصة ربط الحرفيين مع العملاء للوصول إلى المنتجات اليدوية الأصيلة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              استكشف المنتجات
            </Link>
            <Link
              to="/shops"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              تصفح المحلات
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">المحلات المميزة</h2>
          <Link
            to="/shops"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            عرض الكل
          </Link>
        </div>
        
        {featuredShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredShops.map((shop) => (
              <Link
                key={shop._id}
                to={`/shops/${shop._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-video bg-gray-200 relative">
                  {shop.banner ? (
                    <img
                      src={shop.banner.url}
                      alt={shop.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-primary-500" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    {shop.logo ? (
                      <img
                        src={shop.logo.url}
                        alt={shop.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold">
                          {shop.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="mr-3">
                      <h3 className="font-semibold text-lg">{shop.name}</h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {shop.address?.city || 'المدينة'}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {shop.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">
                        {shop.rating?.average || 0}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {shop.stats?.totalProducts || 0} منتج
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد محلات مميزة حالياً</p>
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">المنتجات المميزة</h2>
          <Link
            to="/products"
            className="text-primary-500 hover:text-primary-600 font-semibold"
          >
            عرض الكل
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="aspect-square bg-gray-200 relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-bold text-lg">
                      {product.price} د.م
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 mr-1">
                        {product.averageRating || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد منتجات مميزة حالياً</p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          هل أنت حرفي؟
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          انضم إلى منصة Artisania وشارك منتجاتك اليدوية مع العملاء في جميع أنحاء المغرب
        </p>
        <Link
          to="/register"
          className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors inline-block"
        >
          ابدأ الآن
        </Link>
      </section>
    </div>
  )
}

export default Home
