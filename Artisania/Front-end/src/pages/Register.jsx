import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import RegisterIllustration from '../components/svg/RegisterIllustration'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // customer, seller, admin
    address: {
      street: '',
      city: '',
      country: 'Morocco'
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  
  const { register, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
    
    if (error) clearError()
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'Veuillez saisir votre prénom'
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Veuillez saisir votre nom de famille'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Veuillez saisir votre adresse e-mail'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Veuillez saisir une adresse e-mail valide'
    }
    
    if (!formData.password) {
      errors.password = 'Veuillez saisir votre mot de passe'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
    }
    
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas'
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
    setLoading(true)

    if (formData.password.length < 6) {
      setValidationErrors({ password: 'Le mot de passe doit contenir au moins 6 caractères' })
      setLoading(false)
      return
    }

    try {
      const result = await register(formData)
      if (result.success) {
        navigate('/')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Progressive gradient background for entire page */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 z-0 background-transition"></div>
      
      {/* Progressive color squares covering entire page */}
      <div className="absolute inset-0 z-0 background-transition">
        {/* Full page coverage with progressive squares */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large squares covering full area */}
          <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-emerald-600/25 transform -rotate-12 translate-x-20 -translate-y-20"></div>
          <div className="absolute top-20 right-20 w-[110%] h-[110%] bg-teal-500/20 transform -rotate-6 translate-x-10 -translate-y-10"></div>
          <div className="absolute top-40 right-40 w-[100%] h-[100%] bg-cyan-400/15 transform rotate-6"></div>
          
          {/* Medium squares */}
          <div className="absolute bottom-60 right-60 w-[90%] h-[90%] bg-emerald-500/18 transform -rotate-45 translate-x-5 translate-y-5"></div>
          <div className="absolute bottom-80 right-80 w-[80%] h-[80%] bg-teal-400/12 transform rotate-45 -translate-x-5 -translate-y-5"></div>
          
          {/* Small squares */}
          <div className="absolute bottom-32 right-32 w-[70%] h-[70%] bg-cyan-500/20 transform -rotate-12"></div>
          <div className="absolute bottom-52 right-52 w-[60%] h-[60%] bg-emerald-400/15 transform rotate-12"></div>
          <div className="absolute bottom-72 right-72 w-[50%] h-[50%] bg-teal-300/10 transform -rotate-45"></div>
          
          {/* Additional coverage squares */}
          <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-emerald-500/15 transform rotate-12 -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-[100%] h-[100%] bg-teal-400/12 transform -rotate-12 translate-x-10 translate-y-10"></div>
        </div>
      </div>

      {/* Left side - Register Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden animate-slideInLeft z-10">
        <RegisterIllustration />
        
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10 animate-fadeInUp">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">ARTISANIA</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center bg-white/90 backdrop-blur-sm px-6 sm:px-8 lg:px-12 xl:px-16 animate-slideInRight relative z-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 animate-fadeInUp">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-gray-800 font-bold text-xl">ARTISANIA</span>
            </div>
          </div>

          {/* Form content */}
          <div className="space-y-6">
            <div className="animate-fadeInUp animation-delay-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Rejoignez Artisania
              </h1>
              <p className="text-sm text-gray-600">
                Créez votre compte pour commencer
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 animate-fadeInUp animation-delay-400">
      <form className="space-y-4 form-transition" onSubmit={handleSubmit}>
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

        <div className="space-y-3">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  validationErrors.firstName ? 'border-red-300' : ''
                }`}
                placeholder="Prénom"
              />
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  validationErrors.lastName ? 'border-red-300' : ''
                }`}
                placeholder="Nom"
              />
              {validationErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.email ? 'border-red-300' : ''
              }`}
              placeholder="Entrez votre e-mail"
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-xs font-medium text-gray-700 mb-1">
              Type de compte
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="customer">Client</option>
              <option value="seller">Vendeur</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.confirmPassword ? 'border-red-300' : ''
                }`}
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
          ) : (
            'Créer le compte'
          )}
        </button>

        <div className="text-center">
          <p className="text-xs text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link
              to="/login"
              className="font-medium text-amber-600 hover:text-amber-500 link-transition"
            >
              Se connecter
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

export default Register
