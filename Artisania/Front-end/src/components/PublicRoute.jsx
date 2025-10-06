import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Si l'utilisateur est déjà authentifié, rediriger vers la page par défaut
  if (isAuthenticated) {
    // Récupérer la page d'origine depuis l'état de navigation, sinon utiliser redirectTo
    const from = location.state?.from?.pathname || redirectTo
    return <Navigate to={from} replace />
  }

  // Si l'utilisateur n'est pas authentifié, afficher le composant (login/register)
  return children
}

export default PublicRoute
