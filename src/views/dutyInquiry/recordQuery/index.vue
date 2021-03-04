<template>
  <div class="app-container">
    <div class="title-content">故障记录列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" border :model="form" class="demo-form-inline">
          <el-form-item label="所属地区">
            <el-select v-model="form.area	" placeholder="请选择所属地区">
              <el-option
                v-for="item in adressList"
                :key="item.uvalue"
                :label="item.ukey"
                :value="item.ukey"
              />
            </el-select>
          </el-form-item>
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
          <el-form-item label="机房：">
            <el-input v-model="form.roomName" placeholder="机房名称" />
          </el-form-item>
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
          <el-form-item label="发生起止时间：">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <span>至</span>
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择日期时间"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="历时范围：">
            <el-date-picker
              v-model="form.minduration"
              type="datetime"
              placeholder="选择最小历时"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <span>至</span>
            <el-date-picker
              v-model="form.maxduration"
              type="datetime"
              placeholder="选择最大历时"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="填报人：">
            <el-input v-model="form.createUser" placeholder="请填写填报人" />
          </el-form-item>
          <el-form-item label="故障标题">
            <el-input v-model="form.title" placeholder="请填写故障标题" />
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="onSubmit()" />
            </el-tooltip>
          </el-form-item>
          <div style="float:right;">
            <el-button type="primary" size="mini" icon="el-icon-document" @click="exportList">导出</el-button>
            <!-- <el-button type="primary" size="mini" icon="el-icon-refresh">刷新</el-button> -->
          </div>
        </el-form>
      </div>
      <div class="main-content-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="序号" align="center" header-align="center" />
          <el-table-column prop="major" label="所属专业" align="center" header-align="center" />
          <el-table-column prop="network" label="所属网络" align="center" header-align="center" />
          <el-table-column prop="title" label="故障标题" align="center" header-align="center" width="300px" />
          <el-table-column prop="area" label="所属地区" align="center" header-align="center" />
          <el-table-column prop="noticeTime" label="发生时间" align="center" header-align="center" />
          <el-table-column prop="findTime" label="发现时间" align="center" header-align="center" />
          <el-table-column prop="findUser" label="发现人" align="center" header-align="center" />
          <el-table-column prop="dealUser" label="处理人" align="center" header-align="center" />
          <el-table-column prop="recoverTime" label="恢复时间" align="center" header-align="center" />
          <el-table-column prop="duration" label="故障历时" align="center" header-align="center" />
          <el-table-column prop="roomName" label="机房" align="center" header-align="center" />
          <el-table-column prop="isFinish" label="是否完成" align="center" header-align="center">
            <template slot-scope="scope">{{ scope.row.isFinish==='1'?'已完成':'未完成' }}</template>
          </el-table-column>
          <el-table-column prop="createUser" label="填报人" align="center" header-align="center" />
          <el-table-column label="操作" align="center" header-align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-content-pagination">
        <el-pagination
          align="center"
          :current-page="current"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="size"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

  </div>
</template>

<script>
import failureLoggingApi from '@/api/failureLogging'
export default {
  name: 'List',
  data() {
    return {
      networkList: [], // 所属网络
      adressList: [], // 所属地区
      majorList: [], // 所属专业

      form: {
        area: '',
        title: '',
        major: '',
        roomName: '',
        isFinish: '',
        network: '',
        startTime: '',
        endTime: '',
        minduration: '',
        maxduration: '',
        createUser: '' // 填报人
      },
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
      tableData: [],
      current: 1,
      size: 10,
      total: null,
      contentDdisposition: ''
    }
  },
  mounted() {
    this.getRecordFaultList()
    this.getSelDicByKinds()
    this.getNetworks()
    this.getAddress()
  },
  methods: {
    // 导出
    exportList() {
      const data = {
        area: this.form.area,
        title: this.form.title,
        major: this.form.major,
        roomName: this.form.roomName,
        isFinish: this.form.isFinish,
        network: this.form.network,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        minduration: this.form.minduration,
        maxduration: this.form.maxduration,
        createUser: this.form.createUser, // 填报
        current: this.current,
        size: this.size
      }
      failureLoggingApi.getExportRecordFaultList(data).then((res) => {
        const fileDownload = require('js-file-download')
        const disposition = res.headers['content-disposition']
        const filename = decodeURI(disposition.match(/filename=(.*)/)[1])
        fileDownload(res.data, filename)
      })
    },

    // 查询故障记录
    onSubmit() {
      this.getRecordFaultList()
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
    // 获取故障记录列表
    getRecordFaultList() {
      const data = {
        area: this.form.area,
        title: this.form.title,
        major: this.form.major,
        roomName: this.form.roomName,
        isFinish: this.form.isFinish,
        network: this.form.network,
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        minduration: this.form.minduration,
        maxduration: this.form.maxduration,
        createUser: this.form.createUser, // 填报

        current: this.current,
        size: this.size
      }
      failureLoggingApi.getRecordFaultList(data).then((res) => {
        this.tableData = res.data.records
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: 'recordDdetail',
        query: {
          id: row.id
        }
      })
    },
    handleDelete(index, row) {
    },
    // 分页部分方法
    handleSizeChange(val) {
      this.size = val
      this.getRecordFaultList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getRecordFaultList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
