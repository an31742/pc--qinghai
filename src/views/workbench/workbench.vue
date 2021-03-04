<template>
  <div class="app-container">
    <div v-loading="workbenchLoading" class="workbench">
      <div class="title-content">工作台</div>
      <div v-if="isShow">
        <div class="workbench-info">
          <div class="workbench-info-label">
            <label>值班机房：</label>
            <span>{{ roomName }}</span>
          </div>
          <div class="workbench-info-label">
            <label>当前班次：</label>
            <span>{{ schedName }}</span>
          </div>
          <div class="workbench-info-label">
            <label>当班人：</label>
            <span>{{ zbUserName }}</span>
          </div>
          <div class="workbench-info-label">
            <label>接班人：</label>
            <span>{{ nextZbUser }}</span>
          </div>
        </div>
        <div class="workbench-info">
          <label>快捷导航：</label>
          <div style="display:inline;cursor:pointer">
            <el-tag effect="plain" @click="goVisitRecord">值班巡检</el-tag>
            <el-tag effect="plain" @click="goFaultRecord">故障记录填报</el-tag>
            <el-tag effect="plain" @click="goChangeShifts">交接班</el-tag>
          </div>
        </div>
        <div class="workbench-main">
          <div class="workbench-main-left">
            <!-- <div class="card-model top"> -->
            <el-card class="box-card">
              <div slot="header" class="box-card-header">
                <span>值班日志内容</span>
              </div>
              <div v-loading="loading" class="box-card-body">
                <ul style="cursor:pointer">
                  <li
                    v-for="item in logData"
                    :key="item.id"
                    @click="handlerDialog(item)"
                  >
                    <span>【{{ item.createTime }}】</span>
                    <span>{{ item.log }}</span>
                  </li>
                </ul>
              </div>
            </el-card>
            <el-card class="box-card" style="margin-top:15px;">
              <div slot="header" class="box-card-header">
                <span>公告论坛</span>
              </div>
              <div v-loading="noticeLoading" class="box-card-body">
                <ul style="cursor:pointer">
                  <li v-for="item in noticData" :key="item.id">
                    <span>【{{ item.createTime }}】</span>
                    <span>{{ item.msg }}</span>
                  </li>
                </ul>
              </div>
            </el-card>
          </div>

          <div class="workbench-main-right">
            <div class="workbench-sign">
              <el-button
                v-if="signState==='0'"
                ref="sign"
                class="button"
                type="danger"
                icon="el-icon-finished"
                @click="sign"
              >签到</el-button>
              <el-button v-else class="button" type="danger" disabled>已签到</el-button>
            </div>
            <div class="workbench-tabs">
              <el-tabs v-model="activeName">
                <el-tab-pane label="值班日志" name="first">
                  <el-form v-model="labelPosition" :model="dutyForm" class="demo-form-inline">
                    <el-form-item label="日志内容：">
                      <el-input
                        v-model="dutyForm.log"
                        style="margin-top:5px;"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="300"
                        rows="5"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item label="附件：">
                      <el-upload
                        class="upload-demo"
                        action="/zbms/uploadFile/api/upload"
                        :headers="{'globalUniqueID': $store.state.user.globalUniqueID}"
                        :on-remove="handleRemove"
                        :before-remove="beforeRemove"
                        :on-success="handleSuccess"
                        multiple
                        :file-list="fileList"
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                      </el-upload>
                    </el-form-item>
                    <el-form-item align="center">
                      <el-button type="primary" size="mini" plain @click="dutySave">保存</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="公告论坛" name="second">
                  <el-form v-model="labelPosition" :model="dutyForm" class="demo-form-inline">
                    <el-form-item label="公告论坛：">
                      <el-input
                        v-model="msgValue"
                        style="margin-top:5px;"
                        type="textarea"
                        placeholder="请输入内容"
                        maxlength="300"
                        rows="5"
                        show-word-limit
                      />
                    </el-form-item>
                    <el-form-item align="center">
                      <el-button type="primary" size="mini" plain @click="goSend">发送</el-button>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isShow" style="font-size:20px;text-align:center;margin-top:30px;">
        当前登陆人暂无值班信息
      </div>
      <!-- 修改日志内容 -->
      <el-dialog :visible.sync="dialogVisible" :show-close="false" class="reassignment" width="560px">
        <template slot="title">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:26px;"><label>修改值班日志</label></div>
            <div>
              <el-button @click="dialogSave">保存</el-button>
              <el-button @click="dialogDelate">删除</el-button>
              <el-button @click="dialogEsc">取消</el-button>
            </div>
          </div>
        </template>
        <div>
          <el-form label-width="80px" :model="dialogForm" class="demo-form-inline">
            <el-form-item label="填写人:">
              {{ dialogForm.user }}
            </el-form-item>
            <el-form-item label="填写时间:">
              {{ dialogForm.time }}
            </el-form-item>
            <el-form-item label="日志内容:">
              <el-input v-model="dialogForm.textarea" :rows="4" type="textarea" />
            </el-form-item>
            <el-form-item label="附件:">
              <!-- <div>附件：</div> -->
              <!-- <div> -->
              <el-upload
                class="upload-demo"
                action="/zbms/uploadFile/api/upload"
                :headers="{'globalUniqueID': $store.state.user.globalUniqueID}"
                :on-preview="dialogHandlePreview"
                :on-remove="dialogHandleRemove"
                :before-remove="dialogBeforeRemove"
                :on-success="dialogHandleSuccess"
                multiple
                :on-exceed="dialogHandleExceed"
                :file-list="dialogFileList"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            <!-- </div> -->
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import workShiftApi from '@/api/workShift'
import workBenchApi from '@/api/workBench'
import visitRecordApi from '@/api/visitRecord'
export default {
  name: 'Workbench',
  data() {
    return {
      workbenchLoading: false,
      labelPosition: 'top',
      fileIds: [],
      loading: false,
      noticeLoading: false,
      signState: '',
      id: '',
      dialogVisible: false, // 点击修改日志弹框
      activeName: 'first',
      fileList: [],
      dialogFileList: [],
      logData: [],
      noticData: [],
      dialogList: [],
      isShow: false,
      dutyForm: {
        log: '',
        dutyFileIds: ''
      },
      dialogForm: {
        user: '',
        time: '',
        textarea: '',
        dialogId: ''

      },
      dialogFileIds: [],
      // 信息详情
      logValue: '',
      msgValue: '',
      pbInfoId: '',
      roomName: '',
      zbUser: '',
      zbUserName: '',
      handStartTime: '',
      schedName: '',
      nextZbUser: '',
      roomId: ''
    }
  },
  computed: {
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}zbms/uploadFile/api/upload`
    }
  },
  mounted() {
    this.getInfo()
    this.getLogsList()
    this.getNoticeList()
  },
  methods: {
    // *************工作台信息相关接口******************
    // 值班基本信息
    getInfo() {
      this.workbenchLoading = true
      workShiftApi.getInfo().then(res => {
        if (res.data) {
          this.isShow = true
          this.pbInfoId = res.data.id
          this.roomId = res.data.roomId
          this.roomName = res.data.roomName
          this.nextZbUser = res.data.nextZbUser
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.handEndTime = res.data.handEndTime
          this.handStartTime = res.data.handStartTime
          this.schedName = res.data.schedName
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
          this.workbenchLoading = false
          this.isRegiste()
        // 是否签到
        } else {
          this.isShow = false
          this.workbenchLoading = false
        }
      })
    },
    // 跳转交接班
    goChangeShifts() {
      this.$router.push({
        path: 'changeShifts'
      })
    },
    // 跳转故障记录
    goFaultRecord() {
      this.$router.push({
        path: 'FaultRecord'
      })
    },
    // 跳转值班巡检
    goVisitRecord() {
      this.$router.push({
        path: 'visitRecord'
      })
    },
    // ***********值班日志内容卡片相关方法***************************
    // 值班日志列表
    getLogsList() {
      this.loading = true
      workBenchApi.getLogsList().then((res) => {
        this.logData = res.data
        this.loading = false
      })
    },
    // 显示值班日志弹框
    handlerDialog(el) {
      this.dialogVisible = true
      const data = {
        pbInfoId: el.pbInfoId,
        type: '3',
        typeId: el.id
      }
      this.dialogFileList = []
      this.dialogFileIds = []
      visitRecordApi.getVisitRecordDeatil(data).then((res) => {
        for (var i in res.data) {
          if (el.id === res.data[i].id) {
            this.dialogForm.dialogId = res.data[i].id
            this.dialogForm.user = res.data[i].creatUser
            this.dialogForm.time = res.data[i].createTime
            this.dialogForm.textarea = res.data[i].log
            for (var j in res.data[i].fileList) {
              this.dialogFileList.push({ name: res.data[i].fileList[j].fileName, url: res.data[i].fileList[j].fileUrl, id: res.data[i].fileList[j].id })
              this.dialogFileIds.push(res.data[i].fileList[j].id)
            }
          }
        }
      })
    },

    // 修改值班日志保存
    dialogSave() {
      var uniqueFileList = Array.from(new Set(this.dialogFileIds))
      const data = {
        pbInfoId: this.pbInfoId,
        log: this.dialogForm.textarea,
        id: this.dialogForm.dialogId,
        fileIds: uniqueFileList.join(','),
        roomName: this.roomName,
        schedName: this.schedName,
        roomId: this.roomId
      }

      workBenchApi.pushLogsList(data).then((res) => {
        this.$message.success({ message: res.message })
        this.dialogFileList = []
        this.dialogFileIds = []
        this.getLogsList()
        this.dialogVisible = false
      })
    },
    // 修改值班日志删除
    dialogDelate() {
      this.dialogVisible = false
      this.dialogFileList = []
      const data = {
        id: this.dialogForm.dialogId
      }
      workBenchApi.removeLogsList(data).then((res) => {
        this.$message.success({ message: res.message })
        this.getLogsList()
      })
    },
    // 关闭弹出框
    dialogEsc() {
      this.dialogVisible = false
      this.dialogFileList = []
    },
    // *******************公告论坛卡片相关方法************************
    // 公告列表
    getNoticeList() {
      this.noticeLoading = true
      workBenchApi.getNoticeList().then((res) => {
        this.noticData = res.data
        this.noticeLoading = false
      })
    },
    // ************************签到相关方法**********************
    // 是否签到
    isRegiste() {
      const data = { pbInfoId: this.pbInfoId }
      workBenchApi.isRegiste(data).then((res) => {
        this.signState = res.data
      })
    },
    // 签到
    sign() {
      const data = { pbInfoId: this.pbInfoId }
      workBenchApi.signWorkbench(data).then((res) => {
        this.$message.success({ message: res.message })
        this.isRegiste()
      })
    },
    // *******************tab页相关方法******************************
    // 公告论坛发送
    goSend() {
      const data = {
        pbInfoId: this.pbInfoId,
        msg: this.msgValue
      }
      workBenchApi.pushNoticeList(data).then((res) => {
        this.$message.success({ message: res.message })
        this.msgValue = ''
        this.fileList = []
        this.getNoticeList()
      })
    },
    // 值班日志保存   //值班日志的新增
    dutySave() {
      if (this.dutyForm.log) {
        const data = {
          pbInfoId: this.pbInfoId,
          log: this.dutyForm.log,
          fileIds: this.dutyForm.dutyFileIds,
          roomName: this.roomName,
          schedName: this.schedName,
          roomId: this.roomId
        }
        workBenchApi.pushLogsList(data).then((res) => {
          this.$message.success({ message: res.message })
          this.dutyForm.log = ''
          this.fileList = []
          this.dutyForm.dutyFileIds = ''
          this.getLogsList()
        })
      } else {
        this.$message.error('请填写日志内容')
      }
    },

    // 右侧卡片上传文件*******************************
    handleSuccess(response, file, fileList) {
      const tem = []
      fileList.forEach(el => {
        if (el.response) {
          tem.push(el.response.data[0].id)
        }
      })
      this.dutyForm.dutyFileIds = tem.join(',')
    },
    handleRemove(file, fileList) {
      const tem = []
      fileList.forEach(el => {
        if (el.response) {
          tem.push(el.response.data[0].id)
        }
      })
      this.dutyForm.dutyFileIds = tem.join(',')
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 值班日志内容弹出框上传文件***************
    dialogHandleSuccess(response, file, fileList) {
      fileList.forEach(el => {
        if (el.response) {
          this.dialogFileIds.push(el.response.data[0].id)
        }
      })
    },
    dialogHandleRemove(file, fileList) {
      const sss = []
      for (var i in fileList) {
        if (fileList[i].id) { // 回显的数据
          sss.push(fileList[i].id)
        } else { // 新上传的数据
          sss.push(fileList[i].response.data[0].id)
        }
      }
      this.dialogFileIds = sss
    },
    dialogHandlePreview(file) {
    },
    dialogHandleExceed(files, fileList) {

    },
    dialogBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style lang='scss' scoped>
.workbench {
  .workbench-main {
    margin-top:20px;
    display: flex;
    justify-content: space-between;
    .workbench-main-left {
      width: 70%;
      .box-card {
        border:1px solid #e1212a;
        border-radius: 10px;
        >>> .el-card__header {
          background-color: #e1212a;
        }
        .box-card-header{
           color: #fff;
        }
        .box-card-body{
            height: 240px;
            overflow: auto;
        }
      }
      .top {
        margin-bottom: 18px;
      }
    }
    .workbench-main-right {
      width: 28%;
      .workbench-sign {
        .button {
          width: 100%;
        }
      }
      .workbench-tabs{
        height:633px;
        background-color: #fff;
        margin-top:20px;
        border:1px solid #e1212a;
        padding:10px;
        border-radius:15px;
        .btn {
          padding: 20px 0;
          text-align: center;
        }
      }
    }
  }
  ul{
    cursor: pointer;
  }
  ul li:hover{
    color:red;
  }
}

</style>
