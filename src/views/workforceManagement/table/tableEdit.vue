<template>
  <div class="app-container">
    <div class="title-content">安排排班表</div>
    <div class="main-content">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="排班月份">
          <el-date-picker v-model="formInline.month" disabled type="month" placeholder="选择月" />
        </el-form-item>
        <el-form-item label="选择值班机房">
          <el-select v-model="formInline.roomId" disabled placeholder="请选择" @change="selectJfName">
            <el-option
              v-for="item in roomOptions"
              :key="item.id"
              :label="item.roomName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-tooltip content="保存" placement="top">
            <el-button icon="el-icon-finished" circle @click="onHold()" />
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <el-calendar v-model="formInline.month">
      <template slot="dateCell" slot-scope="{ data}">
        <!-- <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(2) }} {{ data.isSelected ? '✔️' : '' }}
        </p> -->
        <div class="calendarName">
          <div class="nameDay">{{ data.day.split('-').slice(2).join('') }}</div>
          <div class="nameList">
            <div v-for="(item,index) in dealMyDate(data.day)" :key="index" class="nameList-text">
              <label>{{ item.schedName }}</label>
              <select v-model="item.groupId" placeholder="请选择" style="width:100px;" size="mini" @change="selectBz($event.target.value,item)">
                <option
                  v-for="el in groupOptions"
                  :key="el.id"
                  :label="el.name"
                  :value="el.id"
                />
              </select>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
import setTypeApi from '@/api/typesetting'
import baseConfigApi from '@/api/baseConfig'
export default {
  data() {
    return {
      formInline: {
        month: this.$route.query.month,
        roomId: this.$route.query.roomId
      },
      // roomName: this.$route.query.roomName,
      roomOptions: [],
      calendarDataList: [], // 日历数据列表
      groupOptions: [],
      submitList: [], // 保存时提交列表
      value: ''
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
        // this.formInline.month = this.roomOptions[0].createTime.slice(0, 7)
        // this.formInline.month = '2020-10'
        // this.formInline.roomId = this.roomOptions[0].id
        // this.formInline.roomId = '1284023362299998218'
        this.getSchedulingList()
        this.selectGroupList()
      })
    },
    // 选择机房事件
    selectJfName(val) {
      this.formInline.roomId = val
      this.selectGroupList()
    },
    // 调用班组列表接口
    selectGroupList() {
      const params = {
        roomId: this.formInline.roomId,
        current: this.current,
        size: this.size
      }
      baseConfigApi.getGroupList(params).then(res => {
        this.groupOptions = res.data.records
      })
    },
    // 排班表数据
    getSchedulingList() {
      setTypeApi.queryDayList(this.formInline).then(res => {
        this.calendarDataList = res.data
        for (var i in this.calendarDataList) {
          this.submitList.push({ ...this.calendarDataList[i] })
        }
      })
    },
    // 处理日历中要显示的数据
    dealMyDate(val) {
      const showData = []
      for (let i = 0; i < this.submitList.length; i++) {
        if (this.submitList[i].startTime.slice(0, 10) === val) {
          // this.submitList[i].push(this.submitList[i])
          this.$set(this.submitList[i], 'groupNameId', '')
          showData.push(this.submitList[i])
          // showData.push(this.submitList[i])
          // + ':' + this.calendarDataList[i].zbUser
        }
      }
      return showData
    },
    // 日历格子中选择班组
    selectBz(value, item) {
      let obj = {}
      obj = this.groupOptions.find((item) => {
        return item.id === value
      })
      item.groupId = obj.id
      item.groupName = obj.name
      item.zbUser = obj.teamLead
    },
    // 编辑保存
    onHold() {
      setTypeApi.saveTimeList(this.submitList).then(res => {
        this.$router.push({ path: 'table-see',
          query: {
            month: this.$route.query.month,
            roomId: this.formInline.roomId
          }
        })
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
  display:flex;
  flex-direction:row;
}
.nameDay{
  width:10px;
}
.nameList{
  flex:1;
  justify-content: flex-start;
  overflow: auto;
  height:117px;
  &-text{
    font-size:12px;
    transform: scale(0.6);
  }
}
</style>
