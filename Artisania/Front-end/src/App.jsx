import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import PageTransition from './components/PageTransition'
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

function AppContent() {
  const location = useLocation()
  
  // Routes that should not show header
  const noHeaderRoutes = ['/login', '/register']
  const shouldShowHeader = !noHeaderRoutes.includes(location.pathname)
  
  // Routes that should have page transitions
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      {shouldShowHeader && <Header />}
      <main className={shouldShowHeader ? "container mx-auto px-4 py-8" : ""}>
        {isAuthRoute ? (
          <PageTransition location={location.pathname}>
            <Routes location={location}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </PageTransition>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/shops/:id" element={<ShopDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/shop" element={<ShopManagement />} />
            <Route path="/dashboard/products" element={<ProductManagement />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
