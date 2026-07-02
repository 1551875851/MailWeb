<template>
  <el-card shadow="never">
    <div slot="header" class="toolbar">
      <span>用户管理</span>
      <el-button type="primary" size="small" @click="openDialog()">新增用户</el-button>
    </div>
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="orgName" label="机构" />
      <el-table-column label="超级管理员" width="110">
        <template slot-scope="scope">{{ scope.row.isSuperAdmin === 1 ? '是' : '否' }}</template>
      </el-table-column>
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

    <el-dialog :title="form.id ? '编辑用户' : '新增用户'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" :prop="form.id ? '' : 'password'">
          <el-input v-model="form.password" type="password" :placeholder="form.id ? '留空则不修改' : '请输入密码'" show-password />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="机构">
          <el-select v-model="form.orgId" placeholder="请选择机构" style="width:100%">
            <el-option v-for="item in orgList" :key="item.id" :label="item.orgName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleIds" multiple placeholder="请选择角色" style="width:100%">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id" />
          </el-select>
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
import { listUsers, getUser, createUser, updateUser, deleteUser, listRoles, listOrgs } from '@/api/system'

export default {
  name: 'UserManage',
  data() {
    return {
      tableData: [],
      orgList: [],
      roleList: [],
      dialogVisible: false,
      saving: false,
      roleIds: [],
      form: this.emptyForm(),
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    emptyForm() {
      return { id: null, username: '', password: '', nickname: '', orgId: null, status: 1, isSuperAdmin: 0 }
    },
    async loadData() {
      const [users, orgs, roles] = await Promise.all([listUsers(), listOrgs(), listRoles()])
      this.tableData = users
      this.orgList = orgs
      this.roleList = roles
    },
    async openDialog(row) {
      if (row) {
        const detail = await getUser(row.id)
        this.form = { ...detail.user, password: '' }
        this.roleIds = detail.roleIds || []
      } else {
        this.form = this.emptyForm()
        this.roleIds = []
      }
      this.dialogVisible = true
    },
    handleSave() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const payload = { user: { ...this.form }, roleIds: this.roleIds }
          if (this.form.id) {
            await updateUser(this.form.id, payload)
          } else {
            await createUser(payload)
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
      this.$confirm(`确认删除用户 ${row.username} 吗？`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteUser(row.id)
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
