<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  };
</script>
<style lang="scss">
  @font-face {
    font-family: 'iconfont';
    src: url('./static/iconfont/iconfont.eot');
    src: url('./static/iconfont/iconfont.eot?#iefix') format('embedded-opentype'),
    url('./static/iconfont/iconfont.woff') format('woff'),
    url('./static/iconfont/iconfont.ttf') format('truetype'),
    url('./static/iconfont/iconfont.svg#iconfont') format('svg');
  }
  .iconfont {
    font-family:"iconfont" !important;
    font-size:16px;
    font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
  }
  // 仁济项目下拉框全局取消margin-bottom
  .el-popper {
    .el-scrollbar__wrap {
      margin-bottom: 0!important;
    }
    .el-scrollbar__wrap {
      overflow: hidden;
    }
  }
</style>
