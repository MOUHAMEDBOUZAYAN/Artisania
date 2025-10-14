import React from 'react'
import ArtisaniaLogo from './svg/ArtisaniaLogo'
import AuthIllustration from './svg/AuthIllustration'

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <AuthIllustration />
        
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10">
          <ArtisaniaLogo />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center bg-white px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <ArtisaniaLogo />
          </div>

          {/* Form content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600">
                {subtitle}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
