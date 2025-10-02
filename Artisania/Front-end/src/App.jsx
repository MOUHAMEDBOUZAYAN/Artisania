import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import Shops from './pages/Shops'
import Dashboard from './pages/Dashboard'
import ShopManagement from './pages/ShopManagement'
import ProductManagement from './pages/ProductManagement'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/shop" element={<ShopManagement />} />
              <Route path="/dashboard/products" element={<ProductManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
