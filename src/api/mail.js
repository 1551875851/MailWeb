import axios from 'axios'

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

function extractErrorMessage(error) {
  const data = error.response && error.response.data
  if (typeof data === 'string' && data) {
    return data
  }
  if (data && typeof data.message === 'string' && data.message) {
    return data.message
  }
  if (error.message) {
    return error.message
  }
  return '请求失败'
}

request.interceptors.response.use(
  response => response.data,
  error => Promise.reject(new Error(extractErrorMessage(error)))
)

export function sendMail(data) {
  return request.post('/mail/send', data)
}

export function scanRuankao() {
  return request.post('/ruankao/scan')
}
