<template>
  <div class="app-container">
    <h3 class="main-title-box" style="text-align: center">菜单管理</h3>
    <el-card>
      <el-row :gutter="20" class="tree-box">
        <el-col :span="8">
          <h5>所有菜单 <el-button type="text" @click="append"><i class="tree-btn el-icon-plus" /></el-button></h5>
          <el-tree :data="menuTree" node-key="id" default-expand-all highlight-current :expand-on-click-node="false" @node-click="treeNodeClick">
            <!-- <span slot-scope="{ node, data }" class="custom-tree-node"> -->
            <span slot-scope="{ data }" class="custom-tree-node">
              <span>{{ data.label }}</span>
              <span>
                <el-button type="text" size="mini" @click.stop="() => append(data)">
                  <i class="tree-btn el-icon-plus" />
                </el-button>
                <el-button type="text" size="mini" @click="() => edit(data)">
                  <i class="tree-btn el-icon-edit" />
                </el-button>
                <el-button type="text" size="mini" @click="() => del(data)">
                  <i class="tree-btn el-icon-delete" />
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
        <!-- 表格内容 -->
        <el-col :span="16" class="master-box">
          <el-button style="float:right" type="primary" size="small" @click="addMenu">+新增</el-button>
          <h4>菜单列表</h4>
          <el-table :data="menuTable" border size="small" style="width: 100%">
            <el-table-column prop="name" label="菜单名称" align="center" />
            <el-table-column prop="component" label="导航地址" align="center" />
            <el-table-column prop="sort" label="排序码" align="center" />
            <el-table-column prop="isEdit" label="是否允许编辑" align="center">
              <template slot-scope="scope">
                {{ scope.row.isEdit === '1' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="isDelete" label="是否允许删除" align="center">
              <template slot-scope="scope">
                {{ scope.row.isDelete === '1' ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isEdit === '1'" type="primary" size="small" @click="editMenu(scope.row)">编辑</el-button>
                <el-button v-if="scope.row.isDelete === '1'" type="primary" size="small" @click="delMenu(scope.row.menuId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
    <!-- 列表新增编辑 -->
    <el-dialog :title="textMap[dialogStatus]" center :close-on-click-modal="false" :visible.sync="addDialog" width="40%">
      <el-form ref="menuForm" :rules="rules" :model="menuInfo" label-position="left" label-width="100px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuInfo.name" />
        </el-form-item>
        <el-form-item label="导航地址" prop="path">
          <el-input v-model="menuInfo.path" />
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="menuInfo.sort" />
        </el-form-item>
        <el-form-item label="当前角色是否允许编辑" prop="isEdit">
          <el-select v-model="menuInfo.isEdit" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="当前角色是否允许删除" prop="isDelete">
          <el-select v-model="menuInfo.isDelete" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="onSubmitMenuForm">新增</el-button>
        <el-button v-else type="primary" @click="onSubmitMenuForm">更新</el-button>
      </div>
    </el-dialog>
    <!-- 树新增编辑 -->
    <el-dialog :title="textMap[dialogStatus]" center :close-on-click-modal="false" :visible.sync="treeAddDialog" width="40%">
      <el-form ref="treeMenuForm" :rules="rules" :model="treeMenuInfo" label-position="left" label-width="120px">
        <el-form-item label="菜单分类名称" prop="name">
          <el-input v-model="treeMenuInfo.name" />
        </el-form-item>
        <el-form-item label="排序码" prop="sort">
          <el-input v-model="treeMenuInfo.sort" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeAddDialog = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="onSubmitMenuTree">新增</el-button>
        <el-button v-else type="primary" @click="onSubmitMenuTree">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menuApi from '@/api/manage/menu'
// import { resetTemp } from '@/utils'
export default {
  data() {
    return {
      addDialog: false,
      treeAddDialog: false,
      // 右侧增加的
      menuInfo: {
        menuId: '',
        name: '',
        sort: '',
        path: '',
        isDelete: '',
        isEdit: '',
        type: '0',
        parentId: '',
        permission: '测试'
      },
      // 树的操作信息
      treeMenuInfo: {
        name: '',
        sort: '',
        parentId: '-1', // 左侧根节点就是要么-1，要么父节点的id
        type: '2',
        permission: '这就是permission',
        isDelete: '1',
        isEdit: '1'
      },
      dialogStatus: 'create',
      textMap: {
        update: '编辑菜单',
        create: '新增菜单'
      },
      menuTree: [],
      menuTable: [],
      menuId: '', // 通过id展示右侧列表数据
      rules: {
        name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入导航地址', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序码', trigger: 'blur' }],
        isDelete: [{ required: true, message: '请选择是否删除', trigger: 'blur' }],
        isEdit: [{ required: true, message: '请选择是否编辑', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.fetchTree()
  },
  methods: {
    // 树形菜单
    fetchTree(menuId) {
      menuApi.getMenuClassList().then(res => {
        this.menuTree = res.data
        const params = menuId || res.data[0].id
        this.fetchList(params)
      })
    },
    // 根据左边点击的树节点展示该节点下面的所有菜单列表
    fetchList(menuId) {
      menuApi.getMenuListByParentId(menuId).then(res => {
        this.menuTable = res.data
      })
    },
    // 列表新增菜单
    addMenu() {
      this.dialogStatus = 'create'
      this.addDialog = true
    },
    // 列表删除菜单
    delMenu(id) {
      menuApi.delMenu(id).then(res => {
        this.$message.success(res.message)
        this.fetchTree()
      })
    },
    // 列表编辑菜单
    editMenu(row) {
      for (var i in this.menuInfo) {
        this.menuInfo[i] = row[i]
      }
      this.dialogStatus = 'update'
      this.addDialog = true
    },
    // 列表按钮添加菜单/编辑更新
    onSubmitMenuForm() {
      this.$refs['menuForm'].validate((valid) => {
        if (!valid) return
        if (this.dialogStatus === 'create') {
          this.menuInfo.parentId = this.menuId
          menuApi.addMenu(this.menuInfo).then((res) => {
            this.fetchTree(this.menuId)
            this.addDialog = false
            this.$message.success('添加菜单成功')
          })
        } else if (this.dialogStatus === 'update') {
          this.menuInfo.parentId = this.menuId
          menuApi.editMenu({ menuId: this.menuId, ...this.menuInfo }).then(res => {
            this.fetchTree(this.menuId)
            this.addDialog = false
            this.$message.success('更新菜单信息成功')
          })
        }
      })
    },
    // 树形菜单新增和更新按钮
    onSubmitMenuTree() {
      this.$refs['treeMenuForm'].validate((valid) => {
        if (!valid) return
        if (this.dialogStatus === 'create') {
          menuApi.addMenu(this.treeMenuInfo).then((res) => {
            this.fetchTree()
            this.treeAddDialog = false
            this.$message.success('添加菜单成功')
          })
        } else if (this.dialogStatus === 'update') {
          menuApi.editMenu({ menuId: this.menuId, ...this.treeMenuInfo }).then(res => {
            this.fetchTree()
            this.treeAddDialog = false
            this.$message.success('更新菜单信息成功')
          })
        }
      })
    },
    // 点击节点获取当前节点的菜单列表
    treeNodeClick(data) {
      this.menuId = data.id
      this.fetchList(data.id)
    },
    // 树形添加
    append(data) {
      this.treeMenuInfo.parentId = data.id || '-1'
      this.dialogStatus = 'create'
      this.treeAddDialog = true
    },
    // 树形编辑
    edit(data) {
      this.treeMenuInfo.name = data.name
      this.treeMenuInfo.sort = data.sort
      this.dialogStatus = 'update'
      this.treeAddDialog = true
    },
    // 树形移除
    del(data) {
      this.delMenu(data.id)
    }

  }
}
</script>

<style lang='scss' scoped>
.main-title-box {
  margin-top: 0;
}
  .tree-box {
    min-height: 500px;
    .custom-tree-node {
      button:first-child {
        margin-left: 15px;
      }
      .tree-btn {
        font-weight: bold;
        &.el-icon-plus {
          color: #67C23A;
        }
        &.el-icon-edit {
          color: #E6A23C;
        }
        &.el-icon-delete {
          color: #F56C6C;
        }
      }
    }
  }
  .master-box {
    min-height: 500px;
    border-left: 1px solid #dfe6ec;
    > h4 {
      margin-top: 0;
    }
    > .el-button {
      margin-bottom: 15px;
    }
  }
</style>
