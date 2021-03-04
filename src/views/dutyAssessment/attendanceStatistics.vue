<template>
  <div class="app-container">
    <h3 style="text-align:center">值班考勤统计</h3>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="特殊资源">
        <el-radio-group v-model="formInline.region">
          <el-radio label="按月" />
          <el-radio label="按年" />

        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="formInline.region==='按月'" label="值班起始时间">
        <el-date-picker
          v-model="formInline.value1"
          type="monthrange"
          range-separator="至"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
        />
      </el-form-item>
      <el-form-item v-show="formInline.region==='按年'" label="值班起始时间">
        <el-date-picker
          v-model="formInline.value2"
          style="width:120px"
          placeholder="开始年份"
          type="year"
        />至
        <el-date-picker
          v-model="formInline.value3"
          style="width:120px"
          placeholder="结束年份"
          type="year"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-checkbox-group v-model="formThead">
        <el-checkbox label="apple">
          apple
        </el-checkbox>
        <el-checkbox label="banana">
          banana
        </el-checkbox>
        <el-checkbox label="orange">
          orange
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table :data="tableData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="name" label="机房名称" width="180" />
      <el-table-column v-for="fruit in formThead" :key="fruit">
        <template slot="header">
          {{ fruit }}迟到人数
        </template>
        <template slot-scope="scope">
          {{ scope.row[fruit] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formInline: {
        region: '按月',
        value1: '',
        value2: '',
        value3: ''
      },
      tableData: [
        {
          name: '机房1',
          apple: 'apple-10',
          banana: 'banana-10',
          orange: 'orange-10'
        },
        {
          name: '机房2',
          apple: 'apple-20',
          banana: 'banana-20',
          orange: 'orange-20'
        }
      ],
      formThead: ['apple', 'banana']
    }
  },
  methods: {
    onSubmit() {

    }
  }
}
</script>

<style>

</style>
