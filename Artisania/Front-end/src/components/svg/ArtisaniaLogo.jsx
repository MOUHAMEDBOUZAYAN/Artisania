import React from 'react'

const ArtisaniaLogo = ({ className = "text-2xl font-bold" }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      <span className="text-gray-800 font-bold">ARTISANIA</span>
    </div>
  )
}

export default ArtisaniaLogo
