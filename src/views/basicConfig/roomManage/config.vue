<template>
  <div class="app-container">
    <div class="title-content">班组配置</div>
    <div class="main-content">
      <label>人员分组</label>
      <el-button size="mini" type="primary" @click="dialogVisible = true">新增分组</el-button>
      <div class="main-content-table">
        <el-table :data="list">
          <el-table-column type="index" label="索引" width="50" />
          <el-table-column align="center" prop="name" label="班组名称" />
          <el-table-column align="center" prop="leadName" label="组长" />
          <el-table-column align="center" label="组员列表">
            <template slot-scope="scope">
              <span v-for="item in scope.row.zbUserList" :key="item.id">
                {{ item.realname }}
              </span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200px">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="提示" center :visible.sync="dialogVisible" width="600px">
      <div>
        <el-form ref="form" :rules="rules" :model="form">
          <el-form-item label="班组名称:" prop="name">
            <el-input v-model="form.name" placeholder="请输入班组名称" />
          </el-form-item>
        </el-form>
        <div class="drag-content">
          <div class="drag-content-left">
            <h3>可选人员<small>（左右拖动选择组员）</small></h3>
            <!-- <el-input :clearable='true' v-model="input" placeholder="请输入内容"></el-input> -->
            <draggable class="list-group" :list="allPersonList" group="people" @change="log">
              <div v-for="element in allPersonList" :key="element.id" class="list-group-item">
                {{ element.realname }}
              </div>
            </draggable>
          </div>
          <div class="drag-content-right">
            <h3>已选人员<small>（上下拖动选择组长）</small></h3>
            <draggable class="list-group" :list="checkedPersonList" group="people" @change="log">
              <div v-for="(element,index) in checkedPersonList" :key="element.id" class="list-group-item">
                {{ element.realname }} <span v-if="index === 0">（组长）</span>
              </div>
            </draggable>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCheckedPerson">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import draggable from './vuedraggable'
import baseConfigApi from '@/api/baseConfig'
export default {
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  data() {
    return {
      form: {
        name: ''
      },
      roomId: this.$route.query.id || '',
      current: 1,
      size: 10,
      name: '',
      tableData: [{ name: '123', phone: 10086, team: '联通' }, {}, {}],
      dialogVisible: false,
      input: '',
      rules: {
        name: [
          { required: true, message: '请输入班组名称', trigger: 'blur' }
        ]
      },
      list: [],
      allPersonList: [], // 可选人员列表
      checkedPersonList: [] // 选中的人员列表
    }
  },
  watch: {
    input: {
      handler(newV, oldV) {
        if (newV) {
          this.allPersonList = this.allPersonList.filter((item, index) => {
            return item.name.includes(newV)
          })
        } else {
          this.getData()
        }
      }
    }
  },
  mounted() {
    this.getAllPersonList()
    this.fetchList()
  },
  methods: {
    // 获取列表数据
    fetchList() {
      const params = {
        roomId: this.roomId,
        current: this.current,
        size: this.size
      }
      baseConfigApi.getGroupList(params).then(res => {
        this.list = res.data.records
      })
    },
    // 获取可选人员列表
    getAllPersonList() {
      baseConfigApi.getZbUser({ roomId: this.roomId }).then(res => {
        this.allPersonList = res.data
      })
    },
    // 提交选中的人员
    submitCheckedPerson() {
      if (this.checkedPersonList.length) {
        const params = {
          name: this.form.name,
          teamLead: this.checkedPersonList[0].username,
          leadName: this.checkedPersonList[0].realname,
          userList: this.checkedPersonList,
          roomId: this.roomId
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            baseConfigApi.saveGroup(params).then(res => {
              this.$message.success(res.message)
              this.dialogVisible = false
              this.fetchList()
              this.getAllPersonList()
              this.checkedPersonList = []
              this.form.name = ''
            })
          } else {
            return false
          }
        })
      } else {
        this.$message.warning('请选择人员')
      }
    },
    // 删除
    handleDelete(row) {
      baseConfigApi.delGroup({ groupId: row.id }).then(res => {
        this.$message.success(res.message)
        this.fetchList()
        this.getAllPersonList()
      })
    }
  }

}
</script>

<style lang='scss' scoped>
.app-container{
  margin: 0 auto;
  // width:700px;
  .drag-content{
    display:flex;
    justify-content: space-around;
  }
  .list-group{
    padding: 2px;
    border:1px solid #000;
    width: 200px;
    height: 300px;
    overflow:auto;
    background: #FFF;
    &-item{
      padding:5px;
      // border:1px solid black;
      height:30px;
      text-align: left;
      line-height: 30px;
      // background-color:#EBEEF5;
      color: red;
    }
  }
}
</style>
