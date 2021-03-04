<template>
  <div class="app-container">
    <div class="title-content">值班考核详情</div>
    <div class="main-content">
      <span><label>值班机房:1212</label></span>
      <div>
        <table class="room-table">
          <tr>
            <td>值班人:</td>
            <td> {{ zbTableData.zbUserName }}</td>
            <td>班次:</td>
            <td>{{ zbTableData.schedName }}</td>
            <td>开始时间:</td>
            <td>{{ zbTableData.startTime }}</td>
            <td>结束时间:</td>
            <td>{{ zbTableData.endTime }}</td>
            <td>接班人:</td>
            <td>{{ zbTableData.nextZbUser }}</td>
          </tr>
        </table>
      </div>
      <span><label>值班日志检查</label></span>
      <div>
        <el-table :data="logCheckTableData" border style="width: 100%; margin-top:20px;margin-bottom:20px;">
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="createTime" align="center" label="日志时间" width="180" />
          <el-table-column prop="log" align="center" label="日志内容" />
          <el-table-column align="center" label="附件">
            <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.fileList" :key="index">
                <el-link type="primary" :href="downloadUrl + item.fileUrl">
                  {{ item.fileName }}
                </el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span><label>交接班情况检查</label></span>
      <div>
        <table class="room-table">
          <tr>
            <td>交班时间:</td>
            <td>{{ zbTableData.handEndTime }}</td>
            <td>应接班时间:</td>
            <td>{{ zbTableData.startTime }}</td>
            <td>状态:</td>
            <td>{{ zbTableData.zbState }}</td>
          </tr>
          <tr style="height:150px">
            <td>遗留问题交接:</td>
            <td colspan="7">{{ jbTableData.problem }}</td>
          </tr>
          <tr style="height:150px">
            <td>其他事物交接:</td>
            <td colspan="7">{{ jbTableData.work }}</td>
          </tr>
          <tr style="height:150px">
            <td>物品交接情况:</td>
            <td colspan="7">{{ jbTableData.goods }}</td>
          </tr>
          <tr>
            <td>附件:</td>
            <td colspan="7">
              <div v-for="item in jbTableData.uploadFileList" :key="item.id">
                <el-link type="primary" :href="downloadUrl + item.fileUrl">
                  {{ item.fileName }}
                </el-link>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <span><label>考核评价</label></span>
      <div>
        <table class="room-table">
          <tr>
            <td style="width:12.5%;">考核等级:</td>
            <td style="width:87.5%;text-align: left;padding-left:20px;">
              <div>
                <el-radio-group v-model="form.level" size="mini">
                  <el-radio-button :label="1">优秀</el-radio-button>
                  <el-radio-button :label="2">良好</el-radio-button>
                  <el-radio-button :label="3">一般</el-radio-button>
                  <el-radio-button :label="4">较好</el-radio-button>
                  <el-radio-button :label="5">差</el-radio-button>
                </el-radio-group>
              </div>
            </td>
          </tr>
          <tr style="height:150px">
            <td>考评内容:</td>
            <td style="padding:10px;">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
              />
            </td>
          </tr>
        </table>
      </div>
      <div style="text-align:center;">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import assessmentApi from '../../../api/assessment'
import workShiftApi from '../../../api/workShift'
export default {
  data() {
    return {
      form: {
        id: this.$route.query.id,
        level: '',
        remark: ''
      },
      pbInfoId: this.$route.query.pbInfoId,
      // 值班机房表格
      zbTableData: {},
      // 值班日志检查表格
      logCheckTableData: [],
      // 交接班情况检查表格
      jbTableData: {
        problem: '',
        work: '',
        goods: '',
        uploadFileList: []
      }
    }
  },
  computed: {
    downloadUrl() {
      return process.env.VUE_APP_DOWNLOAD_URL
    }
  },
  mounted() {
    this.comRoomTable()
    this.getJournalTable()
    this.getHandoverTable()
  },
  methods: {
    // 值班机房数据
    comRoomTable() {
      workShiftApi.getInfo(this.pbInfoId).then(res => {
        switch (res.data.zbState) {
          case '1':
            res.data.zbState = '正值班'
            break
          case '2':
            res.data.zbState = '未值班'
            break
          case '3':
            res.data.zbState = '已值班'
            break
        }
        this.zbTableData = res.data
      })
    },
    // 值班日志数据
    getJournalTable() {
      assessmentApi.journalCheck(this.pbInfoId).then(res => {
        this.logCheckTableData = res.data
      })
    },
    // 交接班情况数据表格
    getHandoverTable() {
      assessmentApi.handoverCheck(this.pbInfoId).then(res => {
        this.jbTableData.problem = res.data.problem
        this.jbTableData.work = res.data.work
        this.jbTableData.goods = res.data.goods
        this.jbTableData.uploadFileList = res.data.uploadFileList
      })
    },
    // 保存
    onSubmit() {
      assessmentApi.saveAssessment(this.form).then(res => {
        this.$router.push({ path: '/dutyAssessment/assessment/index' })
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.app-container{
  label{
    margin:20px 0 20px 0;
  }
  .room-table{
  margin: 0 auto;
  border-collapse: collapse;
  margin:20px 0 20px 0;
  width:100%;
  font-size: 14px;
  color: #606266;
  tr {
    height: 50px;
    td {
      width:10%;
      text-align: center;
      border: 1px #dfe6ec solid;
    }
  }
}
}

</style>
