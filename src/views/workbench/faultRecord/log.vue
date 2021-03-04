<template>
  <div class="app-container">
    <div class="title-content">故障记录日志填报</div>
    <div class="workbench-info">
      <div class="workbench-info-label">
        <label>机房名称：</label>
        <span>{{ roomName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>值班日期：</label>
        <span>{{ dataTime }}</span>
      </div>
      <div class="workbench-info-label">
        <label>当前班次：</label>
        <span>{{ schedName }}</span>
      </div>
      <div class="workbench-info-label">
        <label>当班值班长：</label>
        <span>{{ zbUserName }}</span>
      </div>
    </div>
    <div class="main-content">
      <div class="main-content-add">
        <div>
          <el-button type="primary" size="mini" icon="el-icon-document" @click="goAdd">新增</el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click="goRefresh">刷新</el-button>
        </div>
      </div>
      <div class="main-content-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="序号" align="center" header-align="center" />
          <el-table-column prop="major" label="所属专业" align="center" header-align="center" />
          <el-table-column prop="network" label="所属网络" align="center" header-align="center" />
          <el-table-column prop="title" label="故障标题" align="center" header-align="center" />
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
          <el-table-column label="操作" align="center" width="300px">
            <template slot-scope="scope">
              <!-- <el-button size="mini" disabled>派单</el-button> -->
              <el-button size="mini" @click="handleEdit( scope.row)">修改</el-button>
              <!-- <el-button size="mini" disabled>处理人</el-button> -->
              <el-button size="mini" type="danger" @click="handleDelete( scope.row)">删除</el-button>
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
import workShiftApi from '@/api/workShift'
import failureLoggingApi from '@/api/failureLogging'
export default {
  data() {
    return {
      tableData: [],
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

      current: 1,
      size: 10,
      total: null,
      // 信息详情
      dataTime: '',
      roomName: '',
      zbUser: '',
      zbUserName: '',
      handStartTime: '',
      schedName: ''
    }
  },
  mounted() {
    this.getInfo()
    this.getRecordFaultList()
  },
  methods: {
    // 值班基本信息
    getInfo() {
      workShiftApi.getInfo().then(res => {
        if (res.data) {
          this.roomName = res.data.roomName
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
    // 删除
    handleDelete(row) {
      const data = {
        id: row.id
      }
      failureLoggingApi.delRecordFault(data).then((res) => {
        this.$confirm('是否确认删除？')
          .then((_) => {
            this.getRecordFaultList()
          })
          .catch((_) => {})
      })
    },
    // 修改
    handleEdit(row) {
      this.$router.push({
        path: 'add',
        query: {
          id: row.id
        }
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
    // 分页部分方法
    handleSizeChange(val) {
      this.size = val
      this.getRecordFaultList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.getRecordFaultList()
    },
    goAdd() {
      this.$router.push({
        path: 'add'
      })
    },
    goRefresh() {
      this.$router.go(0)
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
