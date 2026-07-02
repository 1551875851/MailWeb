<template>
  <div class="home-page" v-loading="loading">
    <el-row :gutter="16" class="summary-row">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-label">今日访问量</div>
          <div class="summary-value primary">{{ summary.todayAccess }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-label">今日活跃用户</div>
          <div class="summary-value success">{{ summary.todayActiveUsers }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-label">系统用户总数</div>
          <div class="summary-value warning">{{ summary.totalUsers }}</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-label">今日接口成功率</div>
          <div class="summary-value info">{{ summary.todayApiSuccessRate }}%</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="chart-card">
          <div slot="header">近7日访问趋势</div>
          <div ref="trendChart" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="chart-card">
          <div slot="header">功能模块使用占比</div>
          <div ref="featureChart" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="chart-row">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="chart-card">
          <div slot="header">接口访问排行 TOP10</div>
          <div ref="apiChart" class="chart-box chart-box-tall"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="chart-card">
          <div slot="header">接口响应状态分布</div>
          <div ref="statusChart" class="chart-box chart-box-tall"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getDashboardStats } from '@/api/dashboard'
import { logQuery } from '@/utils/operLog'

export default {
  name: 'DashboardHome',
  data() {
    return {
      loading: false,
      summary: {
        todayAccess: 0,
        todayActiveUsers: 0,
        totalUsers: 0,
        todayApiSuccessRate: 0
      },
      charts: []
    }
  },
  mounted() {
    this.loadStats()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.disposeCharts()
  },
  methods: {
    async loadStats() {
      this.loading = true
      try {
        await logQuery('首页', '首页', '查询首页统计数据')
        const data = await getDashboardStats()
        this.summary = data.summary || this.summary
        this.$nextTick(() => {
          this.disposeCharts()
          this.renderTrendChart(data.accessTrend || [])
          this.renderFeatureChart(data.featureUsage || [])
          this.renderApiChart(data.apiRanking || [])
          this.renderStatusChart(data.statusDistribution || [])
        })
      } catch (e) {
        this.$message.error(e.message || '加载统计数据失败')
      } finally {
        this.loading = false
      }
    },
    renderTrendChart(trend) {
      const chart = this.initChart('trendChart')
      chart.setOption({
        tooltip: { trigger: 'axis' },
        legend: { data: ['访问量', '活跃用户'] },
        grid: { left: 40, right: 20, top: 40, bottom: 30 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trend.map(item => item.date)
        },
        yAxis: { type: 'value', minInterval: 1 },
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.15 },
            itemStyle: { color: '#409EFF' },
            data: trend.map(item => item.accessCount)
          },
          {
            name: '活跃用户',
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.12 },
            itemStyle: { color: '#67C23A' },
            data: trend.map(item => item.activeUserCount)
          }
        ]
      })
    },
    renderFeatureChart(featureUsage) {
      const chart = this.initChart('featureChart')
      chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0, type: 'scroll' },
        series: [
          {
            type: 'pie',
            radius: ['42%', '68%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
            label: { formatter: '{b}\n{d}%' },
            data: featureUsage.length ? featureUsage : [{ name: '暂无数据', value: 0 }]
          }
        ]
      })
    },
    renderApiChart(apiRanking) {
      const chart = this.initChart('apiChart')
      const labels = apiRanking.map(item => item.label).reverse()
      const values = apiRanking.map(item => item.count).reverse()
      chart.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 120, right: 30, top: 20, bottom: 20 },
        xAxis: { type: 'value', minInterval: 1 },
        yAxis: {
          type: 'category',
          data: labels.length ? labels : ['暂无数据'],
          axisLabel: { width: 100, overflow: 'truncate' }
        },
        series: [
          {
            type: 'bar',
            barMaxWidth: 24,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#83bff6' },
                { offset: 1, color: '#188df0' }
              ])
            },
            data: values.length ? values : [0]
          }
        ]
      })
    },
    renderStatusChart(statusDistribution) {
      const chart = this.initChart('statusChart')
      chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { bottom: 0 },
        color: ['#67C23A', '#E6A23C', '#F56C6C', '#909399'],
        series: [
          {
            type: 'pie',
            radius: '62%',
            center: ['50%', '45%'],
            roseType: 'radius',
            label: { formatter: '{b}\n{d}%' },
            data: statusDistribution.length ? statusDistribution : [{ name: '暂无数据', value: 0 }]
          }
        ]
      })
    },
    initChart(refName) {
      const dom = this.$refs[refName]
      const existing = echarts.getInstanceByDom(dom)
      if (existing) {
        existing.dispose()
      }
      const chart = echarts.init(dom)
      this.charts.push(chart)
      return chart
    },
    handleResize() {
      this.charts.forEach(chart => chart.resize())
    },
    disposeCharts() {
      this.charts.forEach(chart => chart.dispose())
      this.charts = []
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100%;
}
.summary-row,
.chart-row {
  margin-bottom: 16px;
}
.summary-card {
  margin-bottom: 16px;
}
.summary-label {
  color: #909399;
  font-size: 14px;
}
.summary-value {
  margin-top: 8px;
  font-size: 28px;
  font-weight: 600;
}
.summary-value.primary {
  color: #409eff;
}
.summary-value.success {
  color: #67c23a;
}
.summary-value.warning {
  color: #e6a23c;
}
.summary-value.info {
  color: #909399;
}
.chart-card {
  margin-bottom: 16px;
}
.chart-box {
  height: 320px;
}
.chart-box-tall {
  height: 360px;
}
</style>
