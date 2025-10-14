import React from 'react'
import loginImage from '../../assets/loginimage.png'

const LoginIllustration = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Progressive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-700 to-emerald-800"></div>
      
      {/* Progressive color squares overlay */}
      <div className="absolute inset-0">
        {/* Large squares with progressive opacity */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-600/40 transform rotate-12"></div>
        <div className="absolute top-20 left-20 w-80 h-80 bg-teal-500/30 transform rotate-6"></div>
        <div className="absolute top-40 left-40 w-64 h-64 bg-teal-400/20 transform -rotate-6"></div>
        
        {/* Medium squares */}
        <div className="absolute top-60 left-60 w-48 h-48 bg-emerald-600/25 transform rotate-45"></div>
        <div className="absolute top-80 left-80 w-32 h-32 bg-emerald-500/20 transform -rotate-45"></div>
        
        {/* Small squares */}
        <div className="absolute top-32 left-32 w-24 h-24 bg-green-500/30 transform rotate-12"></div>
        <div className="absolute top-52 left-52 w-16 h-16 bg-green-400/25 transform -rotate-12"></div>
        <div className="absolute top-72 left-72 w-12 h-12 bg-green-300/20 transform rotate-45"></div>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
        {/* Login image */}
        <div className="relative mb-8">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-110"></div>
          
          {/* Image container */}
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <img 
              src={loginImage} 
              alt="Login Illustration" 
              className="w-80 h-80 object-contain"
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
          </div>
        </div>
        
        {/* Professional text */}
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-3xl font-bold text-white">
            Bienvenue !
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Connectez-vous pour accéder à votre espace Artisania et découvrir des créations artisanales uniques
          </p>
        </div>
      </div>
      
      {/* Progressive decorative squares */}
      <div className="absolute top-16 left-16 w-8 h-8 bg-white/30 transform rotate-45"></div>
      <div className="absolute top-32 right-24 w-6 h-6 bg-white/20 transform rotate-12"></div>
      <div className="absolute bottom-32 left-24 w-4 h-4 bg-white/40 transform -rotate-12"></div>
      <div className="absolute bottom-20 right-32 w-10 h-10 bg-white/25 transform rotate-45"></div>
      
      {/* Additional progressive squares */}
      <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-teal-400/15 transform rotate-30"></div>
      <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-emerald-500/20 transform -rotate-30"></div>
      <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-green-400/25 transform rotate-60"></div>
    </div>
  )
}

export default LoginIllustration
