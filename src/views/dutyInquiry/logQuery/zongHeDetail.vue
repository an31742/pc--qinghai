<template>
  <div class="app-container">
    <div class="title-content">综合日志记录详情</div>
    <div class="workbench-info">
      <div class="workbench-info-label">
        <label>值班机房：</label>
        <span>{{ roomName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>值班日期：</label>
        <span>{{ dataTime }}</span>
      </div>
      <div class="workbench-info-label">
        <label>值班人员：</label>
        <span>{{ zbUserName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>班次：</label>
        <span>{{ schedName }}</span>
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
    <div class="workbench-info">
      <div class="workbench-info-half">
        <label>接班人：</label>
        <span>{{ nextZbUser }}</span>
      </div>
      <div class="workbench-info-half">
        <label>交班时间：</label>
        <span>{{ handEndTime }}</span>
      </div>
    </div>
    <div class="main-content">
      <h4>值班巡检记录内容</h4>
      <table>
        <tr>
          <td style="width:15%">巡检机房所有设备运行情况：</td>
          <td>
            {{ zbInspection.equipment }}
          </td>
        </tr>
        <tr>
          <td>巡检网管运行情况</td>
          <td>
            {{ zbInspection.networkManagement }}
          </td>
        </tr>
        <tr>
          <td>故障工单处理情况</td>
          <td>
            {{ zbInspection.workOrder }}
          </td>
        </tr>
        <tr>
          <td>巡视网络运行情况</td>
          <td>
            {{ zbInspection.netWork }}
          </td>
        </tr>
        <tr>
          <td>附件：</td>
          <td>
            <p v-for="el in zbInspection.uploadFileList" :key="el.id">
              <a style="color:red" :href="downloadUrl+el.fileUrl">{{ el.fileName }}</a>
            </p>
          </td>
        </tr>
      </table>
      <h4>交接项</h4>
      <table>
        <tr>
          <td style="width:15%">遗留问题交接：</td>
          <td>
            {{ zbHand.problem }}
          </td>
        </tr>
        <tr>
          <td>其他事务交接</td>
          <td>
            {{ zbHand.work }}
          </td>
        </tr>
        <tr>
          <td>物品交接情况</td>
          <td>
            {{ zbHand.goods }}
          </td>
        </tr>
        <tr>
          <td>附件：</td>
          <td>
            <p v-for="el in zbHand.uploadFileList" :key="el.id">
              <a style="color:red" :href="downloadUrl+el.fileUrl">{{ el.fileName }}</a>
            </p>
          </td>
        </tr>
      </table>
      <h4>值班日志记录内容</h4>
      <table>
        <tr>
          <th>创建时间</th>
          <th>值班日志</th>
          <th>上传文件</th>
        </tr>
        <tr v-for="item in zbLogs" :key="item.id">
          <td align="center">{{ item.createTime }}</td>
          <td align="center">{{ item.log }}</td>
          <td align="center">
            <p v-for="el in item.fileList" :key="el.id">
              <a style="color:red" :href="downloadUrl +el.fileUrl">{{ el.fileName }}</a>
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
      pbInfoId: this.$route.query.pbInfoId,
      zbHand: { uploadFileList: [] },
      zbInspection: { uploadFileList: [] },
      zbLogs: [],
      // 值班信息
      roomName: '',
      nextZbUser: '',
      zbUserName: '',
      startTime: '',
      endTime: '',
      handEndTime: '',
      handStartTime: '',
      schedName: '',
      dataTime: ''

    }
  },
  computed: {
    downloadUrl() {
      return process.env.VUE_APP_DOWNLOAD_URL
    }
  },
  mounted() {
    this.getInfo()
    this.getmultiLogs()
  },
  methods: {
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo(this.pbInfoId).then(res => {
        if (res.data) {
          this.roomName = res.data.roomName
          this.nextZbUser = res.data.nextZbUser
          this.zbUserName = res.data.zbUserName
          this.startTime = res.data.startTime
          this.endTime = res.data.endTime
          this.handEndTime = res.data.handEndTime
          this.handStartTime = res.data.handStartTime
          this.schedName = res.data.schedName
          // this.dataTime = res.data.startTime
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
        }
      })
    },
    // 其他详情
    getmultiLogs() {
      visitRecordApi.getmultiLogs({ pbInfoId: this.pbInfoId }).then(res => {
        this.zbHand = res.data.zbHand
        this.zbInspection = res.data.zbInspection
        this.zbLogs = res.data.zbLogs
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
