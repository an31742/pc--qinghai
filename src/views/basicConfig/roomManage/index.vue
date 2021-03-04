<template>
  <div class="app-container">
    <div class="title-content">机房列表</div>
    <div class="main-content">
      <div class="main-content-add">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="main-content-table">
        <el-table :data="list" border>
          <el-table-column label="序号" type="index" width="80" align="center" />
          <el-table-column label="机房名称" prop="roomName" align="center" />
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" class="primary-button" @click="handleConfig(scope.$index, scope.row)">配置班组</el-button>
              <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="main-content-pagination">
        <el-pagination
          align="center"
          :current-page.sync="tablePage.currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="tablePage.pageSize"
          :total="tablePage.totalCount"
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
      list: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalCount: null
      }
    }
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      const params = {
        current: this.tablePage.currentPage,
        size: this.tablePage.pageSize
      }
      baseConfigApi.getRoomList(params).then(res => {
        this.list = res.data.records
        this.tablePage.currentPage = Number(res.data.current)
        this.tablePage.pageSize = Number(res.data.size)
        this.tablePage.totalCount = Number(res.data.total)
      })
    },
    // 新增机房
    handleAdd() {
      this.$router.push({ path: '/basicConfig/roomManage/roomAdd' })
    },
    // 编辑
    handleEdit(index, row) {
      this.$router.push({ path: '/basicConfig/roomManage/roomAdd', query: {
        id: row.id,
        roomName: row.roomName,
        remark: row.remark
      }})
    },
    // 配置班次
    handleConfig(index, row) {
      this.$router.push({ path: '/basicConfig/roomManage/roomConfig', query: {
        id: row.id
      }})
    },
    // 删除机房
    handleDelete(index, row) {
      baseConfigApi.delRoom({ id: row.id }).then(res => {
        this.$message.success(res.message)
        this.fetchList()
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
