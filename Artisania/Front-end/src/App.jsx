import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import PublicRoute from './components/PublicRoute'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Shops from './pages/Shops'
import Dashboard from './pages/Dashboard'
import ShopManagement from './pages/ShopManagement'
import ProductManagement from './pages/ProductManagement'
import ShopDetail from './pages/ShopDetail'
import Orders from './pages/Orders'
import Cart from './components/Cart'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/shops/:id" element={<ShopDetail />} />
              
              {/* Routes publiques qui redirigent si connecté */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Routes protégées (nécessitent une authentification) */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              
              {/* Routes administrateur (nécessitent le rôle admin) */}
              <Route 
                path="/dashboard/shop" 
                element={
                  <AdminRoute>
                    <ShopManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/dashboard/products" 
                element={
                  <AdminRoute>
                    <ProductManagement />
                  </AdminRoute>
                } 
              />
              
              {/* Route 404 - doit être en dernier */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
