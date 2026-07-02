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
    redirect: '/email/mail',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'email/mail',
        name: 'MailSend',
        component: MailSend,
        meta: { title: '发送邮件', requiresAuth: true }
      },
      {
        path: 'email/ruankao',
        name: 'RuankaoScan',
        component: RuankaoScan,
        meta: { title: '软考扫描', requiresAuth: true }
      },
      {
        path: 'system/user',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理', requiresAuth: true }
      },
      {
        path: 'system/role',
        name: 'RoleManage',
        component: RoleManage,
        meta: { title: '角色管理', requiresAuth: true }
      },
      {
        path: 'system/org',
        name: 'OrgManage',
        component: OrgManage,
        meta: { title: '机构管理', requiresAuth: true }
      },
      {
        path: 'system/menu',
        name: 'MenuManage',
        component: MenuManage,
        meta: { title: '菜单管理', requiresAuth: true }
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

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('mailweb_token')
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token) {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.fullPath } })
    }
  } else if (to.path === '/login' && token) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
