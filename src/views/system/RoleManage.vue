<template>
  <el-card shadow="never">
    <div slot="header" class="toolbar">
      <span>角色管理</span>
      <el-button type="primary" size="small" @click="openDialog()">新增角色</el-button>
    </div>
    <el-table :data="tableData" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="remark" label="备注" />
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

    <el-dialog :title="form.id ? '编辑角色' : '新增角色'" :visible.sync="dialogVisible" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="menuTree"
            :data="menuTree"
            show-checkbox
            node-key="id"
            :props="{ label: 'menuName', children: 'children' }"
            default-expand-all
          />
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
import { listRoles, getRole, createRole, updateRole, deleteRole, listMenuTree } from '@/api/system'
import { logOperation, logQuery } from '@/utils/operLog'

export default {
  name: 'RoleManage',
  data() {
    return {
      tableData: [],
      menuTree: [],
      dialogVisible: false,
      saving: false,
      form: this.emptyForm(),
      rules: {
        roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    emptyForm() {
      return { id: null, roleCode: '', roleName: '', remark: '', status: 1 }
    },
    async loadData(needLog = true) {
      if (needLog) {
        await logQuery('角色管理', '系统管理')
      }
      const [roles, menus] = await Promise.all([listRoles(), listMenuTree()])
      this.tableData = roles
      this.menuTree = menus
    },
    async openDialog(row) {
      this.form = row ? { ...row } : this.emptyForm()
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.menuTree) {
          this.$refs.menuTree.setCheckedKeys([])
        }
        if (row) {
          getRole(row.id).then(detail => {
            this.$nextTick(() => {
              this.$refs.menuTree && this.$refs.menuTree.setCheckedKeys(detail.menuIds || [])
            })
          })
        }
      })
    },
    handleSave() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.saving = true
        try {
          const checked = this.$refs.menuTree.getCheckedKeys()
          const half = this.$refs.menuTree.getHalfCheckedKeys()
          const menuIds = checked.concat(half)
          const payload = { role: { ...this.form }, menuIds }
          if (this.form.id) {
            await updateRole(this.form.id, payload)
            await logOperation({ operType: 'UPDATE', operDesc: `修改角色：${this.form.roleName}` })
          } else {
            await createRole(payload)
            await logOperation({ operType: 'CREATE', operDesc: `新增角色：${this.form.roleName}` })
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
      this.$confirm(`确认删除角色 ${row.roleName} 吗？`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteRole(row.id)
          await logOperation({ operType: 'DELETE', operDesc: `删除角色：${row.roleName}` })
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
