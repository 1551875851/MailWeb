import request from '@/utils/request'

export function listOperLogs(params) {
  return request.get('/system/oper-logs', { params })
}

export function reportOperLog(data) {
  return request.post('/system/oper-logs', data)
}
