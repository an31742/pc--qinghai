<template>
  <div class="app-container">
    <div class="title-content">值班日志记录详情</div>
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
      <h4>值班日志记录内容</h4>
      <table>
        <tr>

          <th>创建时间</th>
          <th>值班日志</th>
          <th>上传文件</th>
        </tr>
        <tr v-for="item in tableData" :key="item.id">
          <td align="center">{{ item.createTime }}</td>
          <td align="center">{{ item.log }}</td>
          <td align="center">
            <p v-for="el in item.fileList" :key="el.id">
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
      type: this.$route.query.type,
      typeId: this.$route.query.typeId,
      pbInfoId: this.$route.query.pbInfoId,
      tableData: [],
      fileName: [],
      // 基本信息
      roomName: '',
      zbUserName: '',
      startTime: '',
      endTime: '',
      schedName: '',
      dataTime: '',
      nextZbUser: '',
      phone: '',
      id: ''

    }
  },
  computed: {
    downloadUrl() {
      return process.env.VUE_APP_DOWNLOAD_URL
    }
  },
  mounted() {
    this.getVisitRecordDeatil()
    this.getInfo()
  },

  methods: {
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo(this.pbInfoId).then(res => {
        if (res.data) {
          this.phone = res.data.pohne
          this.roomName = res.data.roomName
          this.nextZbUser = res.data.nextZbUser
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.handEndTime = res.data.handEndTime
          this.handStartTime = res.data.handStartTime
          this.schedName = res.data.schedName
          this.id = res.data.id
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
        }
      })
    },
    // 获取值班日志详情
    getVisitRecordDeatil() {
      const data = {
        pbInfoId: this.$route.query.pbInfoId,
        type: this.type,
        typeId: this.typeId
      }
      visitRecordApi.getVisitRecordDeatil(data).then((res) => {
        this.tableData = res.data
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

      th{
        height:40px;
        border:1px solid #ebeef5;
        padding: 10px;
        width: 250px;
      }
      td {
        height:100px;
        border:1px solid #ebeef5;
        padding: 10px;
        width: 250px;
      }
    }
  }
</style>
