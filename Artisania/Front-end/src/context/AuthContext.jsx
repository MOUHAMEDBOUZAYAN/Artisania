import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(undefined)

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      }
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  console.log('🔐 AuthProvider rendering')
  const [state, dispatch] = useReducer(authReducer, initialState)
  console.log('🔐 AuthProvider state:', { 
    user: state.user?.email, 
    isAuthenticated: state.isAuthenticated,
    loading: state.loading 
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')
      console.log('Token from localStorage:', token)
      console.log('User from localStorage:', user)
      
      if (user && token) {
        const userFromStorage = JSON.parse(user)
        console.log('User and token found in localStorage, restoring session...')
        
        // Restaurer la session directement sans vérifier l'API
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: userFromStorage,
            token: token
          }
        })
        
        // Vérifier l'API en arrière-plan (optionnel)
        try {
          console.log('Verifying token with API in background...')
          const response = await authService.getMe()
          console.log('Token verified successfully with API')
        } catch (error) {
          console.log('Token verification failed, but keeping session for now')
          // Ne pas déconnecter l'utilisateur immédiatement
        }
      } else {
        console.log('No user or token found in localStorage')
        dispatch({
          type: 'AUTH_FAILURE',
          payload: null
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    console.log('AuthContext: Starting login process with credentials:', { email: credentials.email })
    dispatch({ type: 'AUTH_START' })
    try {
      console.log('AuthContext: Calling authService.login...')
      const response = await authService.login(credentials)
      console.log('AuthContext: Login response received:', response.data)
      const { user, token } = response.data

      console.log('AuthContext: Saving to localStorage...')
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      console.log('AuthContext: Token saved to localStorage:', token)
      console.log('AuthContext: User saved to localStorage:', user)
      
      console.log('AuthContext: Dispatching AUTH_SUCCESS...')
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })

      console.log('AuthContext: Login successful, returning success: true')
      return { success: true, user, token }
    } catch (error) {
      console.error('AuthContext: Login error:', error)
      console.error('AuthContext: Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || 'Login failed'
      console.log('AuthContext: Error message:', errorMessage)
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const response = await authService.register(userData)
      const { user, token } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      })

      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      dispatch({ type: 'LOGOUT' })
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  }

  console.log('🔐 AuthProvider providing value:', { 
    user: value.user?.email, 
    isAuthenticated: value.isAuthenticated,
    loading: value.loading 
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  console.log('🔐 useAuth called')
  const context = useContext(AuthContext)
  console.log('🔐 Context value:', context)
  
  if (!context) {
    console.error('❌ useAuth called outside AuthProvider!')
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  console.log('✅ useAuth returning context:', { 
    user: context.user?.email, 
    isAuthenticated: context.isAuthenticated 
  })
  return context
}

export default AuthContext
