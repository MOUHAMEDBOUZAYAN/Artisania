import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 error received, clearing token')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Ne pas rediriger automatiquement, laisser les composants gérer
    }
    return Promise.reject(error)
  }
)

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

export const productService = {
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search/${query}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getMyProducts: () => api.get('/products/my-products')
}

export const shopService = {
  getShops: (params = {}) => api.get('/shops', { params }),
  getShop: (id) => api.get(`/shops/${id}`),
  getFeaturedShops: () => api.get('/shops/featured'),
  searchShops: (query) => api.get(`/shops/search/${query}`),
  getShopsByCategory: (category) => api.get(`/shops/category/${category}`),
  createShop: (shopData) => api.post('/shops', shopData),
  updateShop: (id, shopData) => api.put(`/shops/${id}`, shopData),
  getMyShop: () => api.get('/shops/my-shop'),
  getShopProducts: (id) => api.get(`/shops/${id}/products`)
}

export const orderService = {
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params = {}) => api.get('/orders/my-orders', { params }),
  getShopOrders: (params = {}) => api.get('/orders/shop-orders', { params }),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getOrderStats: () => api.get('/orders/stats')
}

export const userService = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  changePassword: (id, passwordData) => api.put(`/users/${id}/password`, passwordData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: (id) => api.get(`/users/${id}/stats`)
}

export default api
