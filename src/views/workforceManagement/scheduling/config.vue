<template>
  <div class="app-container">
    <div class="title-content">排班配置</div>
    <div class="main-content">
      <div class="main-content-form">
        <el-form ref="form" :model="form" label-width="100px" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="排班名称" prop="pbName">
                <el-input v-model="form.pbName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="机房名称" prop="roomId">
                <el-select v-model="form.roomId" placeholder="请选择机房名称" @change="selectJfName">
                  <el-option
                    v-for="(item,i) in roomOptions"
                    :key="i"
                    :label="item.roomName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="值班配置名称" prop="zbConfId">
                <el-select v-model="form.zbConfId" placeholder="请选择值班配置名称" @change="selectZbName">
                  <el-option
                    v-for="(item,idx) in dutyOptions"
                    :key="idx"
                    :label="item.zbName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="活动时间" prop="activityTime">
              <el-date-picker
                v-model="activityTime"
                type="daterange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="排班方法" prop="isAutomatic">
              <el-radio-group v-model="form.isAutomatic">
                <el-radio :label="1">自动</el-radio>
                <el-radio :label="0" disabled>手动</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="排版规则">
              <el-checkbox-group v-model="ruleOptions">
                <el-checkbox label="1" disabled>允许覆盖已有排班</el-checkbox>
                <el-checkbox label="2" disabled>跳过周末</el-checkbox>
                <el-checkbox label="3" disabled>非整周期跳过不排班</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-row>
          <el-row v-if="form.roomId&&form.zbConfId" :gutter="20">
            <el-col :span="8">
              <el-form-item label="排班周期(天)" prop="cycle">
                <el-input-number v-model="form.cycle" :min="0" :max="31" label="描述文字" @change="handleChange" />
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.roomId&&form.zbConfId" class="option-card">
            <!-- <template slot-scope="scope"> -->
            <el-card v-for="(el,index) in cardList" ref="box-card" :key="index" class="box-card">
              <div slot="header" class="clearfix">
                <span>第{{ index+1 }}天</span>
              </div>
              <div>
                <table width="100%">
                  <tr>
                    <td>班次</td>
                    <td>选择班组</td>
                  </tr>
                  <tr v-for="(item,i) in el.orderData" :key="i">
                    <td>{{ item.schedName }}</td>
                    <td>
                      <el-select v-model="item.teamInfo" placeholder="请选择" @change="changeBz($event,index,i)">
                        <el-option
                          v-for="(ol,n) in groupOptions"
                          :key="n"
                          :label="ol.name"
                          :value="ol.name+','+ol.id"
                        />
                      </el-select>

                    </td>
                  </tr>
                </table>
                <!-- <el-table :data="el.orderData" border>
              <el-table-column prop="schedName" label="班次" width="80" />
              <el-table-column label="选择班组">
                <template slot-scope="scope">
                  <el-select v-model="zbSchedList[scope.$index].schedName" placeholder="请选择" @change="abcd($event,index)">
                    <el-option
                      v-for="ol in el.roomOptions"
                      :key="ol.id"
                      :label="ol.roomName"
                      :value="ol.id"
                    />
                  </el-select>
                </template>
              </el-table-column>
            </el-table> -->
              </div>
            </el-card>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import setTypeApi from '@/api/typesetting'
import baseConfigApi from '@/api/baseConfig'
export default {
  data() {
    var validDate = (rule, value, callback) => {
      if (!this.activityTime[0] || !this.activityTime[1]) {
        return callback(new Error('请选择时间'))
      } else {
        callback()
      }
    }
    return {
      form: {
        pbName: '',
        roomId: '', // 机房id
        zbConfId: '',
        startTime: '',
        endTime: '',
        isAutomatic: '',
        rule: '0',
        cycle: '',
        pbSchedCycleList: []
      },
      reShowList: [],
      validFlag: true, // 验证排班周期表是否可以提交
      activityTime: [],
      ruleOptions: [], // 排版规则下拉框
      groupOptions: [], // 班组列表
      cardList: [], // 卡片内数据
      tableData: [],
      roomOptions: [], // 机房名称options
      dutyOptions: [], // 值班名称options
      orderData: [], // 班次信息
      roomValue: '',
      pbpzId: this.$route.query.id || '',
      rules: {
        pbName: [
          { required: true, message: '请输入排班名称', trigger: 'blur' }
        ],
        roomId: [
          { required: true, message: '请选择机房名称', trigger: 'change' }
        ],
        zbConfId: [
          { required: true, message: '请选择值班配置名称', trigger: 'change' }
        ],
        activityTime: [
          { type: 'date', required: true, validator: validDate, trigger: 'change' }
        ],
        isAutomatic: [
          { required: true, message: '请选择排班方法', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '请输入排班周期', trigger: 'blur' },
          { type: 'number', min: 1, max: 31, message: '周期在1到31天', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getRoomList()
    if (this.pbpzId) {
      this.reShowData()
    }
  },
  methods: {
    // 卡片中下拉框选择班组
    changeBz(val, index, i) {
    },
    // 保存表单List
    onSubmit(formName) {
      var groupIdList = []// 暂存groupId数组
      var groupNameList = []// 暂存班组名称列表
      var schedNameList = []// 暂存班次名称
      var schedIdList = []// 暂存班次id名称
      // var schedGroupIdList = []
      var dayList = []
      for (var i in this.cardList) {
        this.cardList[i].orderData
        for (var j in this.cardList[i].orderData) {
          // if(this.cardList[i].orderData[j].teamInfo.id)
          var id = this.cardList[i].orderData[j].teamInfo.split(',')[1]
          var name = this.cardList[i].orderData[j].teamInfo.split(',')[0]
          this.cardList[i].orderData[j].day = Number(i) + 1
          dayList.push(this.cardList[i].orderData[j].day)
          groupIdList.push(id)
          groupNameList.push(name)
          schedNameList.push(this.cardList[i].orderData[j].schedName)
          schedIdList.push(this.cardList[i].orderData[j].id)
          // schedGroupIdList.push(this.cardList[i].orderData[j].schedGroupId)
        }
      }
      for (var k = 0; k < this.form.pbSchedCycleList.length; k++) {
        this.form.pbSchedCycleList[k].groupId = groupIdList[k]
        this.form.pbSchedCycleList[k].groupName = groupNameList[k]
        this.form.pbSchedCycleList[k].day = dayList[k]
        this.form.pbSchedCycleList[k].schedName = schedNameList[k]
        this.form.pbSchedCycleList[k].schedId = schedIdList[k]
        // this.form.pbSchedCycleList[k].schedGroupId = schedGroupIdList[k]
      }

      // this.form.rule = this.ruleOptions.join('|')
      this.form.rule = '0'
      this.form.startTime = this.activityTime[0]
      this.form.endTime = this.activityTime[1]
      this.validFlag = true
      for (const i in this.form.pbSchedCycleList) {
        if (this.form.pbSchedCycleList[i].groupId) {
          // console.log('i', i)
        } else {
          this.validFlag = false
        }
      }
      this.$refs[formName].validate((valid) => {
        if (this.validFlag) {
          if (valid) {
            setTypeApi.savePbConf(this.form).then(res => {
              this.$router.push({ path: '/workforceManagement/scheduling/list' })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        } else {
          this.$message({
            message: '请在排班周期中选择班组',
            type: 'error'
          })
        }
      })
    },
    // 回显接口
    reShowData() {
      setTypeApi.reShow(this.pbpzId).then(res => {
        this.reShowList = res.data.pbSchedCycleList
        var reShowData = JSON.parse(JSON.stringify(res.data))
        reShowData.isAutomatic = Number(reShowData.isAutomatic)
        if (reShowData.rule) {
          this.ruleOptions = reShowData.rule.split(',')
        }
        this.activityTime.push(reShowData.startTime)
        this.activityTime.push(reShowData.endTime)
        this.form = reShowData
        this.handleChange(reShowData.cycle, '0')
        this.selectJfName(reShowData.roomId)
      })
    },
    // 机房名称下拉框
    getRoomList() {
      setTypeApi.getRoomList().then(res => {
        this.roomOptions = res.data.records
        this.getDutyList()// 值班配置接口（值班名称列表）
      })
    },
    // 值班名称下拉框
    getDutyList() {
      baseConfigApi.getZbList().then(res => {
        this.dutyOptions = res.data.records
        this.handleChange()// 排班卡片内数据
      })
    },
    // 排班周期
    handleChange(current, oldVal) {
      if (current > oldVal) {
        this.addCaed(current - oldVal)
      } else {
        this.removeCard(oldVal - current)
      }
    },
    // 新增卡片
    addCaed(val) {
      for (let i = 0; i < val; i++) {
        this.cardList.push({ 'orderData': '' })
      }
      this.selectZbName()
    },
    // 删除卡片
    removeCard(val) {
      this.cardList.splice(0, val)
      this.selectZbName()
    },
    // 选择值班配置名称
    selectZbName() {
      baseConfigApi.getZbList().then(res => {
        this.resetBz()
        if (this.pbpzId) {
          for (let i = 0; i < this.cardList.length; i++) {
            const array = []
            for (const j in this.reShowList) {
              if (Number(i) + 1 === Number(this.reShowList[j].day) && Number(this.reShowList[j].day)) {
                array.push(this.reShowList[j])
              }
            }
            for (const k in this.cardList[i].orderData) {
              if (array[k]) {
                this.cardList[i].orderData[k].teamInfo = array[k].groupName + ',' + array[k].groupId
              }
            }
          }
        }
      })
    },
    // 清空班组选项
    resetBz() {
      for (const i in this.dutyOptions) {
        if (this.dutyOptions[i].id === this.form.zbConfId) {
          this.orderData = this.dutyOptions[i].zbSchedList
          for (const k in this.orderData) {
            this.$set(this.orderData[k], 'teamInfo', '')
            this.$set(this.orderData[k], 'bzId', '')
            this.$set(this.orderData[k], 'day', '')
          }
          for (const j in this.cardList) {
            this.cardList[j].orderData = JSON.parse(JSON.stringify(this.orderData))
          }
        }
      }
      var flag = 0
      this.form.pbSchedCycleList = []
      for (const m in this.cardList) {
        for (const n in this.cardList[m].orderData) {
          console.log('n', n)
          flag++
          console.log('flag', flag)
          this.form.pbSchedCycleList.push({ 'groupId': '', 'schedName': '', 'groupName': '', 'day': '', 'schedId': '' })
        }
      }
    },
    // 机房下拉框绑定事件
    selectJfName(val) {
      this.form.roomId = val
      this.selectGroupList()
    },
    // 调用班组列表接口
    selectGroupList() {
      const params = {
        roomId: this.form.roomId,
        current: this.current,
        size: this.size
      }
      baseConfigApi.getGroupList(params).then(res => {
        this.groupOptions = res.data.records
        this.resetBz()
      })
    }

  }
}
</script>

<style lang='scss' scoped>
.option-card{
  display:flex;
  flex-wrap:wrap;
  justify-content: flex-start;
}
.box-card{
  margin:10px 20px;
  width:260px;
  tr {
    height: 50px;
    td {
      width:12.5%;
      text-align: center;
      border: 1px #dfe6ec solid;
      padding: 4px;
    }
  }
  table{
    margin: 0 auto;
    border-collapse: collapse;
  }
}
</style>
