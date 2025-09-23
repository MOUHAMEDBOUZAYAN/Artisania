import axios from 'axios'

// Base URL for API
const API_BASE_URL = 'http://localhost:5001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth service
export const authService = {
  // Register user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Get current user
  getMe: () => api.get('/auth/me'),
  
  // Logout user
  logout: () => api.post('/auth/logout')
}

// Product service
export const productService = {
  // Get all products
  getProducts: (params = {}) => api.get('/products', { params }),
  
  // Get product by ID
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Search products
  searchProducts: (query) => api.get(`/products/search/${query}`),
  
  // Get products by category
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  
  // Create product (seller/admin)
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product (owner/admin)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product (owner/admin)
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Get my products (seller/admin)
  getMyProducts: () => api.get('/products/my-products')
}

// Shop service
export const shopService = {
  // Get all shops
  getShops: (params = {}) => api.get('/shops', { params }),
  
  // Get shop by ID
  getShop: (id) => api.get(`/shops/${id}`),
  
  // Get featured shops
  getFeaturedShops: () => api.get('/shops/featured'),
  
  // Search shops
  searchShops: (query) => api.get(`/shops/search/${query}`),
  
  // Get shops by category
  getShopsByCategory: (category) => api.get(`/shops/category/${category}`),
  
  // Create shop (seller/admin)
  createShop: (shopData) => api.post('/shops', shopData),
  
  // Update shop (owner/admin)
  updateShop: (id, shopData) => api.put(`/shops/${id}`, shopData),
  
  // Get my shop (seller/admin)
  getMyShop: () => api.get('/shops/my-shop'),
  
  // Get shop products
  getShopProducts: (id) => api.get(`/shops/${id}/products`)
}

// Order service
export const orderService = {
  // Get all orders (admin)
  getOrders: (params = {}) => api.get('/orders', { params }),
  
  // Get order by ID
  getOrder: (id) => api.get(`/orders/${id}`),
  
  // Get my orders
  getMyOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  
  // Get shop orders (seller)
  getShopOrders: (params = {}) => api.get('/orders/shop-orders', { params }),
  
  // Create order
  createOrder: (orderData) => api.post('/orders', orderData),
  
  // Update order status (shop owner/admin)
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  
  // Cancel order
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  
  // Get order statistics
  getOrderStats: () => api.get('/orders/stats')
}

// User service
export const userService = {
  // Get all users (admin)
  getUsers: (params = {}) => api.get('/users', { params }),
  
  // Get user by ID
  getUser: (id) => api.get(`/users/${id}`),
  
  // Update user profile
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Change password
  changePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
  
  // Delete user account
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Get user statistics
  getUserStats: (id) => api.get(`/users/${id}/stats`)
}

export default api
