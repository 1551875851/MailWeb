<template>
  <el-card shadow="never">
    <div slot="header">软考工作动态扫描</div>
    <p class="desc">调用后端接口：POST /api/ruankao/scan</p>
    <el-button type="primary" :loading="loading" @click="handleScan">开始扫描</el-button>
    <el-divider v-if="result" content-position="left">接口返回</el-divider>
    <div v-if="result">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="message">{{ result.message }}</el-descriptions-item>
        <el-descriptions-item label="matched">{{ result.matched }}</el-descriptions-item>
        <el-descriptions-item label="emailSent">{{ result.emailSent }}</el-descriptions-item>
        <el-descriptions-item label="matchedTitles">
          <span v-if="!result.matchedTitles || !result.matchedTitles.length">无</span>
          <ul v-else class="title-list">
            <li v-for="(item, index) in result.matchedTitles" :key="index">{{ item }}</li>
          </ul>
        </el-descriptions-item>
      </el-descriptions>
      <pre class="result-json">{{ resultJson }}</pre>
    </div>
  </el-card>
</template>

<script>
import { scanRuankao } from '@/api/mail'

export default {
  name: 'RuankaoScan',
  data() {
    return {
      loading: false,
      result: null,
      resultJson: ''
    }
  },
  methods: {
    async handleScan() {
      this.loading = true
      this.result = null
      this.resultJson = ''
      try {
        const data = await scanRuankao()
        this.result = data
        this.resultJson = JSON.stringify(data, null, 2)
        this.$message.success('扫描完成')
      } catch (e) {
        const message = e.message || '扫描失败'
        this.$message.error(message)
        this.resultJson = message
      } finally {
        this.loading = false
      }
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
.title-list {
  margin: 0;
  padding-left: 18px;
}
.result-json {
  margin-top: 16px;
  padding: 12px;
  background: #f4f4f5;
  border-radius: 4px;
  overflow: auto;
}
</style>
