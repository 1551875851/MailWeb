<template>
  <el-card shadow="never">
    <div slot="header">发送邮件</div>
    <p class="desc">调用后端接口：POST /api/mail/send</p>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="max-width: 560px">
      <el-form-item label="主题" prop="subject">
        <el-input v-model="form.subject" placeholder="邮件主题" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="form.content" type="textarea" :rows="5" placeholder="邮件正文" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleSubmit">发送</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-divider v-if="result" content-position="left">接口返回</el-divider>
    <el-alert v-if="result" :title="result.message" type="success" show-icon :closable="false" />
    <pre v-if="resultJson" class="result-json">{{ resultJson }}</pre>
  </el-card>
</template>

<script>
import { sendMail } from '@/api/mail'

export default {
  name: 'MailSend',
  data() {
    return {
      loading: false,
      form: {
        subject: 'cursor Test',
        content: '这是一个测试邮件。'
      },
      rules: {
        subject: [{ required: true, message: '请输入主题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      result: null,
      resultJson: ''
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        this.loading = true
        this.result = null
        this.resultJson = ''
        try {
          const data = await sendMail(this.form)
          this.result = data
          this.resultJson = JSON.stringify(data, null, 2)
          this.$message.success('请求成功')
        } catch (e) {
          const message = e.message || '发送失败'
          this.$message.error(message)
          this.resultJson = message
        } finally {
          this.loading = false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.result = null
      this.resultJson = ''
    }
  }
}
</script>

<style scoped>
.desc {
  color: #909399;
  margin-top: 0;
  margin-bottom: 20px;
}
.result-json {
  margin-top: 16px;
  padding: 12px;
  background: #f4f4f5;
  border-radius: 4px;
  overflow: auto;
}
</style>
