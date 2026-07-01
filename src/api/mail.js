import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

request.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response && error.response.data && error.response.data.message
      ? error.response.data.message
      : error.message || '请求失败'
    return Promise.reject(new Error(message))
  }
)

export function sendMail(data) {
  return request.post('/mail/send', data)
}

export function scanRuankao() {
  return request.post('/ruankao/scan')
}
