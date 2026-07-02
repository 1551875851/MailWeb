import request from '@/utils/request'

export function listUsers() {
  return request.get('/system/users')
}

export function getUser(id) {
  return request.get(`/system/users/${id}`)
}

export function createUser(data) {
  return request.post('/system/users', data)
}

export function updateUser(id, data) {
  return request.put(`/system/users/${id}`, data)
}

export function deleteUser(id) {
  return request.delete(`/system/users/${id}`)
}

export function listRoles() {
  return request.get('/system/roles')
}

export function getRole(id) {
  return request.get(`/system/roles/${id}`)
}

export function createRole(data) {
  return request.post('/system/roles', data)
}

export function updateRole(id, data) {
  return request.put(`/system/roles/${id}`, data)
}

export function deleteRole(id) {
  return request.delete(`/system/roles/${id}`)
}

export function listOrgs() {
  return request.get('/system/orgs')
}

export function createOrg(data) {
  return request.post('/system/orgs', data)
}

export function updateOrg(id, data) {
  return request.put(`/system/orgs/${id}`, data)
}

export function deleteOrg(id) {
  return request.delete(`/system/orgs/${id}`)
}

export function listMenus() {
  return request.get('/system/menus')
}

export function listMenuTree() {
  return request.get('/system/menus/tree')
}

export function createMenu(data) {
  return request.post('/system/menus', data)
}

export function updateMenu(id, data) {
  return request.put(`/system/menus/${id}`, data)
}

export function deleteMenu(id) {
  return request.delete(`/system/menus/${id}`)
}
