<template>
  <div class="app-container">
    <div class="title-content">值班日志列表</div>
    <div class="main-content">
      <table class="diy-table" width="100%" border cellspacing="0" cellpadding="0">
        <tr>
          <td>序号（流水号）：</td>
          <td>{{ id }}</td>
          <td>故障标题：</td>
          <td colspan="3">{{ title }}</td>
        </tr>
        <tr>
          <td>所属网络：</td>
          <td>{{ network }}</td>
          <td>故障专业：</td>
          <td>{{ major }}</td>
          <td>所属地区：</td>
          <td>{{ area }}</td>
        </tr>
        <tr>
          <td>故障地点：</td>
          <td>{{ place }}</td>
          <td>故障发生时间：</td>
          <td>{{ createTime }}</td>
          <td>业务代通时间</td>
          <td>{{ noticeTime }}</td>
        </tr>
        <tr>
          <td>故障发现时间：</td>
          <td>{{ findTime }}</td>
          <td>故障恢复时间：</td>
          <td>{{ recoverTime }}</td>
          <td>故障历时（分钟）：</td>
          <td>{{ duration }}</td>
        </tr>
        <tr>
          <td>发现人：</td>
          <td>{{ find_user }}</td>
          <td>处理人：</td>
          <td>{{ deal_user }}</td>
          <td>填报人：</td>
          <td>{{ createUser }}</td>
        </tr>
        <tr>
          <td>故障现象及影响业务范围：</td>
          <td colspan="5">{{ phenomenon }}</td>
        </tr>
        <tr>
          <td>故障原因：</td>
          <td colspan="5">{{ reason }}</td>
        </tr>
        <tr>
          <td>故障处理过程：</td>
          <td colspan="5">{{ dealRecord }}</td>
        </tr>
        <tr>
          <td>备注：</td>
          <td colspan="5">{{ remark }}</td>
        </tr>
        <tr>
          <td>是否完成：</td>
          <td>{{ isFinish==="1" ?"已完成":"未完成" }}</td>
          <td>附件：</td>
          <td colspan="3"> <a v-for="(el,urlIndex) in fileList" :key="el.id" :href="downloadUrl+el.fileUrl">{{ `${urlIndex==0?'':','}${el.fileName}` }}</a></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import failureLoggingApi from '@/api/failureLogging'
import { parseTime } from '@/utils'
export default {
  name: 'Detail',
  data() {
    return {
      id: this.$route.query.id,
      recordDefault: {},
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
      fileList: []
    }
  },
  computed: {
    downloadUrl() {
      return process.env.VUE_APP_DOWNLOAD_URL
    }
  },
  mounted() {
    this.getSelRecordDefault()
  },
  methods: {
    getSelRecordDefault() {
      const data = {
        id: this.id
      }
      failureLoggingApi.getSelRecordDefault(data).then((res) => {
        this.recordDefault = res.data.record
        this.title = res.data.record.title
        this.area = res.data.record.area

        this.major = res.data.record.major
        this.network = res.data.record.network
        this.place = res.data.record.place
        this.createTime = parseTime(new Date(res.data.record.createTime))
        this.noticeTime = parseTime(new Date(res.data.record.noticeTime))
        this.findTime = parseTime(new Date(res.data.record.findTime))
        this.recoverTime = parseTime(new Date(res.data.record.recoverTime))
        this.duration = res.data.record.duration
        this.find_user = res.data.record.findUser
        this.deal_user = res.data.record.dealUser
        this.phenomenon = res.data.record.phenomenon
        this.reason = res.data.record.reason
        this.dealRecord = res.data.record.dealRecord
        this.remark = res.data.record.remark
        this.isFinish = res.data.record.isFinish
        this.createUser = res.data.record.createUser
        this.fileList = res.data.record.files
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  // .diy-table {
  //   border: 0.5px solid rgb(223, 230, 236);
  //   td {
  //     border: 0.5px solid rgb(223, 230, 236);
  //     padding: 12px;
  //   }
  // }
   tr {
    height: 50px;
    td {
      width:12.5%;
      text-align: center;
      border: 1px #dfe6ec solid;
      padding: 4px;
    }
  }
  table{
    margin: 0 auto;
    border-collapse: collapse;
  }
}
</style>
