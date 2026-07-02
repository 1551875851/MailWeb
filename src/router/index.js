import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import MailSend from '@/views/MailSend.vue'
import RuankaoScan from '@/views/RuankaoScan.vue'
import UserManage from '@/views/system/UserManage.vue'
import RoleManage from '@/views/system/RoleManage.vue'
import OrgManage from '@/views/system/OrgManage.vue'
import MenuManage from '@/views/system/MenuManage.vue'
import OperLogManage from '@/views/system/OperLogManage.vue'
import DashboardHome from '@/views/Home.vue'
import { logOperation } from '@/utils/operLog'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: DashboardHome,
        meta: { title: '首页', moduleName: '首页', requiresAuth: true }
      },
      {
        path: 'email/mail',
        name: 'MailSend',
        component: MailSend,
        meta: { title: '发送邮件', moduleName: '邮件管理', requiresAuth: true }
      },
      {
        path: 'email/ruankao',
        name: 'RuankaoScan',
        component: RuankaoScan,
        meta: { title: '软考扫描', moduleName: '邮件管理', requiresAuth: true }
      },
      {
        path: 'system/user',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理', moduleName: '系统管理', requiresAuth: true }
      },
      {
        path: 'system/role',
        name: 'RoleManage',
        component: RoleManage,
        meta: { title: '角色管理', moduleName: '系统管理', requiresAuth: true }
      },
      {
        path: 'system/org',
        name: 'OrgManage',
        component: OrgManage,
        meta: { title: '机构管理', moduleName: '系统管理', requiresAuth: true }
      },
      {
        path: 'system/menu',
        name: 'MenuManage',
        component: MenuManage,
        meta: { title: '菜单管理', moduleName: '系统管理', requiresAuth: true }
      },
      {
        path: 'system/oper-log',
        name: 'OperLogManage',
        component: OperLogManage,
        meta: { title: '日志管理', moduleName: '系统管理', requiresAuth: true }
      },
      {
        path: 'mail',
        redirect: '/email/mail'
      },
      {
        path: 'ruankao',
        redirect: '/email/ruankao'
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

function isValidToken(token) {
  return token && token.split('.').length === 3
}

function clearSession() {
  localStorage.removeItem('mailweb_token')
  localStorage.removeItem('mailweb_user')
  localStorage.removeItem('mailweb_menus')
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('mailweb_token')
  const authed = isValidToken(token)

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (authed) {
      next()
    } else {
      if (token) {
        clearSession()
      }
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else if (to.path === '/login' && authed) {
    next({ path: '/' })
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  if (!to.meta || !to.meta.requiresAuth || !to.meta.title) {
    return
  }
  if (to.path === from.path) {
    return
  }
  logOperation({
    operType: 'MENU',
    moduleName: to.meta.moduleName,
    menuName: to.meta.title,
    operDesc: `进入菜单：${to.meta.title}`,
    requestUri: to.path
  })
})

export default router
