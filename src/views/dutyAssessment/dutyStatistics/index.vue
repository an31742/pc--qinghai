<template>
  <div class="app-container">
    <div class="title-content">值班考核统计</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="值班起始时间">
            <el-date-picker
              v-model="rangeDate"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="onSubmit()" />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-content-table">
        <el-table :data="tableData">
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="roomName" align="center" label="机房" />
          <el-table-column align="center" label="考核状态统计">
            <el-table-column prop="examine" align="center" label="应考核" width="90" />
            <el-table-column prop="alreadyExamine" align="center" label="已考核" width="90" />
            <el-table-column prop="noExamine" align="center" label="未考核" width="90" />
          </el-table-column>
          <el-table-column align="center" label="考核评价统计">
            <el-table-column prop="levelA" align="center" label="优秀" width="80" />
            <el-table-column prop="levelB" align="center" label="良好" width="80" />
            <el-table-column prop="levelC" align="center" label="一般" width="80" />
            <el-table-column prop="levelD" align="center" label="较差" width="80" />
            <el-table-column prop="levelE" align="center" label="差" width="80" />
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import assessmentApi from '@/api/assessment'
export default {
  data() {
    return {
      formInline: {
        startTime: '',
        endTime: ''
      },
      rangeDate: '',
      tableData: []
    }
  },
  mounted() {
    this.getZbkhTable()
  },
  methods: {
    // 查询
    onSubmit() {
      this.formInline.startTime = ''
      this.formInline.endTime = ''
      this.getZbkhTable()
    },
    getZbkhTable() {
      if (this.rangeDate) {
        this.formInline.startTime = this.rangeDate[0]
        this.formInline.endTime = this.rangeDate[1]
      }
      assessmentApi.statisticsList(this.formInline).then(res => {
        // res.data.forEach(el => {
        //   for (const j in Object.keys(el)) {
        //     if ((Object.keys(el)[j] === 'levelA') || (Object.keys(el)[j] === 'levelB') ||
        //       (Object.keys(el)[j] === 'levelC') || (Object.keys(el)[j] === 'levelD') ||
        //       (Object.keys(el)[j] === 'levelE')) {
        //       if (el[Object.keys(el)[j]] === '1') {
        //         el[Object.keys(el)[j]] = '是'
        //       } else {
        //         el[Object.keys(el)[j]] = '否'
        //       }
        //     }
        //   }
        // })
        this.tableData = res.data
      })
    }
  }
}
</script>

<style>

</style>
