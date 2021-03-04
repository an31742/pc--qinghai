<template>
  <div class="app-container">
    <div class="title-content">排班配置列表</div>
    <div class="main-content">
      <div class="main-content-add">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="onAdd">新增</el-button>
      </div>
      <div class="main-content-table">
        <el-table :data="tableData" border>
          <el-table-column prop="pbName" label="排班名称" align="center" />
          <el-table-column prop="roomName" label="机房名称" align="center" />
          <el-table-column prop="zbConfId" label="值班配置" align="center" />
          <el-table-column prop="isAutomatic" label="排班方法" align="center" />
          <el-table-column prop="cycle" label="排班周期（天）" align="center" />
          <el-table-column prop="startTime" label="开始时间" align="center" />
          <el-table-column prop="endTime" label="结束时间" align="center" />
          <el-table-column prop="rule" label="排班规则" align="center" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="primary-button" @click="onEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="onRemove(scope.row)">删除</el-button>
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
import setTypeApi from '@/api/typesetting'
export default {
  data() {
    return {
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalCount: null
      }
    }
  },
  mounted() {
    this.getPbList()
  },
  methods: {
    getPbList() {
      const isAutomaticArr = ['手动', '自动']
      const ruleArr = ['不跳过周末', '跳过周末']
      setTypeApi.getPbList(this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
        this.tableData = res.data.records
        this.tablePage.currentPage = Number(res.data.current)
        this.tablePage.pageSize = Number(res.data.size)
        this.tablePage.totalCount = Number(res.data.total)
        res.data.records.forEach(item => {
          item.isAutomatic = isAutomaticArr[item.isAutomatic]
          item.rule = ruleArr[item.rule]
        })
      })
    },
    // 跳转至新增排班配置
    onAdd() {
      this.$router.push({ path: 'config' })
    },
    // 编辑
    onEdit(row) {
      this.$router.push({ path: 'config',
        query: {
          id: row.id
        }
      })
    },
    // 删除
    onRemove(row) {
      setTypeApi.reMoveData(row.id).then(res => {
        this.getPbList()
      })
    },
    // 分页部分方法
    handleSizeChange(val) {
      this.tablePage.pageSize = val
      this.getPbList()
    },
    handleCurrentChange(val) {
      this.tablePage.currentPage = val
      this.getPbList()
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
