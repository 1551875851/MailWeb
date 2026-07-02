<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <div class="title">邮件管理平台</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="0" @submit.native.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            prefix-icon="el-icon-lock"
            type="password"
            placeholder="密码"
            show-password
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="button" style="width: 100%" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="hint">默认超级管理员：admin / admin123</div>
    </el-card>
  </div>
</template>

<script>
import { login } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: 'admin',
        password: 'admin123'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.loading = true
        try {
          const data = await login(this.form)
          localStorage.setItem('mailweb_token', data.token)
          localStorage.setItem('mailweb_user', JSON.stringify(data.user || {}))
          localStorage.setItem('mailweb_menus', JSON.stringify(data.menus || []))
          this.$message.success('登录成功')
          const redirect = this.$route.query.redirect || '/'
          this.$router.replace(redirect)
        } catch (e) {
          this.$message.error(e.message || '登录失败')
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
}
.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
}
.hint {
  text-align: center;
  color: #909399;
  font-size: 13px;
}
</style>
