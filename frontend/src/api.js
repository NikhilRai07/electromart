import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8082/api' })
api.interceptors.request.use(config => {
  const token = localStorage.getItem('emart_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const getProducts = async () => (await api.get('/products')).data
export const login = async (email, password) => (await api.post('/auth/login', {email, password})).data
export const adminLogin = async (email, password) => (await api.post('/auth/admin/login', {email, password})).data
export const register = async (email, password) => (await api.post('/auth/register', {email, password})).data
export default api

// Experiment 7: Axios-based REST API CRUD operations
export const createProduct = async (product) => (await api.post('/products', product)).data
export const updateProduct = async (id, product) => (await api.put(`/products/${id}`, product)).data
export const deleteProduct = async (id) => api.delete(`/products/${id}`)

export const getProductReviews = async (productId) => (await api.get(`/products/${productId}/reviews`)).data
export const getAllReviews = async () => (await api.get('/reviews')).data
export const submitReview = async (review) => (await api.post('/reviews', review)).data
