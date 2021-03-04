<template>
  <div class="app-container">
    <div class="title-content">值班巡检记录详情</div>
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
        <label>班次：</label>
        <span>{{ schedName }}</span>
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
      <table>
        <tr>
          <td style="width:15%">巡检机房所有设备运行情况：</td>
          <td>
            {{ equipment }}
          </td>
        </tr>
        <tr>
          <td>巡检网管运行情况</td>
          <td>
            {{ networkManagement }}
          </td>
        </tr>
        <tr>
          <td>故障工单处理情况</td>
          <td>
            {{ workOrder }}
          </td>
        </tr>
        <tr>
          <td>巡视网络运行情况</td>
          <td>
            {{ netWork }}
          </td>
        </tr>
        <tr>
          <td>附件：</td>
          <td>
            <p v-for="el in fileList" :key="el.id">
              <a style="color:red" :href="downloadUrl+el.fileUrl">{{ el.fileName }}</a>
            </p>
          </td>

        </tr>
      </table>
    </div>

  </div>
</template>

<script>
import workShiftApi from '@/api/workShift'
import visitRecordApi from '@/api/visitRecord'
export default {
  name: 'Jiaoban',
  data() {
    return {
      // fileName: [],
      equipment: '',
      netWork: '',
      workOrder: '',
      networkManagement: '',
      fileList: [],
      type: this.$route.query.type,
      typeId: this.$route.query.typeId,
      pbInfoId: this.$route.query.pbInfoId,
      // 基本信息
      roomName: '',
      zbUserName: '',
      startTime: '',
      endTime: '',
      schedName: '',
      phone: '',
      nextZbUser: '',
      fileUrl: ''
    }
  },
  computed: {
    downloadUrl() {
      return process.env.VUE_APP_DOWNLOAD_URL
    }
  },
  mounted() {
    this.getInfo()
    this.getVisitRecordDeatil()
  },
  methods: {
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo(this.pbInfoId).then(res => {
        if (res.data) {
          this.nextZbUser = res.data.nextZbUser
          this.roomName = res.data.roomName
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.schedName = res.data.schedName
        }
      })
    },
    // 获取巡检详情
    getVisitRecordDeatil() {
      const data = {
        type: this.type,
        typeId: this.typeId
      }
      visitRecordApi.getVisitRecordDeatil(data).then((res) => {
        this.equipment = res.data.equipment
        this.netWork = res.data.network
        this.workOrder = res.data.workOrder
        this.networkManagement = res.data.networkManagement
        this.fileList = res.data.uploadFileList
      })
    }

  }
}
</script>

<style lang='scss' scoped>
 table {
    margin: 0 auto;
    border-collapse:collapse;
    tr {
      height:100px;
      td {
        border:1px solid #ebeef5;
        padding: 10px;
        width: 250px;
      }
    }
  }
</style>
