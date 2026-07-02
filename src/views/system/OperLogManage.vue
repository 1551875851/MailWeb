<template>
  <el-card shadow="never">
    <div slot="header" class="toolbar">
      <span>日志管理</span>
    </div>

    <el-form :inline="true" :model="query" class="query-form">
      <el-form-item label="用户名">
        <el-input v-model="query.username" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item label="操作类型">
        <el-select v-model="query.operType" placeholder="全部" clearable style="width: 140px">
          <el-option label="登录" value="LOGIN" />
          <el-option label="进入菜单" value="MENU" />
          <el-option label="查询" value="QUERY" />
          <el-option label="操作" value="ACTION" />
          <el-option label="新增" value="CREATE" />
          <el-option label="修改" value="UPDATE" />
          <el-option label="删除" value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称">
        <el-input v-model="query.menuName" placeholder="菜单名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" width="110" />
      <el-table-column prop="moduleName" label="模块" width="110" />
      <el-table-column prop="menuName" label="菜单" width="120" />
      <el-table-column prop="operType" label="类型" width="90">
        <template slot-scope="scope">
          <el-tag size="mini">{{ operTypeLabel(scope.row.operType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operDesc" label="操作描述" min-width="180" show-overflow-tooltip />
      <el-table-column prop="clientIp" label="IP" width="130" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="mini">
            {{ scope.row.status === 1 ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="操作时间" width="170" />
    </el-table>

    <div class="pager">
      <el-pagination
        background
        layout="total, prev, pager, next, sizes"
        :current-page.sync="query.pageNum"
        :page-size.sync="query.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        @current-change="loadData"
        @size-change="handleSizeChange"
      />
    </div>
  </el-card>
</template>

<script>
import { listOperLogs } from '@/api/operLog'
import { logQuery } from '@/utils/operLog'

export default {
  name: 'OperLogManage',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      query: {
        pageNum: 1,
        pageSize: 10,
        username: '',
        operType: '',
        menuName: ''
      }
    }
  },
  created() {
    this.loadData(false)
  },
  methods: {
    operTypeLabel(type) {
      const map = {
        LOGIN: '登录',
        MENU: '菜单',
        QUERY: '查询',
        ACTION: '操作',
        CREATE: '新增',
        UPDATE: '修改',
        DELETE: '删除'
      }
      return map[type] || type
    },
    async loadData(needLog = true) {
      if (needLog) {
        await logQuery('日志管理', '系统管理', '查询操作日志列表')
      }
      this.loading = true
      try {
        const data = await listOperLogs(this.query)
        this.tableData = data.list || []
        this.total = data.total || 0
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.loading = false
      }
    },
    handleQuery() {
      this.query.pageNum = 1
      this.loadData()
    },
    resetQuery() {
      this.query = {
        pageNum: 1,
        pageSize: 10,
        username: '',
        operType: '',
        menuName: ''
      }
      this.loadData()
    },
    handleSizeChange() {
      this.query.pageNum = 1
      this.loadData()
    }
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.query-form {
  margin-bottom: 12px;
}
.pager {
  margin-top: 16px;
  text-align: right;
}
</style>
