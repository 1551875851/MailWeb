import axios from 'axios'
import router from '@/router'

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
  responseType: 'json',
  responseEncoding: 'utf8',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json;charset=UTF-8'
  }
})

request.interceptors.request.use(config => {
  const token = localStorage.getItem('mailweb_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  response => {
    const data = response.data
    if (data && typeof data.code === 'number') {
      if (data.code === 200) {
        return data.data
      }
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  error => {
    const status = error.response && error.response.status
    const respData = error.response && error.response.data
    if (status === 401) {
      localStorage.removeItem('mailweb_token')
      localStorage.removeItem('mailweb_user')
      localStorage.removeItem('mailweb_menus')
      if (router.currentRoute.path !== '/login') {
        router.replace({ path: '/login', query: { redirect: router.currentRoute.fullPath } })
      }
      return Promise.reject(new Error('登录已过期，请重新登录'))
    }
    const message = (respData && respData.message) || error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export default request
