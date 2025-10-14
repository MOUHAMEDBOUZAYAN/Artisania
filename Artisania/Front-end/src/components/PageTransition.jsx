import { useState, useEffect } from 'react'

const PageTransition = ({ children, location }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Reset and start entering animation
    setIsVisible(false)
    
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [location])

  return (
    <div
      className={`transition-all duration-600 ease-out ${
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-8'
      }`}
    >
      {children}
    </div>
  )
}

export default PageTransition
