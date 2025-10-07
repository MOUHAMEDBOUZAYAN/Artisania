import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShoppingCart, User, Menu, X } from 'lucide-react'

const Header = () => {
  console.log('🎯 Header component rendering')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  try {
    const { user, isAuthenticated, logout } = useAuth()
    console.log('🎯 Header useAuth result:', { 
      user: user?.email, 
      isAuthenticated,
      role: user?.role 
    })
    const navigate = useNavigate()

    const handleLogout = async () => {
      await logout()
      navigate('/')
    }

    return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Artisania</span>
          </Link>


          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Produits
            </Link>
            <Link
              to="/shops"
              className="text-gray-700 hover:text-primary-500 transition-colors"
            >
              Boutiques
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/cart"
                  className="relative text-gray-700 hover:text-primary-500 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors">
                    <User className="w-6 h-6" />
                    <span>{user?.firstName}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profil
                      </Link>
                      {user?.role === 'seller' && (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Tableau de bord
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Connexion
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-500"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/"
                className="block py-2 text-gray-700 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link
                to="/products"
                className="block py-2 text-gray-700 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Produits
              </Link>
              <Link
                to="/shops"
                className="block py-2 text-gray-700 hover:text-primary-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Boutiques
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Panier
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-primary-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  {user?.role === 'seller' && (
                    <Link
                      to="/dashboard"
                      className="block py-2 text-gray-700 hover:text-primary-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block py-2 text-gray-700 hover:text-primary-500"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-primary-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    )
  } catch (error) {
    console.error('❌ Header component error:', error)
    return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">!</span>
              </div>
              <span className="text-xl font-bold text-gray-800">Artisania</span>
            </div>
            <div className="text-red-500 text-sm">
              Erreur de connexion
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
