<template>
  <el-card shadow="never">
    <div slot="header" class="toolbar">
      <span>菜单管理</span>
      <el-button type="primary" size="small" @click="openDialog()">新增菜单</el-button>
    </div>
    <el-table :data="tableData" border stripe row-key="id">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="menuType" label="类型" width="90" />
      <el-table-column prop="path" label="路由路径" />
      <el-table-column prop="icon" label="图标" />
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

    <el-dialog :title="form.id ? '编辑菜单' : '新增菜单'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.menuName" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-select v-model="form.menuType" style="width:100%">
            <el-option label="目录" value="DIR" />
            <el-option label="菜单" value="MENU" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" style="width:100%">
            <el-option :value="0" label="无上级" />
            <el-option v-for="item in parentMenus" :key="item.id" :label="item.menuName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="路由路径">
          <el-input v-model="form.path" placeholder="如 /system/user" />
        </el-form-item>
        <el-form-item label="组件名">
          <el-input v-model="form.component" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon" placeholder="如 el-icon-user" />
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
import { listMenus, createMenu, updateMenu, deleteMenu } from '@/api/system'

export default {
  name: 'MenuManage',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      saving: false,
      form: this.emptyForm(),
      rules: {
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }]
      }
    }
  },
  computed: {
    parentMenus() {
      return this.tableData.filter(item => item.menuType === 'DIR')
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    emptyForm() {
      return {
        id: null,
        menuName: '',
        menuType: 'MENU',
        parentId: 0,
        path: '',
        component: '',
        icon: '',
        sortOrder: 0,
        visible: 1,
        status: 1
      }
    },
    async loadData() {
      this.tableData = await listMenus()
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
            await updateMenu(this.form.id, this.form)
          } else {
            await createMenu(this.form)
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
      this.$confirm(`确认删除菜单 ${row.menuName} 吗？`, '提示', { type: 'warning' })
        .then(async () => {
          await deleteMenu(row.id)
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
