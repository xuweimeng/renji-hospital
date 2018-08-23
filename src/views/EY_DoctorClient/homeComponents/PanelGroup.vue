<template>
  <el-row class="panel-group" :gutter="10">
    <el-col :xs="24" :sm="24" :md="24" :lg="8" class="card-panel-col">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">您好{{info.realname}},已等待您{{info.laterhours}}小时</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="4" class="card-panel-col">
      <div class="card-panel card-panel-link">
        <router-link to="/FollowPlan/FollowPlanList">
          <div class="card-panel-icon-wrapper icon-edit">
            <svg-icon icon-class="form" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">随访计划待审核</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="info.needShCount" :duration="2000"></count-to>
          </div>
        </router-link>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="4" class="card-panel-col">
      <div class="card-panel card-panel-link">
        <router-link to="/FollowRecord/FollowRecordList">
          <div class="card-panel-icon-wrapper icon-shoppingCard">
            <svg-icon icon-class="edit" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">随访记录待处理</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="info.needClCount" :duration="2000"></count-to>
          </div>
        </router-link>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">总患者数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="info.hadVisitPeopleCount" :duration="2000"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :md="12" :lg="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="user" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已随访人次</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="info.hadVisitCount" :duration="2000"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to';

export default {
  components: {
    CountTo
  },
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 15px;
  }
  .card-panel-link{
    cursor: pointer;
  }
  .card-panel {
    height: 108px;
    /*cursor: pointer;*/
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
      .icon-edit{
        background: #6cadc8;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .icon-edit{
      color: #6cadc8;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      width: calc(100% - 95px);
      box-sizing: border-box;
      padding: 26px 10px 26px 0;
      .card-panel-text {
        line-height: 18px;
        color: #666;
        font-size: 14px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
