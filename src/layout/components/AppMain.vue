<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
$navbar-height: 50px;
$headline-height: 100px;
$tags-height: 34px;
.app-main {
  /* 50= navbar  50  */
  top:calc( #{$navbar-height} + #{$headline-height});
  min-height: calc(100vh - #{$navbar-height} - #{$headline-height});
  padding: 0 40px;
  margin: 0px auto;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #F2F2F2;
}

// .fixed-header+.app-main {
//   padding-top: 50px;
// }

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
