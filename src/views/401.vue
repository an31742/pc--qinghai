<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>你没有权限去该页面</h2>
        <h6>如有不满请联系管理员 <a :href="'mailto:' + admin">{{ admin.name }}</a></h6>
        <p class="list-unstyled">或者你可以
          <router-link to="/">
            <el-button type="primary" icon="arrow-left">回到首页</el-button>
          </router-link>
        </p>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      // admin: this.$store.getters.admin
      admin: 'guanliyuan'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  a {
    color: #e1212a;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .list-unstyled {
    font-size: 14px;
    padding-bottom: 5px;
  }
}
</style>
