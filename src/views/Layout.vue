<template>
  <el-container class="layout">
    <el-aside width="240px" class="aside">
      <div class="logo">MailWeb</div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <template v-for="menu in menus">
          <el-submenu v-if="menu.menuType === 'DIR'" :key="'dir-' + menu.id" :index="'dir-' + menu.id">
            <template slot="title">
              <i :class="menu.icon || 'el-icon-folder'"></i>
              <span>{{ menu.menuName }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children || []"
              :key="child.id"
              :index="child.path"
            >
              <i :class="child.icon || 'el-icon-document'"></i>
              <span slot="title">{{ child.menuName }}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else-if="menu.menuType === 'MENU'" :key="'menu-' + menu.id" :index="menu.path">
            <i :class="menu.icon || 'el-icon-document'"></i>
            <span slot="title">{{ menu.menuName }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="page-title">{{ pageTitle }}</span>
        <div class="user-area">
          <span>{{ displayName }}</span>
          <el-button type="text" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  data() {
    return {
      menus: []
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    },
    pageTitle() {
      return (this.$route.meta && this.$route.meta.title) || '主页'
    },
    displayName() {
      try {
        const user = JSON.parse(localStorage.getItem('mailweb_user') || '{}')
        return user.nickname || user.username || '用户'
      } catch (e) {
        return '用户'
      }
    }
  },
  created() {
    this.loadMenus()
  },
  methods: {
    loadMenus() {
      try {
        this.menus = JSON.parse(localStorage.getItem('mailweb_menus') || '[]')
      } catch (e) {
        this.menus = []
      }
    },
    logout() {
      localStorage.removeItem('mailweb_token')
      localStorage.removeItem('mailweb_user')
      localStorage.removeItem('mailweb_menus')
      this.$router.replace('/login')
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.aside {
  background: #304156;
}
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  background: #263445;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebeef5;
  background: #fff;
}
.page-title {
  font-size: 18px;
  font-weight: 600;
}
.user-area {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #606266;
}
.main {
  background: #f5f7fa;
}
</style>
