<template>
  <el-container class="layout">
    <el-aside width="220px" class="aside">
      <div class="logo">MailWeb</div>
      <el-menu
        :default-active="activeMenu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/mail">
          <i class="el-icon-message"></i>
          <span slot="title">发送邮件</span>
        </el-menu-item>
        <el-menu-item index="/ruankao">
          <i class="el-icon-search"></i>
          <span slot="title">软考扫描</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <span class="page-title">{{ pageTitle }}</span>
        <div class="user-area">
          <span>{{ username }}</span>
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
  computed: {
    activeMenu() {
      return this.$route.path
    },
    pageTitle() {
      return (this.$route.meta && this.$route.meta.title) || '主页'
    },
    username() {
      return localStorage.getItem('mailweb_user') || 'admin'
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('mailweb_token')
      localStorage.removeItem('mailweb_user')
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
