<template>
  <div class="app-container">
    <div class="title-content">值班巡检记录填报</div>
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
        <el-form ref="ruleForm" border :model="ruleForm" label-width="180px">
          <el-form-item label="巡检机房内所有设备的运行情况：" prop="equipment">
            <el-input
              v-model="ruleForm.equipment"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="巡检机房温度、湿度、空调运行情况：" prop="environmental">
            <el-input
              v-model="ruleForm.environmental"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="巡检网管运行情况：" prop="moveAfterTime">
            <el-input
              v-model="ruleForm.networkManagement"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="故障工单处理情况：" prop="moveAfterTime">
            <el-input
              v-model="ruleForm.workOrder"
              :rows="4"
              type="textarea"
              placeholder="请输入内容"
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="巡视网络运行情况：" prop="moveAfterTime">
            <el-input
              v-model="ruleForm.network"
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
              :before-remove="beforeRemove"
              :on-success="onSuccess"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
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
import workShiftApi from '@/api/workShift'
import visitRecordApi from '@/api/visitRecord'
export default {
  name: 'VisitRecord',
  data() {
    return {
      ruleForm: {
        equipment: '',
        environmental: '',
        networkManagement: '',
        workOrder: '',
        network: ''
      },
      fileList: [],
      fileIds: '',
      // 基本信息
      roomName: '',
      zbUserName: '',
      startTime: '',
      endTime: '',
      handEndTime: '',
      handStartTime: '',
      schedName: '',
      dataTime: '',
      fileName: '',
      phone: '',
      nextZbUser: '',
      id: ''
    }
  },
  computed: {
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}zbms/uploadFile/api/upload`
    }
  },
  watch: {
    $route(to, from) {
      window.location.reload()
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    // 文件上传
    onSuccess(response, file, fileList) {
      const fileId = []
      fileList.forEach(el => {
        if (el.response) {
          fileId.push(el.response.data[0].id)
        }
      })
      this.fileIds = fileId.join(',')
    },
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo().then(res => {
        if (res.data) {
          this.phone = res.data.pohne
          this.nextZbUser = res.data.nextZbUser
          this.roomName = res.data.roomName
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.handEndTime = res.data.handEndTime
          this.handStartTime = res.data.handStartTime
          this.schedName = res.data.schedName
          this.roomId = res.data.roomId
          // this.dataTime = res.data.startTime
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
          this.id = res.data.id
        }
      })
    },
    // 巡检提交
    onSubmit() {
      const data = {
        pbInfoId: this.id,
        environmental: this.ruleForm.environmental,
        equipment: this.ruleForm.equipment,
        network: this.ruleForm.network,
        workOrder: this.ruleForm.workOrder,
        networkManagement: this.ruleForm.networkManagement,
        fileId: this.fileIds,
        zbUserName: this.zbUserName,
        startTime: this.startTime,
        endTime: this.endTime,
        roomName: this.roomName,
        schedName: this.schedName,
        roomId: this.roomId
      }
      visitRecordApi.pushVisitRecord(data).then((res) => {
        this.$message.success('提交成功')
        this.$router.go(-1)
      })
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

</style>
