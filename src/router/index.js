import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import MailSend from '@/views/MailSend.vue'
import RuankaoScan from '@/views/RuankaoScan.vue'

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
    redirect: '/mail',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'mail',
        name: 'MailSend',
        component: MailSend,
        meta: { title: '发送邮件', requiresAuth: true }
      },
      {
        path: 'ruankao',
        name: 'RuankaoScan',
        component: RuankaoScan,
        meta: { title: '软考扫描', requiresAuth: true }
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
