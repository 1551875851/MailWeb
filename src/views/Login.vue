<template>
  <div class="login-page">
    <el-card class="login-card" shadow="always">
      <div class="title">MailWeb 管理系统</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="0">
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
          <el-button type="primary" style="width: 100%" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="hint">默认账号：admin / admin123</div>
    </el-card>
  </div>
</template>

<script>
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
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.loading = true
        setTimeout(() => {
          if (this.form.username === 'admin' && this.form.password === 'admin123') {
            localStorage.setItem('mailweb_token', 'logged-in')
            localStorage.setItem('mailweb_user', this.form.username)
            const redirect = this.$route.query.redirect || '/'
            this.$router.replace(redirect)
            this.$message.success('登录成功')
          } else {
            this.$message.error('用户名或密码错误')
          }
          this.loading = false
        }, 300)
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
  padding: 10px 20px 20px;
}
.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #303133;
}
.hint {
  text-align: center;
  color: #909399;
  font-size: 12px;
}
</style>
