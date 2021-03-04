<template>
  <div class="app-container">
    <div class="title-content">安排排班表</div>
    <div class="main-content">
      <div class="main-content-query">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="排班月份">
            <el-date-picker
              v-model="formInline.month"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM"
            />
          </el-form-item>
          <el-form-item label="选择值班机房">
            <el-select v-model="formInline.roomId" placeholder="请选择">
              <el-option
                v-for="item in roomOptions"
                :key="item.id"
                :label="item.roomName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-tooltip content="搜索" placement="top">
              <el-button icon="el-icon-search" circle @click="onSee()" />
            </el-tooltip>
          </el-form-item>
          <el-form-item>
            <el-tooltip content="编辑" placement="top">
              <el-button icon="el-icon-edit" circle @click="onEdit()" />
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
      <el-calendar v-model="monthValue">
        <template slot="dateCell" slot-scope="{data}">
          <div class="calendarName">
            <div class="nameDay">{{ data.day.split('-').slice(2).join('') }}</div>
            <div class="nameList">
              <div v-for="(item,index) in dealMyDate(data.day)" :key="index">
                <div class="nameList-text">{{ item }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>
  </div>
</template>

<script>
import setTypeApi from '@/api/typesetting'
export default {
  data() {
    return {
      formInline: {
        month: this.$route.query.month,
        roomId: this.$route.query.roomId,
        size: 1000
      },
      currenYear: new Date().getFullYear().toString(),
      currentMonth: new Date().getMonth() + 1,
      monthValue: this.$route.query.month,
      roomOptions: [],
      calendarDataList: []// 日历数据列表
    }
  },
  mounted() {
    this.getRoomList()
  },
  methods: {

    // 机房名称下拉框
    getRoomList() {
      setTypeApi.getRoomList().then(res => {
        this.roomOptions = res.data.records
        if (!this.formInline.roomId) {
          this.formInline.month = `${this.currenYear}-${this.currentMonth}`
          this.formInline.roomId = this.roomOptions[0].id
        }

        this.getSchedulingList()
      })
    },
    // 排班表数据
    getSchedulingList() {
      setTypeApi.queryDayList(this.formInline).then(res => {
        this.calendarDataList = res.data
      })
    },
    // 处理日历中要显示的数据
    dealMyDate(val) {
      const showData = []
      for (let i = 0; i < this.calendarDataList.length; i++) {
        if (this.calendarDataList[i].startTime.slice(0, 10) === val) {
          showData.push(this.calendarDataList[i].schedName + ':' + this.calendarDataList[i].groupName)
        }
      }
      return showData
    },
    // 查看
    onSee() {
      this.monthValue = this.formInline.month
      this.getSchedulingList()
    },
    // 编辑
    onEdit() {
      this.$router.push({
        path: 'table-edit',
        query: {
          month: this.formInline.month,
          roomId: this.formInline.roomId
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container>>>.el-calendar-table .el-calendar-day{
  height:125px;
}
.calendarName{
  // .nameDay{
  // }
  .nameList{
    overflow: auto;
    // width:40px;
    height:100px;
    &-text{
      font-size:12px;
      transform: scale(0.8);
    }
  }
}

</style>
