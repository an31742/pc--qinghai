<template>
  <div class="app-container">
    <div class="title-content">值班日志列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" border :model="formInline" class="demo-form-inline">
          <el-form-item label="选择机房：">
            <el-select v-model="formInline.selRoomList" placeholder="请选择机房">
              <el-option
                v-for="item in roomList"
                :key="item.id"
                :label="item.roomName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="查询内容：">
            <el-select v-model="formInline.queryContent" placeholder="请选择查询内容">
              <el-option
                v-for="item in queries"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="值班人：">
            <el-input v-model="formInline.dutyName" placeholder="值班人" />
          </el-form-item>
          <el-form-item label="值班开始起止时间：">
            <el-date-picker
              v-model="formInline.startTime"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <span>至</span>
            <el-date-picker
              v-model="formInline.endTime"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-table border :data="tableData">
          <el-table-column label="机房名称" prop="roomName" align="center" />
          <el-table-column label="值班人" prop="zbUserName" align="center" />
          <el-table-column label="值班班次" prop="schedName" align="center" />
          <el-table-column label="日志名称" prop="schedName" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type==='1'">
                交接班
              </span>
              <span v-else-if="scope.row.type==='2'">
                巡检
              </span>
              <span v-else-if="scope.row.type==='3'">
                值班日志
              </span>
            </template>
          </el-table-column>
          <el-table-column label="值班开始时间" prop="startTime" align="center" />
          <el-table-column label="值班结束时间" prop="endTime" align="center" />
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button type="text" class="primary-button" @click="handleDetail(scope.$index, scope.row)">综合详情</el-button>
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
import onDutyQueryApi from '@/api/onDutyQuery'
import machineRoomApi from '@/api/machineRoom'
export default {
  name: 'List',
  data() {
    return {
      formInline: {
        dutyName: '',
        selRoomList: '',
        queryContent: '',
        startTime: '',
        endTime: ''
      },
      list: [],
      current: 1,
      size: 10,
      total: null,

      roomList: [],
      roomConfigList: {
        current: 1,
        size: 10000
      },
      queries: [
        {
          value: '1',
          label: '交接班'
        },
        {
          value: '2',
          label: '巡检'
        },
        {
          value: '3',
          label: '值班日志'
        }
      ],
      tableData: []
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.getLogsList()
    this.getRoomList()
  },
  methods: {
    // 跳转综合详情
    handleDetail(index, row) {
      this.$router.push({
        path: 'zongHeDetail',
        query: { typeId: row.typeId,
          pbInfoId: row.pbInfoId
        }
      })
    },
    // 值班日志列表
    getLogsList() {
      const data = {
        current: this.current,
        size: this.size,
        roomId: this.formInline.selRoomList,
        type: this.formInline.queryContent,
        zbUser: this.formInline.dutyName,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime
      }

      onDutyQueryApi.queryQutyList(data).then((res) => {
        this.tableData = res.data.records
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    // 获取机房列表
    getRoomList() {
      const data = {
        size: this.roomConfigList.size,
        current: this.roomConfigList.current
      }
      machineRoomApi.getRoomList(data).then((res) => {
        this.roomList = res.data.records
      })
    },
    // 查询
    onSubmit() {
      const data = {
        current: 1,
        size: 10,
        roomId: this.formInline.selRoomList,
        type: this.formInline.queryContent,
        zbUser: this.formInline.dutyName,
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime
      }

      onDutyQueryApi.queryQutyList(data).then((res) => {
        this.tableData = res.data.records
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    // 改变每页多少条
    handleSizeChange(val) {
      this.size = val
      this.getLogsList()
    },
    // 改变当前页
    handleCurrentChange(val) {
      this.current = val
      this.getLogsList()
    },
    // 查看跳转
    handleView(index, row) {
      if (row.type === '1') {
        this.$router.push({
          path: 'jiaoJieDetail',
          query: {
            type: '1',
            typeId: row.typeId,
            pbInfoId: row.pbInfoId }
        })
      } else if (row.type === '2') {
        this.$router.push({
          path: 'xunJianDetail',
          query: {
            type: '2',
            typeId: row.typeId,
            pbInfoId: row.pbInfoId
          }
        })
      } else if (row.type === '3') {
        this.$router.push({
          path: 'zhiBanDetail',
          query: {
            typeId: row.typeId,
            pbInfoId: row.pbInfoId,
            type: '3'
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
