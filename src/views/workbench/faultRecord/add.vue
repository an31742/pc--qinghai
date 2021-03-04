<template>
  <div class="app-container">
    <div class="title-content">{{ this.$route.query.id ?"故障记录修改" :"故障记录新增" }}</div>
    <div class="main-content">
      <el-form ref="form" :model="form" label-width="150px" :rules="rules">
        <el-form-item label="故障标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item label="所属网络" prop="network">
                <el-select v-model="form.network" placeholder="请选择所属网络">
                  <el-option
                    v-for="item in networkList"
                    :key="item.uvalue"
                    :label="item.ukey"
                    :value="item.ukey"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="故障专业" prop="major">
                <el-select v-model="form.major" placeholder="请选择故障专业">
                  <el-option
                    v-for="item in majorList"
                    :key="item.uvalue"
                    :label="item.ukey"
                    :value="item.ukey"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="所属地区" prop="area">
                <el-select v-model="form.area" placeholder="请选择所属地区">
                  <el-option
                    v-for="item in adressList"
                    :key="item.uvalue"
                    :label="item.ukey"
                    :value="item.ukey"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item label="故障地点" prop="place">
                <el-input v-model="form.place" placeholder="请填写故障地点" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="故障发生时间" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="业务代通时间" prop="noticeTime">
                <el-date-picker
                  v-model="form.noticeTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item label="故障发现时间" prop="findTime">
                <el-date-picker
                  v-model="form.findTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="故障恢复时间" prop="recoverTime">
                <el-date-picker
                  v-model="form.recoverTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="故障历时（分钟）">
                <el-input v-model="form.duration" disabled placeholder="请填写故障历时" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item label="发现人" prop="find_user">
                <el-input v-model="form.find_user" placeholder="请填写发现人" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="处理人" prop="deal_user">
                <el-input v-model="form.deal_user" placeholder="请填写处理人" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="故障现象及影响业务范围" prop="phenomenon">
          <el-input v-model="form.phenomenon" type="textarea" placeholder="请填写故障现象及影响业务范围" />
        </el-form-item>
        <el-form-item label="故障原因">
          <el-input v-model="form.reason" type="textarea" placeholder="请填写故障原因" />
        </el-form-item>
        <el-form-item label="故障处理过程">
          <el-input v-model="form.dealRecord" type="textarea" placeholder="请填写故障处理过程" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请填写备注" />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <div>
              <el-form-item label="是否完成" prop="isFinish">
                <el-select v-model="form.isFinish" placeholder="请选择">
                  <el-option
                    v-for="item in isFinisgList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="填报人" prop="createUser">
                <el-input v-model="form.createUser" placeholder="请填写填报人" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <el-form-item label="附件">
                <el-upload
                  ref="upload"
                  v-model="fileValue"
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
                </el-upload>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item align="center">
          <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import failureLoggingApi from '@/api/failureLogging'

export default {
  data() {
    return {
      fileValue: [], // 绑定上传文件
      fileIds: [],
      roomName: '111', // 调基本信息使用机房名称
      fileList: [],
      networkList: [], // 所属网络
      adressList: [], // 所属地区
      majorList: [], // 所属专业
      isFinisgList: [
        {
          value: '0',
          label: '未完成'
        },
        {
          value: '1',
          label: '已完成'
        }
      ],
      form: {
        title: '',
        major: '',
        area: '',
        network: '',
        place: '', // 故障地点
        createTime: '', // 发生时间
        noticeTime: '', // 业务代通时间
        findTime: '', // 发现时间
        recoverTime: '', // 恢复时间
        duration: '', // 故障历时
        find_user: '', // 发现人
        deal_user: '', // 处理人
        phenomenon: '', // 故障现象及影响业务
        reason: '', // 故障原因
        dealRecord: '', // 故障处理过程
        remark: '', // 备注
        isFinish: '', // 是否完成
        createUser: '', // 填报人
        files: ''
      },

      rules: {
        title: [{ required: true, message: '请输入故障标题', trigger: 'blur' }],
        network: [
          { required: true, message: '请选择所属网络', trigger: 'blur' }
        ],
        major: [{ required: true, message: '请选择故障专业', trigger: 'blur' }],
        area: [{ required: true, message: '请选择所属地区', trigger: 'blur' }],
        place: [{ required: true, message: '请输入故障地点', trigger: 'blur' }],
        createTime: [
          { required: true, message: '请输入故障发生时间', trigger: 'blur' }
        ],
        noticeTime: [
          { required: true, message: '请输入业务代通时间', trigger: 'blur' }
        ],
        findTime: [
          { required: true, message: '请输入故障发现时间', trigger: 'blur' }
        ],
        recoverTime: [
          { required: true, message: '请输入故障恢复时间', trigger: 'blur' }
        ],
        duration: [
          { required: true, message: '请输入故障历时(请输入数字)', trigger: 'blur' }
        ],
        find_user: [
          { required: true, message: '请输入发现人', trigger: 'blur' }
        ],
        deal_user: [
          { required: true, message: '请输入处理人', trigger: 'blur' }
        ],
        phenomenon: [
          {
            required: true,
            message: '请输入故障现象及影响业务范围',
            trigger: 'blur'
          }
        ],
        isFinish: [
          { required: true, message: '请选择是否完成', trigger: 'blur' }
        ],
        createUser: [
          { required: true, message: '请输入填报人', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}zbms/uploadFile/api/upload`
    }
  },
  watch: {
    form: {
      handler(newValue, oldValue) {
        const createTimes = new Date(newValue.createTime).getTime()
        const recoverTimes = new Date(newValue.recoverTime).getTime()
        const durations = Math.round((recoverTimes - createTimes) / 60000)
        this.form.duration = durations

        return this.form.duration
      },
      deep: true
    }

  },

  mounted() {
    if (this.$route.query.id) {
      this.getSelRecordDefault()
      setTimeout(() => {
        if (this.form.files) {
          this.form.files.forEach(el => {
            this.fileList.push({ name: el.fileName })
            this.fileValue.push({ 'fileName': el.fileName, 'fileUrl': el.fileUrl })
            this.fileIds.push(el.id)
          })
        }
      }, 1000)
    }
    this.getSelDicByKinds()
    this.getNetworks()
    this.getAddress()
  },
  methods: {
    // 故障记录修改
    getSelRecordDefault() {
      const data = {
        id: this.$route.query.id
      }
      failureLoggingApi.getSelRecordDefault(data).then((res) => {
        this.form = res.data.record
        this.form.title = res.data.record.title
        this.form.area = res.data.record.area
        this.form.major = res.data.record.major
        this.form.network = res.data.record.network
        this.form.place = res.data.record.place
        this.form.createTime = res.data.record.createTime
        this.form.noticeTime = res.data.record.noticeTime
        this.form.findTime = res.data.record.findTime
        this.recoverTime = res.data.record.recoverTime
        this.form.duration = res.data.record.duration
        this.form.find_user = res.data.record.findUser
        this.form.deal_user = res.data.record.dealUser
        this.form.phenomenon = res.data.record.phenomenon
        this.form.reason = res.data.record.reason
        this.form.dealRecord = res.data.record.dealRecord
        this.form.remark = res.data.record.remark
        this.form.isFinish = res.data.record.isFinish
        this.form.createUser = res.data.record.createUser
        this.form.files = res.data.record.files
      })
    },

    // 故障所属网络
    getNetworks() {
      const data = {
        kinds: 'COMMON_NETWORK'
      }
      failureLoggingApi.getSelDicByKinds(data).then((res) => {
        this.networkList = res.data
      })
    },
    // 故障地区
    getAddress() {
      const data = {
        kinds: 'AREA_QINGHAI'
      }
      failureLoggingApi.getSelDicByKinds(data).then((res) => {
        this.adressList = res.data
      })
    },
    // 获取所属专业
    getSelDicByKinds() {
      const data = {
        kinds: 'COMMON_MAJOR'
      }
      failureLoggingApi.getSelDicByKinds(data).then((res) => {
        this.majorList = res.data
      })
    },
    // 保存新增
    onSubmit() {
      const uniqueFileList = Array.from(new Set(this.fileIds))
      this.$refs['form'].validate((valid) => {
        if (valid) {
          failureLoggingApi
            .saveRecordFault({
              ...this.form,
              roomName: this.roomName,
              file_ids: uniqueFileList.join()
            })
            .then((res) => {
              this.$message.success('提交成功')
              this.$router.go(-1)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onSuccess(response, file, fileList) {
      this.fileList = fileList
      this.fileValue.push({ 'fileName': file.name, 'fileUrl': response.data[0].fileUrl })
      const fileId = []
      fileList.forEach(el => {
        if (el.response) {
          fileId.push(el.response.data[0].id)
        }
      })
      if (this.fileIds) {
        this.fileIds = this.fileIds.concat(fileId)
        this.fileIds = [...new Set(this.fileIds)]
      }
      this.fileIds = this.fileIds.map(Number)
    },
    handlePreview(val) {
    },
    handleRemove(file, fileList) {
      this.form.files.forEach(item => {
        if (item.fileName === file.name) {
          this.fileIds.splice(this.form.files.indexOf(item.id), 1)
          this.fileIds = this.fileIds.map(Number)
        }
      })

      this.fileValue.splice(fileList.indexOf(file), 1)
    },
    beforeRemove(val) {
    },
    handleExceed(val) {
    }
  }
}
</script>

<style lang='scss' scoped>
.add {
  .form {
    width: 900px;
    margin: 0 auto;
  }
}
</style>
