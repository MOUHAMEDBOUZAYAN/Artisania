import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Vérifier si l'utilisateur est administrateur
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Administrateur Requis</h1>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux administrateurs uniquement.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Retour
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Si l'utilisateur est administrateur, afficher le composant
  return children
}

export default AdminRoute
