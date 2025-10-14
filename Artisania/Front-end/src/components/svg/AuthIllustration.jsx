import React from 'react'

const AuthIllustration = ({ className = "w-full h-full" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Professional earth-tone background matching pottery theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"></div>
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #8B4513 2px, transparent 2px),
                           radial-gradient(circle at 80% 20%, #CD853F 2px, transparent 2px),
                           radial-gradient(circle at 40% 40%, #DEB887 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      ></div>
      
      {/* Artisania icon with professional styling */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Subtle shadow behind image */}
          <div className="absolute inset-0 bg-amber-200/20 rounded-full blur-lg scale-110"></div>
          
          {/* Image container */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-xl border border-amber-200/30">
            <img 
              src={artisaniaIcon} 
              alt="Artisania Artisan" 
              className="w-48 h-48 object-contain"
            />
          </div>
        </div>
      </div>
      
      {/* Professional decorative elements in earth tones */}
      <div className="absolute top-16 left-16 w-3 h-3 bg-amber-300 rounded-full opacity-40"></div>
      <div className="absolute top-24 right-20 w-4 h-4 bg-orange-400 rounded-full opacity-30"></div>
      <div className="absolute bottom-24 left-20 w-2 h-2 bg-red-300 rounded-full opacity-50"></div>
      <div className="absolute bottom-16 right-24 w-3 h-3 bg-yellow-400 rounded-full opacity-35"></div>
      
      {/* Additional pottery-themed elements */}
      <div className="absolute top-1/3 left-8 w-8 h-8 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full opacity-20"></div>
      <div className="absolute bottom-1/3 right-8 w-6 h-6 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-25"></div>
    </div>
  )
}

export default AuthIllustration
