<template>
  <div class="app-container">
    <div class="title-content">人员列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="账号">
            <el-input v-model="searchForm.username" placeholder="账号" />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.realname" placeholder="姓名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.phone" placeholder="手机号" />
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="search" />
            </el-tooltip>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="el-icon-refresh" circle @click="refresh" />
            </el-tooltip>
          </el-form-item>
          <el-button type="primary" size="small" style="float:right;" icon="el-icon-plus" @click="dialogVisible = true">
            添加
          </el-button>
        </el-form>
      </div>
      <div class="main-content-table">
        <el-table :data="userTable" border>
          <el-table-column prop="username" label="人员账号" align="center" />
          <el-table-column prop="realname" label="人员姓名" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="电子邮箱" align="center" />
          <!-- <el-table-column prop="organizName" label="所属组织机构" align="center" /> -->
          <el-table-column prop="lockFlag" label="是否禁用" align="center" />
          <el-table-column label="操作" width="230" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="configRoles(scope.row)">配置角色</el-button>
              <el-button v-if="scope.row.lockFlag === '是'" type="text" class="primary-button" @click="configDisable(scope.row.userId,'0')">启用</el-button>
              <el-button v-else type="text" @click="configDisable(scope.row.userId,'9')">禁用</el-button>
              <el-button type="text" @click="delRoles(scope.row)">删除</el-button>
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
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 添加人员弹出框 -->
    <el-dialog title="请选择添加人员" center :visible.sync="dialogVisible" width="800px">
      <el-input v-model="filterText" placeholder="输入关键字进行过滤" />
      <div style="height:400px;overflow:auto">
        <div v-if="searchUserchecked" style="padding:20px 0 20px 10px">
          <!-- <el-checkbox v-model="searchUserchecked">{{ searchUser.label }}({{ searchUser.userName }})</el-checkbox> -->
          <el-checkbox-group v-model="checkedUser" :max="1" @change="handleBoxChange">
            <el-checkbox v-for="user in searchUser" :key="user.id" :label="user">{{ user.label }}---{{ user.userName }}---{{ user.fullName }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-tree
          v-else
          ref="tree"
          :props="leadProps"
          :load="loadNode"
          lazy
          node-key="id"
          show-checkbox
          @check="checkTree"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUser">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出窗口：配置用户角色 -->
    <el-dialog :visible.sync="dialogRoleFormVisible" :close-on-click-modal="false" title="修改用户角色">
      <div>
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="updateUserRolesData.roleIds" @change="handleCheckedOptionsChange">
          <el-checkbox v-for="role in roleOptions" :key="role.roleId" :label="role.roleId" class="role-checkbox">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRoleFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmitRolesForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import userApi from '@/api/manage/user'
import { getUserTree, queryUser } from '@/api/user'
import { resetTemp } from '@/utils'
import debounce from 'lodash/debounce'
// import roleApi from '@/api/manage/role'
// import { asyncRouterMap } from '@/router'
export default {
  data() {
    return {
      searchForm: {
        username: '',
        realname: '',
        phone: '',
        email: ''
      },
      searchUser: [],
      checkedUser: [],
      searchUserchecked: false,
      userInfo: [],
      userTable: [{}],
      current: 1,
      pages: null,
      size: 10,
      total: null,
      dialogVisible: false,
      dialogRoleFormVisible: false,
      tree: [],
      leadProps: {
        label: 'label',
        isLeaf: 'isParent'
      },
      addLoading: false, // 搜索领导加载动画
      filterText: '', // leaderTree过滤关键字
      // 选择角色
      userId: '', // 为用户选择角色时需要提交的参数
      checkAll: false,
      checkedRoles: [],
      roleOptions: [],
      isIndeterminate: true,
      // hehe
      loadingSearchLeader: false,
      searchLeaderList: [],
      updateUserRolesData: {
        userId: null,
        roleIds: []
      }
    }
  },
  watch: {
    'filterText': debounce(function(name) {
      if (name) {
        queryUser({ name }).then(res => {
          this.searchUserchecked = true
          if (res.data.length) {
            this.searchUser = res.data
          } else {
            this.searchUserchecked = false
            this.$message.error('当前用户不存在')
          }
        })
      } else {
        this.searchUserchecked = false
      }
    }, 600)
  },
  mounted() {
    this.fetchList()
    this.fetchRoleList()
    // this.getFilterRouterTree(asyncRouterMap)
  },
  methods: {
    // 搜索出来的人员列表选中事件
    handleBoxChange(value) {
      if (this.checkedUser.length) {
        const [obj] = this.checkedUser
        this.userInfo = [{
          username: obj.userName,
          realname: obj.label,
          phone: obj.mobilePhone,
          email: obj.email
        }]
      }
    },
    // 过滤路由树
    getFilterRouterTree(asyncRouterMap, result = []) {
      asyncRouterMap.forEach((element, index) => {
        if (!element.hidden) {
          if (element.meta && element.children) {
            var router = { label: element.meta.title || '',
              perm: element.meta.perm,
              children: []
            }
            result.push(router)
            if (element.children) {
              this.getFilterRouterTree(element.children, router.children)
            }
          }
        }
      })
    },
    // 人员管理列表
    fetchList() {
      const params = {
        ...this.searchForm,
        current: this.current,
        size: this.size
      }
      const lockFlagObj = { 0: '否', 9: '是' }
      userApi.userList(params).then(res => {
        this.userTable = res.data.records
        this.userTable.forEach(item => {
          item.lockFlag = lockFlagObj[item.lockFlag]
        })
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    // 获取角色列表
    fetchRoleList() {
      userApi.roleList().then(res => {
        this.roleOptions = res.data
      })
    },
    // 查询
    search() {
      this.fetchList()
    },
    // 搜索返回
    refresh() {
      resetTemp(this.searchForm)
      this.fetchList()
    },
    // 添加人员组织树懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        getUserTree().then(res => {
          for (var i in res.data) {
            if (res.data[i].isParent === true) {
              res.data[i].isParent = false
            } else {
              res.data[i].isParent = true
              res.data[i].disabled = false
            }
          }
          return resolve(res.data)
        })
      }
      if (node.level > 0) {
        getUserTree({ id: node.data.id }).then(res => {
          for (var i in res.data) {
            if (res.data[i].isParent === true) {
              res.data[i].isParent = false
            } else {
              res.data[i].isParent = true
            }
          }
          return resolve(res.data)
        })
      }
    },
    // 树节点点击事件
    checkTree(obj, state) {
      this.userInfo = this.$refs.tree.getCheckedNodes(true).map(item => {
        return { username: item.userName, realname: item.label, phone: item.mobilePhone, email: item.email }
      })
    },
    // 添加人员
    addUser() {
      if (this.userInfo.length === 0) {
        this.$message.warning('请勾选人员！')
      } else {
        userApi.addUser(this.userInfo).then(res => {
          this.fetchList()
          this.$message.success('添加人员成功')
          if (this.searchUserchecked) {
            this.filterText = ''
          } else {
            this.$refs.tree.setCheckedNodes([])
          }
          this.dialogVisible = false
          this.checkedUser = []
        })
      }
    },
    // 取消添加User
    cancelUser() {
      if (this.searchUserchecked) {
        this.filterText = ''
      } else {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogVisible = false
    },
    // 当前用户的角色信息
    getUserRoles(userId) {
      userApi.getUserRoles(userId).then(res => {
        this.updateUserRolesData = {
          userId,
          roleIds: res.data.userRoleList || []
        }
      })
    },
    // 配置角色
    // configRoles(row) {
    //   this.userId = row.userId
    //   this.dialogRoleFormVisible = true
    //   userApi.getUserRoles(this.userId).then(res => {
    //     this.checkedRoles = res.data
    //   })
    // },
    // 配置用户角色api
    invokeUpdateUserRolesApi() {
      // let str = '/'
      // if (!this.updateUserRolesData.roleIds.length) {
      //   str = ''
      // }
      userApi.configRole(this.updateUserRolesData.userId, this.updateUserRolesData.roleIds.join(',')).then(res => {
        this.fetchList()

        this.$message.success('配置用户角色成功')
      })
      this.dialogRoleFormVisible = false
    },
    // 配置用户角色
    configRoles(row) {
      // 判断是否有角色可添加
      if (!this.roleOptions.length) {
        this.$message.warning('暂无任何可选角色，先去添加角色吧！')
        return
      }
      this.getUserRoles(row.userId)
      this.dialogRoleFormVisible = true // 进入角色选择弹出框
    },
    // 删除用户角色
    delRoles(row) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userApi.delUser(row.username).then(res => {
          this.fetchList()
          this.$message.success('删除成功')
        })
      })
    },
    // 角色选择保存
    onSubmitRolesForm() {
      const noRolesSelected = this.updateUserRolesData && this.updateUserRolesData.roleIds && this.updateUserRolesData.roleIds.length === 0
      if (noRolesSelected) {
        this.$confirm('当前没有选中任何角色，会清除该用户已有的角色, 是否继续?', '提示').then(() => {
          this.invokeUpdateUserRolesApi()
        }).catch(() => {
          this.$message('已取消编辑用户角色')
        })
      } else {
        this.invokeUpdateUserRolesApi()
      }
    },
    // 禁用和启用
    configDisable(id, state) {
      userApi.disableUser(id, state).then(res => {
        this.fetchList()
      })
    },
    // 监听角色多选框变化改变全选框状态
    handleCheckedOptionsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.roleOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleOptions.length
    },
    // 角色弹窗全选
    handleCheckAllChange(val) {
      const allRids = this.roleOptions.map(role => role.roleId)
      this.updateUserRolesData.roleIds = val ? allRids : []
      this.isIndeterminate = false
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
.el-tree{
  /deep/ .el-checkbox .el-checkbox__inner{
    display: none;
  }
  /deep/ .is-leaf + .el-checkbox .el-checkbox__inner{
    display: inline-block;
  }
}
</style>
