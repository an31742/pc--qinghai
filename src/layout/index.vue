<template>
  <div class="app-content">
    <div class="app-headline" :class="{'mobile-headline': device==='mobile'}">
      <img src="~@/assets/images/logo.png" class="logo" alt="logo">
      <div class="title">中国联通值班管理系统-青海</div>
      <div v-if="device!=='mobile'" class="right-menu">
        <div class="right-menu-item">欢迎您，{{ name }}</div>
        <!-- <div class="right-menu-item">1234456</div> -->
      </div>
    </div>
    <div :class="classObj" class="app-wrapper">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <sidebar class="sidebar-container" />
      <div :class="{hasTagsView:needTagsView}" class="main-container">
        <div :class="{'fixed-header':fixedHeader}">
          <navbar />
          <tags-view v-if="needTagsView" />
        </div>
        <app-main />
      <!-- <right-panel v-if="showSettings">
        <settings />
      </right-panel> -->
      </div>
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader,
      name: state => state.user.name
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
  $headlineHeight:100px;
.app-content {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  .app-headline {
     position: fixed;
    height: $headlineHeight;
    width: 100%;
    padding: 0 20px;
    background: url("~@/assets/images/headline-bg.png") repeat;
    background-size: contain;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.05);
    z-index: 1000;
    .logo {
       height: 60px;
      margin-top: 20px;
      float: left;

    }
    .title {
      margin: 20px 0 0 -300px;
      font-weight: bold;
      float: left;
      color: #FFF;
      height: 60px;
      line-height: 60px;
      font-size: 24px;
    }

  }
  .app-wrapper {
    @include clearfix;
    flex: 1;
    position: relative;
    // height: 100%;
    // width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

}
 .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: $headlineHeight;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .right-menu {
    float: right;
    color: #fff;
    .right-menu-item {
      line-height: 100px;
    }
  }
</style>
