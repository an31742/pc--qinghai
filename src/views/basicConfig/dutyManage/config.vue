<template>
  <div class="app-container">
    <div class="title-content">值班配置</div>
    <div class="main-content">
      <div class="main-content-form">
        <el-form ref="ruleForm" :rules="rules" border :model="ruleForm" label-width="120px">
          <el-form-item label="值班名称:" prop="zbName">
            <el-input v-model="ruleForm.zbName" />
          </el-form-item>
          <el-form-item label="班次配置:">
            <el-table :data="zbSchedList" style="width: 100%">
              <el-table-column type="index" label="索引" width="50" />
              <el-table-column align="center" label="值班名称">
                <template slot-scope="scope">
                  <el-input v-model="zbSchedList[scope.$index].schedName" placeholder="请输入值班名称" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="开始时间">
                <template slot-scope="scope">
                  <el-time-picker v-model="zbSchedList[scope.$index].startTime" value-format="HH:mm" format="HH:mm" style="width:100px" placeholder="请选择" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="结束时间">
                <template slot-scope="scope">
                  <el-time-picker v-model="zbSchedList[scope.$index].endTime" value-format="HH:mm" format="HH:mm" style="width:100px" placeholder="请选择" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">添加</el-button>
                  <el-button size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="交接班配置:" prop="moveUpTime">
            <template>
              <div class="time">
                <span>提前 </span>
                <el-input v-model="ruleForm.moveUpTime" class="input" type="number" />
                <span> 分钟</span>
              </div>
            </template>
          </el-form-item>
          <el-form-item prop="moveAfterTime">
            <template>
              <div class="time">
                <span>延迟 </span>
                <el-input v-model="ruleForm.moveAfterTime" class="input" type="number" />
                <span> 分钟</span>
              </div>
            </template>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import baseConfigApi from '@/api/baseConfig'
export default {
  name: 'Config',
  data() {
    return {
      ruleForm: {
        id: this.$route.query.id || '',
        zbName: this.$route.query.zbName || '',
        moveUpTime: this.$route.query.moveUpTime || '',
        moveAfterTime: this.$route.query.moveAfterTime || ''
      },
      zbSchedList: this.$route.query.zbSchedList || [{}, {}, {}],
      rules: {
        zbName: [
          { required: true, message: '请输入值班名称', trigger: 'blur' }
        ],
        moveUpTime: [
          { required: true, message: '请输入提前时间', trigger: 'blur' }
        ],
        moveAfterTime: [
          { required: true, message: '请输入延后时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          baseConfigApi.configRole({ ...this.ruleForm, zbSchedList: this.zbSchedList }).then(res => {
            this.$message.success(res.message)
            this.$router.go(-1)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAdd(index, row) {
      this.zbSchedList.push({})
    },
    handleDel(index, row) {
      this.zbSchedList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  .main-content-form{
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
