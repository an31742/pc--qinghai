<template>
  <div class="app-container">
    <div class="title-content">角色列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="角色名称">
            <el-input v-model="searchForm.roleName" placeholder="角色名称" />
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="search" />
            </el-tooltip>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="el-icon-refresh" circle @click="refresh" />
            </el-tooltip>
          </el-form-item>
          <el-button type="primary" size="small" style="float:right;" icon="el-icon-plus" @click="addRole()">添加角色</el-button>
        </el-form>
      </div>
      <div class="main-content-table">
        <el-table :data="roleTable" border>
          <el-table-column prop="roleCode" label="角色代码" align="center" />
          <el-table-column prop="roleName" label="角色名称" align="center" />
          <!-- <el-table-column prop="date" label="创建人" align="center" /> -->
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="roleDesc" label="说明" align="center" />
          <el-table-column prop="isEdit" label="是否允许编辑" align="center" />
          <el-table-column prop="isDelete" label="是否允许删除" align="center" />
          <el-table-column label="操作" width="300" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="configRoles(scope.$index,scope.row)">配置资源</el-button>
              <el-button v-if="scope.row.isEdit === '是'" type="text" class="primary-button" @click="editRole(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.isDelete === '是'" type="text" @click="delRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="main-content-pagination">
        <el-pagination
          align="center"
          :current-page="current"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="size"
          :total="total"
          class="app-table-pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog :title="textMap[dialogStatus]" center :close-on-click-modal="false" :visible.sync="addDialog" width="40%">
      <el-form ref="form" :rules="rules" :model="roleInfo" label-position="left" label-width="100px">
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="roleInfo.roleCode" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleInfo.roleName" />
        </el-form-item>
        <el-form-item label="角色说明" prop="roleDesc">
          <el-input v-model="roleInfo.roleDesc" type="textarea" />
        </el-form-item>
        <el-form-item label="当前角色是否允许编辑" prop="isEdit">
          <el-select v-model="roleInfo.isEdit" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前角色是否允许删除" prop="isDelete">
          <el-select v-model="roleInfo.isDelete" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="onSubmitRoleForm('rolesForm')">新增</el-button>
        <el-button v-else type="primary" @click="onSubmitRoleForm('rolesForm')">更新</el-button>
      </div>
    </el-dialog>
    <!-- 树结构 -->
    <el-dialog
      title="角色配置菜单"
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="treeDialog"
      width="40%"
    >
      <div style="height:400px;overflow:auto">
        <el-tree
          ref="menuTree"
          show-close
          :data="treeData"
          node-key="perm"
          :props="defaultProps"
          show-checkbox
          :check-strictly="false"
          :default-expand-all="true"
          :default-checked-keys="defaultCheckedKeys"
          @check-change="handleCheckChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideTree">取消</el-button>
        <el-button @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleApi from '@/api/manage/role'
// import menuApi from '@/api/manage/menu'
// import tree from '@/utils/tree'
import { resetTemp } from '@/utils'
import routerTree from './routerTree'
export default {
  data() {
    return {
      addDialog: false,
      treeDialog: false,
      roleInfo: {
        roleName: '',
        roleCode: '',
        roleDesc: '',
        isDelete: '',
        isEdit: ''
      },
      treeIndex: 0,
      treeData: [],
      checkedMenus: '', // 选中的菜单集合
      roleId: '', // 更新角色需要
      defaultCheckedKeys: [],
      searchForm: {
        roleName: ''
      },
      roleTable: [],
      // 分页相关
      current: 1,
      size: 10,
      total: null,
      dialogStatus: 'create',
      textMap: {
        update: '编辑角色',
        create: '新增角色'
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleCode: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
        isDelete: [{ required: true, message: '请选择是否删除', trigger: 'blur' }],
        isEdit: [{ required: true, message: '请选择是否编辑', trigger: 'blur' }]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    // 得到路由树
    this.fetchList()
    this.fetchTree()
  },
  methods: {
    // 角色列表
    fetchList() {
      const params = {
        ...this.searchForm,
        current: 1,
        size: this.size
      }
      const isEditArr = ['否', '是']
      const isDeleteArr = ['否', '是']
      roleApi.listRole(params).then(res => {
        this.roleTable = res.data.records
        this.roleTable.forEach(item => {
          item.isEdit = isEditArr[item.isEdit]
          item.isDelete = isDeleteArr[item.isDelete]
        })
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    // 获取路由菜单树
    fetchTree() {
      this.treeData = routerTree
    },
    // 查询过滤
    search() {
      this.fetchList()
    },
    refresh() {
      resetTemp(this.searchForm)
      this.fetchList()
    },
    // 添加角色/编辑更新
    onSubmitRoleForm() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        if (this.dialogStatus === 'create') {
          roleApi.addRole(this.roleInfo).then((res) => {
            this.fetchList()
            this.addDialog = false
            this.$message.success('添加角色成功')
          })
        } else if (this.dialogStatus === 'update') {
          roleApi.updateRole({ roleId: this.roleId, ...this.roleInfo }).then(res => {
            this.fetchList()
            this.addDialog = false
            this.$message.success('更新角色信息成功')
          })
        }
      })
    },
    // 配置角色（回显当前角色的菜单）
    configRoles(index, row) {
      this.treeDialog = true
      this.roleId = row.roleId
      roleApi.queryMenusByRoleId({ roleId: row.roleId }).then(res => {
        this.defaultCheckedKeys = res.data.filter(item => item.includes(':'))
        if (res.data.indexOf('workbench') !== -1) {
          this.defaultCheckedKeys.push('workbench')
        }
      })
    },
    // 选择树节点
    handleCheckChange(data, checked, indeterminate) {
      const checkedMenus = this.$refs['menuTree'].getCheckedNodes().map(item => {
        if (item.parent) {
          return [item.parent, item.perm]
        } else {
          return item.perm
        }
      }).flat()
      this.checkedMenus = Array.from(new Set(checkedMenus))
    },
    // 替换
    hideTree() {
      this.treeDialog = false
      this.$refs.menuTree.setCheckedNodes([])
    },
    submit() {
      const params = {
        roleId: this.roleId,
        list: this.checkedMenus
      }
      roleApi.configMenu(params).then(res => {
        this.$message.success('角色配置菜单成功')
        this.treeDialog = false
        this.fetchList()
        this.$refs.menuTree.setCheckedNodes([])
      })
    },
    // 新增角色
    addRole() {
      resetTemp(this.roleInfo)
      this.addDialog = true
      this.dialogStatus = 'create'
    },
    // 编辑角色
    editRole(row) {
      this.roleId = row.roleId
      this.dialogStatus = 'update'
      // 清空对象
      resetTemp(this.roleInfo)
      // for循环处理是否与1,0转换
      for (var key in this.roleInfo) {
        if (key === 'isEdit' || key === 'isDelete') {
          this.roleInfo[key] = row[key] === '是' ? '1' : '0'
        } else {
          this.roleInfo[key] = row[key]
        }
      }
      this.addDialog = true
    },
    // 删除角色
    delRole(row) {
      this.$confirm('您确定要永久删除该角色？', '提示', {
        type: 'warning'
      }).then(() => {
        roleApi.deleteRole(row.roleId).then(res => {
          this.fetchList()
          this.$message.success('删除角色成功')
        })
      }).catch(() => {
        this.$message('已取消删除')
      })
    },
    // 禁用
    configDisable() {

    },
    // 分页部分方法
    handleSizeChange(val) {
      this.size = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.fetchList()
    }
  }
}
</script>

<style lang='scss' scoped>
.pagination{
  margin-top: 20px;
}
// /deep/.el-tree-node {
//   .is-leaf + .el-checkbox .el-checkbox__inner {
//     display: inline-block;
//   }
//   .el-checkbox .el-checkbox__inner {
//     display: none;
//   }
// }
</style>
