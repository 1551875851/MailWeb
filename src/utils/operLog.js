import { reportOperLog } from '@/api/operLog'
import router from '@/router'

export function logOperation(payload) {
  const route = router.currentRoute
  const data = {
    operType: payload.operType || 'ACTION',
    moduleName: payload.moduleName || (route.meta && route.meta.moduleName) || '系统',
    menuName: payload.menuName || (route.meta && route.meta.title),
    operDesc: payload.operDesc,
    requestUri: payload.requestUri || route.path,
    requestMethod: payload.requestMethod || 'GET',
    status: payload.status == null ? 1 : payload.status,
    errorMessage: payload.errorMessage || null
  }
  return reportOperLog(data).catch(() => {})
}

export function logQuery(menuName, moduleName, operDesc) {
  return logOperation({
    operType: 'QUERY',
    moduleName,
    menuName,
    operDesc: operDesc || `查询${menuName}数据`
  })
}

export function logAction(operDesc, payload = {}) {
  return logOperation({
    operType: 'ACTION',
    operDesc,
    ...payload
  })
}
