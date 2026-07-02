<template>
  <el-card shadow="never">
    <div slot="header" class="toolbar">
      <span>机构管理</span>
      <el-button type="primary" size="small" @click="openDialog()">新增机构</el-button>
    </div>
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="orgName" label="机构名称" />
      <el-table-column prop="orgCode" label="机构编码" />
      <el-table-column prop="parentId" label="上级ID" width="90" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row)">编辑</el-button>
          <el-button type="text" style="color:#f56c6c" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="form.id ? '编辑机构' : '新增机构'" :visible.sync="dialogVisible" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="form.orgName" />
        </el-form-item>
        <el-form-item label="机构编码" prop="orgCode">
          <el-input v-model="form.orgCode" />
        </el-form-item>
        <el-form-item label="上级机构">
          <el-select v-model="form.parentId" placeholder="无上级则选0" style="width:100%">
            <el-option :value="0" label="无上级" />
            <el-option v-for="item in tableData" :key="item.id" :label="item.orgName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { listOrgs, createOrg, updateOrg, deleteOrg } from '@/api/system'

export default {
  name: 'OrgManage',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      saving: false,
      form: this.emptyForm(),
      rules: {
        orgName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入机构编码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    emptyForm() {
      return { id: null, orgName: '', orgCode: '', parentId: 0, sortOrder: 0, status: 1 }
    },
    async loadData() {
      this.tableData = await listOrgs()
    },
    openDialog(row) {
      this.form = row ? { ...row } : this.emptyForm()
      this.dialogVisible = true
    },
    handleSave() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          if (this.form.id) {
            await updateOrg(this.form.id, this.form)
          } else {
            await createOrg(this.form)
          }
          this.$message.success('保存成功')
          this.dialogVisible = false
          this.loadData()
        } catch (e) {
          this.$message.error(e.message)
        } finally {
          this.saving = false
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`确认删除机构 ${row.orgName} 吗？`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteOrg(row.id)
          this.$message.success('删除成功')
          this.loadData()
        })
        .catch(() => {})
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
</style>
