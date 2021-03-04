<template>
  <div class="app-container">
    <div class="title-content">{{ title }}</div>
    <div class="main-content">
      <div class="form">
        <el-form ref="form" border :rules="rules" :model="form" label-width="120px">
          <el-form-item label="机房名称:" prop="roomName">
            <el-input v-model="form.roomName" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" type="textarea" />
          </el-form-item>
          <el-form-item label="值班人员:">
            <el-button size="mini" type="primary" @click="centerDialogVisible = true">新增</el-button>
            <el-table :data="checkedUserList" border style="width: 100%">
              <el-table-column type="index" align="center" label="索引" width="80" />
              <el-table-column align="center" prop="realname" label="姓名" />
              <el-table-column align="center" prop="phone" label="手机号" />
              <el-table-column align="center" prop="organizName" label="所属组织机构" />
              <el-table-column align="center" label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="请勾选需要添加的人员" :visible.sync="centerDialogVisible" width="600px" center>
      <div>
        <el-checkbox-group v-model="checkedUserList" @change="handleCheckedUserChange">
          <el-checkbox v-for="(e,i) in userList" :key="i" :label="e">{{ e.realname }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import baseConfigApi from '@/api/baseConfig'
export default {
  data() {
    return {
      form: {
        roomName: this.$route.query.roomName || '',
        remark: this.$route.query.remark || ''
      },
      title: this.$route.query.id ? '编辑机房' : '新增机房',
      id: this.$route.query.id || '',
      centerDialogVisible: false,
      checkedUser: [], // 新增弹框选中的人员
      checkedUserList: [], // 展示的人员（需要保存提交的）
      userList: [], // 总的人员列表
      rules: {
        roomName: [
          { required: true, message: '请输入机房名称', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注信息', trigger: 'blur' }

        ]
      }
    }
  },
  mounted() {
    this.fetchList()
    if (this.id) {
      this.reShowData()
    }
  },
  methods: {
    // 获取机房人员列表
    fetchList() {
      baseConfigApi.getUserList().then(res => {
        this.userList = res.data.userList
      })
    },
    // 编辑时回显
    reShowData() {
      baseConfigApi.selRoom(this.id).then(res => {
        this.checkedUserList = res.data.userList
      })
    },
    // 选择人员添加到列表
    handleCheckedUserChange(value) {
      this.checkedUserList = value
    },
    // 把人员添加
    addUser() {
      // for (const i in this.checkedUser) {
      //   this.checkedUserList.push(this.checkedUser[i])
      // }
      this.centerDialogVisible = false
    },
    // 删除列表人员
    handleDelete(index, row) {
      this.checkedUserList.splice(index, 1)
    },
    onSubmit() {
      const params = {
        roomName: this.form.roomName,
        remark: this.form.remark,
        id: this.$route.query.id || '',
        userList: this.checkedUserList
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          baseConfigApi.saveRoom(params).then(res => {
            this.$message.success(res.message)
            this.$router.go(-1)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
 .app-container{
  .form{
    margin: 20px auto;
    width:700px;
    .time{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .input
      {
        margin: 0 20px;
        width: 100px;
      }
    }
  }
}
</style>
