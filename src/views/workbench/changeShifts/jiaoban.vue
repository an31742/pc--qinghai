<template>
  <div class="app-container">
    <div class="title-content">值班人员交班</div>
    <div class="workbench-info">
      <div class="workbench-info-label">
        <label>值班机房：</label>
        <span>{{ roomName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>值班人：</label>
        <span>{{ zbUserName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>手机：</label>
        <span>{{ phone }}</span>
      </div>
      <div class="workbench-info-label">
        <label>接班人：</label>
        <span>{{ nextZbUser }}</span>
      </div>
    </div>
    <div class="workbench-info">
      <div class="workbench-info-half">
        <label>开始时间：</label>
        <span>{{ startTime }}</span>
      </div>
      <div class="workbench-info-half">
        <label>结束时间：</label>
        <span>{{ endTime }}</span>
      </div>
    </div>
    <div class="main-content">
      <div class="main-content-form">
        <el-form ref="ruleForm" border :model="ruleForm" label-width="160px">
          <el-form-item label="遗留问题交接：" prop="leaveProblem">
            <el-input
              v-model="ruleForm.leaveProblem"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="其他事务交接：" prop="otherHandOver">
            <el-input
              v-model="ruleForm.otherHandOver"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="物品交接情况：" prop="goodsHandOver">
            <el-input
              v-model="ruleForm.goodsHandOver"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="附件：" prop="moveAfterTime">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :headers="{'globalUniqueID': $store.state.user.globalUniqueID}"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="onSuccess"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item align="center">
            <el-button type="primary" @click="onSubmit">交班</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import workShiftApi from '@/api/workShift'

export default {
  name: 'Jiaoban',
  data() {
    return {
      ruleForm: {
        leaveProblem: '',
        otherHandOver: '',
        goodsHandOver: ''
      },
      fileIds: '',
      fileList: [],
      // 基本信息
      roomName: '',
      zbUserName: '',
      startTime: '',
      endTime: '',
      schedName: '',
      dataTime: '',
      nextZbUser: '',
      phone: '',
      zbUser: '',
      pbInfoId: this.pbInfoId,
      roomId: this.roomId
    }
  },
  computed: {
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}zbms/uploadFile/api/upload`
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 上传成功
    onSuccess(response, file, fileList) {
      const fileId = []
      fileList.forEach(el => {
        if (el.response) {
          fileId.push(el.response.data[0].id)
        }
      })
      this.fileIds = fileId.join(',')
    },
    // 交班提交数据
    onSubmit() {
      const data = {
        problem: this.ruleForm.leaveProblem,
        work: this.ruleForm.otherHandOver,
        goods: this.ruleForm.goodsHandOver,
        user: this.zbUser,
        userName: this.zbUserName,
        nextUser: this.nextZbUser,
        nextUserName: this.nextZbUser,
        fileIds: this.fileIds,
        pbInfoId: this.pbInfoId,
        roomName: this.roomName,
        schedName: this.schedName,
        roomId: this.roomId
      }
      workShiftApi.pushWorkShift(data).then((res) => {
        this.$message.success('提交成功')
        this.$router.go(-1)
      })
    },
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo().then(res => {
        if (res.data) {
          this.zbUser = res.data.zbUser
          this.phone = res.data.pohne
          this.roomName = res.data.roomName
          this.nextZbUser = res.data.nextZbUser
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.handEndTime = res.data.handEndTime
          this.handStartTime = res.data.handStartTime
          this.schedName = res.data.schedName
          this.roomId = res.data.roomId
          this.pbInfoId = res.data.id
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
        }
      })
    },
    // 获取交班信息列表
    getDutyInfo() {
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang='scss' scoped>
.jiaoban {
  table {
    margin-bottom: 15px;
    tr {
      margin-bottom: 10px;
      td {
        padding: 10px;
        width: 250px;
      }
    }
  }
  .button {
    width: 100%;
    text-align: center;
  }
}
</style>
