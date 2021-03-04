<template>
  <div class="app-container">
    <div class="title-content">值班考核列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="选择机房">
            <el-select v-model="formInline.roomId" clearable placeholder="请选择机房">
              <el-option
                v-for="item in roomOptions"
                :key="item.id"
                :label="item.roomName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="值班人">
            <el-input v-model="formInline.zbUserName" placeholder="请填写值班人" />
          </el-form-item>
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
        <el-table :data="tableData" border>
          <el-table-column prop="roomName" label="机房名称" align="center" />
          <el-table-column prop="zbUserName" label="值班人" align="center" />
          <el-table-column prop="schedName" label="班次" align="center" />
          <el-table-column prop="startTime" label="开始时间" align="center" />
          <el-table-column prop="endTime" label="结束时间" align="center" />
          <el-table-column prop="isExamine" label="是否考核" align="center" />
          <el-table-column prop="level" label="评价等级" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.isExamine === '是'" type="text" class="primary-button" @click="onAssess(scope.row)">考核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="main-content-pagination">
        <el-pagination
          align="center"
          :current-page.sync="tablePage.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="tablePage.size"
          :total="tablePage.totalCount"
          class="app-table-pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import assessmentApi from '../../../api/assessment'
import setTypeApi from '../../../api/typesetting'
export default {
  data() {
    return {
      formInline: {
        roomId: '',
        zbUserName: '',
        startTime: '',
        endTime: ''
      },
      rangeDate: '', // 值班起始时间
      roomOptions: [],
      value: '',
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalCount: null
      }
      // tablePage: {
      //   currentPage: 1,
      //   pageSize: 10,
      //   totalCount: null
      // },
      // username: '1760020588',
      // realname: '测试',
      // phone: '17600205884',
      // current: '1',
      // size: '10'
    }
  },
  mounted() {
    this.getRoomList()
  },
  methods: {
    // 查询
    onSubmit() {
      this.formInline.startTime = ''
      this.formInline.endTime = ''
      this.getAssessmentList()
    },
    // 机房名称下拉框
    getRoomList() {
      setTypeApi.getRoomList().then(res => {
        this.roomOptions = res.data.records
        this.getAssessmentList()// 查询考核列表
      })
    },
    // 值班考核列表
    getAssessmentList() {
      if (this.rangeDate) {
        this.formInline.startTime = this.rangeDate[0]
        this.formInline.endTime = this.rangeDate[1]
      }
      assessmentApi.queryAssessmentList(this.formInline, this.tablePage).then(res => {
        this.tableData = res.data.record
        for (var i in this.tableData) {
          if (this.tableData[i].isExamine === '1') {
            this.tableData[i].isExamine = '是'
          } else {
            this.tableData[i].isExamine = '否'
          }
          if (this.tableData[i].level === '1') {
            this.tableData[i].level = '优秀'
          } else if (this.tableData[i].level === '2') {
            this.tableData[i].level = '良好'
          } else if (this.tableData[i].level === '3') {
            this.tableData[i].level = '一般'
          } else if (this.tableData[i].level === '4') {
            this.tableData[i].level = '较差'
          } else if (this.tableData[i].level === '5') {
            this.tableData[i].level = '差'
          } else {
            this.tableData[i].level = '-'
          }
        }
        this.tablePage.currentPage = Number(res.data.current)
        this.tablePage.pageSize = Number(res.data.size)
        this.tablePage.totalCount = Number(res.data.total)
      })
    },
    // 详情
    onAssess(row) {
      this.$router.push({ path: '/dutyAssessment/assessment/detail',
        query: {
          pbInfoId: row.pbInfoId,
          id: row.id
        }
      })
    },
    // 分页部分方法
    handleSizeChange(val) {
      this.tablePage.pageSize = val
      // this.fetchTableData()
    },
    handleCurrentChange(val) {
      this.tablePage.currentPage = val
      // this.fetchTableData()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
