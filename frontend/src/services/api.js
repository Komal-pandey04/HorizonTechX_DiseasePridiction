import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:8000', timeout: 20000 })
export const predictHeart    = d => API.post('/predict/heart', d)
export const predictDiabetes = d => API.post('/predict/diabetes', d)
export const predictBreast   = d => API.post('/predict/breast', d)
export const getHistory      = ()  => API.get('/history')
export const deleteHistory   = id  => API.delete(`/history/${id}`)
export const getMetrics      = ()  => API.get('/metrics')
export const getStats        = ()  => API.get('/stats')
