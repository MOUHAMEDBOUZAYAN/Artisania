import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import LoginIllustration from '../components/svg/LoginIllustration'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  
  const { login, error, clearError, user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Login useEffect: isAuthenticated =', isAuthenticated, 'user =', user)
    if (isAuthenticated && user) {
      console.log('Login useEffect: User role =', user.role)
      if (user.role === 'seller') {
        console.log('Login useEffect: Redirecting seller to dashboard')
        navigate('/dashboard', { replace: true })
      } else {
        console.log('Login useEffect: Redirecting customer to home')
        navigate('/', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) clearError()
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[e.target.name]) {
      setValidationErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email.trim()) {
      errors.email = 'Veuillez saisir votre adresse e-mail'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Veuillez saisir une adresse e-mail valide'
    }
    
    if (!formData.password) {
      errors.password = 'Veuillez saisir votre mot de passe'
    }
    
    return errors
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
    console.log('Login page: Form submitted with data:', formData)
    setLoading(true)

    try {
      console.log('Login page: Calling login function...')
      const result = await login(formData)
      console.log('Login page: Login result:', result)
      if (result.success) {
        console.log('Login page: Login successful, redirecting...')
        // Utiliser les données retournées directement
        const userData = result.user || JSON.parse(localStorage.getItem('user') || '{}')
        console.log('Login page: Redirecting user with role:', userData.role)
        if (userData.role === 'seller') {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } else {
        console.log('Login page: Login failed:', result.error)
      }
    } catch (error) {
      console.error('Login page: Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Progressive gradient background for entire page */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-800 z-0 background-transition"></div>
      
      {/* Progressive color squares covering entire page */}
      <div className="absolute inset-0 z-0 background-transition">
        {/* Full page coverage with progressive squares */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large squares covering full area */}
          <div className="absolute top-0 left-0 w-[120%] h-[120%] bg-teal-600/25 transform rotate-12 -translate-x-20 -translate-y-20"></div>
          <div className="absolute top-20 left-20 w-[110%] h-[110%] bg-teal-500/20 transform rotate-6 -translate-x-10 -translate-y-10"></div>
          <div className="absolute top-40 left-40 w-[100%] h-[100%] bg-teal-400/15 transform -rotate-6"></div>
          
          {/* Medium squares */}
          <div className="absolute top-60 left-60 w-[90%] h-[90%] bg-emerald-600/18 transform rotate-45 -translate-x-5 -translate-y-5"></div>
          <div className="absolute top-80 left-80 w-[80%] h-[80%] bg-emerald-500/12 transform -rotate-45 translate-x-5 translate-y-5"></div>
          
          {/* Small squares */}
          <div className="absolute top-32 left-32 w-[70%] h-[70%] bg-green-500/20 transform rotate-12"></div>
          <div className="absolute top-52 left-52 w-[60%] h-[60%] bg-green-400/15 transform -rotate-12"></div>
          <div className="absolute top-72 left-72 w-[50%] h-[50%] bg-green-300/10 transform rotate-45"></div>
          
          {/* Additional coverage squares */}
          <div className="absolute top-0 right-0 w-[100%] h-[100%] bg-teal-500/15 transform -rotate-12 translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-[100%] h-[100%] bg-emerald-400/12 transform rotate-12 -translate-x-10 translate-y-10"></div>
        </div>
      </div>

      {/* Left side - Login Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slideInLeft z-10">
        <LoginIllustration />
        
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10 animate-fadeInUp">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">ARTISANIA</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center bg-white/90 backdrop-blur-sm px-8 sm:px-12 lg:px-16 xl:px-20 animate-slideInRight relative z-10">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 animate-fadeInUp">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-gray-800 font-bold text-xl">ARTISANIA</span>
            </div>
          </div>

          {/* Form content */}
          <div className="space-y-8">
            <div className="animate-fadeInUp animation-delay-200">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bienvenue sur Artisania
              </h1>
              <p className="text-gray-600">
                Connectez-vous à votre compte
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6 animate-fadeInUp animation-delay-400">
      <form className="space-y-6 form-transition" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <p className="font-medium">Veuillez remplir tous les champs obligatoires :</p>
            <ul className="mt-2 list-disc list-inside">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                validationErrors.email ? 'border-red-300' : ''
              }`}
              placeholder="Entrez votre e-mail"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  validationErrors.password ? 'border-red-300' : ''
                }`}
                placeholder="Entrez votre mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Se souvenir de moi
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-amber-600 hover:text-amber-500 link-transition"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            'Se connecter'
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link
              to="/register"
              className="font-medium text-amber-600 hover:text-amber-500 link-transition"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
