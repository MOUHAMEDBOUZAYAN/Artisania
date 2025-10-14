import React from 'react'
import registerImage from '../../assets/Registerimage.png'

const RegisterIllustration = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Progressive gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900"></div>
      
      {/* Progressive color squares overlay */}
      <div className="absolute inset-0">
        {/* Large squares with progressive opacity */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/40 transform -rotate-12"></div>
        <div className="absolute top-20 right-20 w-80 h-80 bg-teal-500/30 transform -rotate-6"></div>
        <div className="absolute top-40 right-40 w-64 h-64 bg-cyan-400/20 transform rotate-6"></div>
        
        {/* Medium squares */}
        <div className="absolute bottom-60 right-60 w-48 h-48 bg-emerald-500/25 transform -rotate-45"></div>
        <div className="absolute bottom-80 right-80 w-32 h-32 bg-teal-400/20 transform rotate-45"></div>
        
        {/* Small squares */}
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-cyan-500/30 transform -rotate-12"></div>
        <div className="absolute bottom-52 right-52 w-16 h-16 bg-emerald-400/25 transform rotate-12"></div>
        <div className="absolute bottom-72 right-72 w-12 h-12 bg-teal-300/20 transform -rotate-45"></div>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
        {/* Register image */}
        <div className="relative mb-8">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl scale-110"></div>
          
          {/* Image container */}
          <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <img 
              src={registerImage} 
              alt="Register Illustration" 
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
            Rejoignez-nous !
          </h2>
          <p className="text-white/80 text-lg leading-relaxed">
            Créez votre compte pour rejoindre la communauté Artisania et partager vos créations artisanales
          </p>
        </div>
      </div>
      
      {/* Progressive decorative squares */}
      <div className="absolute top-16 left-16 w-6 h-6 bg-white/40 transform rotate-45"></div>
      <div className="absolute top-24 right-20 w-8 h-8 bg-white/30 transform rotate-12"></div>
      <div className="absolute bottom-24 left-20 w-4 h-4 bg-white/50 transform -rotate-12"></div>
      <div className="absolute bottom-16 right-24 w-10 h-10 bg-white/35 transform rotate-45"></div>
      
      {/* Additional progressive squares */}
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-emerald-400/15 transform rotate-30"></div>
      <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-teal-500/20 transform -rotate-30"></div>
      <div className="absolute top-1/2 right-1/2 w-12 h-12 bg-cyan-400/25 transform rotate-60"></div>
      
      {/* Corner accent squares */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-600/20 to-transparent transform rotate-45"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-teal-600/20 to-transparent transform -rotate-45"></div>
    </div>
  )
}

export default RegisterIllustration
