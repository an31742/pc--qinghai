<template>
  <div class="app-container">
    <div class="title-content">交接班记录详情</div>
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
        <label>值班人：</label>
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
      <table class="table">
        <tr>
          <td style="width:15%">遗留问题交接：</td>
          <td>
            {{ problem }}
          </td>
        </tr>
        <tr>
          <td>其他事务交接</td>
          <td>
            {{ work }}
          </td>
        </tr>
        <tr>
          <td>物品交接情况</td>
          <td>
            {{ goods }}
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
export default {
  name: 'Jiaoban',
  data() {
    return {
      type: this.$route.query.type,
      typeId: this.$route.query.typeId,
      pbInfoId: this.$route.query.pbInfoId,
      problem: '',
      work: '',
      goods: '',
      fileList: '',
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
    this.getWorkShiftInfo()
    this.getInfo()
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
          this.dataTime = new Date(res.data.startTime).toLocaleDateString()
        }
      })
    },
    // 交班详情
    getWorkShiftInfo() {
      const data = {
        type: this.type,
        typeId: this.typeId
      }
      workShiftApi.getWorkShiftInfo(data).then(res => {
        this.problem = res.data.problem
        this.goods = res.data.goods
        this.work = res.data.work
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
