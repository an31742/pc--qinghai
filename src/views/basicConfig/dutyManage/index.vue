<template>
  <div class="app-container">
    <div class="title-content">值班配置列表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" border :model="formInline" class="demo-form-inline">
          <!-- <el-form-item label="机房名称：">
            <el-input v-model="formInline.roomName" placeholder="机房名称" />
          </el-form-item> -->
          <el-form-item label="值班名称：">
            <el-input v-model="formInline.zbName" placeholder="值班名称" />
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="search()" />
            </el-tooltip>
          </el-form-item>
          <el-button type="primary" style="float:right;" size="small" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form>
      </div>
      <div class="main-content-table">
        <el-table border :data="list">
          <el-table-column label="值班名称" prop="zbName" align="center" />
          <el-table-column label="班次明细" align="center">
            <template slot-scope="scope">
              <p
                v-for="item in scope.row.zbSchedList"
                :key="item.id"
              >{{ item.schedName }} : {{ item.startTime }} - {{ item.endTime }};</p>
            </template>
          </el-table-column>
          <el-table-column label="提前时间（分钟）" prop="moveUpTime" align="center" />
          <el-table-column label="延后时间（分钟）" prop="moveAfterTime" align="center" />
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
import baseConfigApi from '@/api/baseConfig'
export default {
  name: 'List',
  data() {
    return {
      formInline: {
        // roomName: '',
        zbName: ''
      },
      list: [],
      current: 1,
      size: 10,
      total: null
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      const params = {
        zbName: this.formInline.zbName,
        current: this.current,
        size: this.size
      }
      baseConfigApi.getZbList(params).then((res) => {
        const data = res.data.records
        this.list = data
        this.current = Number(res.data.current)
        this.size = Number(res.data.size)
        this.total = Number(res.data.total)
      })
    },
    // chaxun
    search() {
      this.fetchList()
    },
    add() {
      this.$router.push({ path: '/basicConfig/dutyManage/dutyConfig' })
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/basicConfig/dutyManage/dutyConfig',
        query: {
          id: row.id,
          zbName: row.zbName,
          moveUpTime: row.moveUpTime,
          moveAfterTime: row.moveAfterTime,
          zbSchedList: row.zbSchedList.map((item) => {
            return {
              schedName: item.schedName,
              startTime: item.startTime,
              endTime: item.endTime
            }
          })
        }
      })
    },
    handleDelete(index, row) {
      const data = { id: row.id }
      baseConfigApi.configRoleRemove(data).then((res) => {
        this.$confirm('是否确认删除？')
          .then(_ => {
            this.fetchList()
          })
          .catch(_ => {})
      })
    },
    // 分页部分方法
    handleSizeChange(val) {
      this.size = val
      this.fetchList()
    },
    handleCurrentChange(val) {
      this.current = val
      this.fetchList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
