<style lang="scss" scoped>
  /deep/.record {
    &_dialog{
      .el-dialog__body{
        padding-top: 10px;
        border-top: 1px solid #dadada;
      }
    }
    &_box {
      .el-dialog__body {
        padding-top: 0;
      }
    }
    &_header {
      position: relative;
      &_name {
        margin: 5px 0;
        color: #409eff;
        font-size: 20px;
        font-weight: 400;
        margin-bottom: 15px;
      }
      &_sexAndage {
        font-size: 12px;
        color: #666;
        margin: 0 20px;
      }
      &_param {
        margin: 10px 0;
        font-weight: 400;
        color: #f80;
        font-size: 13px;
        line-height: 20px;
      }
      &_cancel {
        position: absolute;
        top: 0;
        right: 30px;
      }
    }
    &_content{
      border-top: 5px solid #f1f1f1;
      margin-top: 10px;
      padding-top: 10px;
      >h4{
        color: #333;
        font-weight: 400;
        margin: 5px 0;
      }
      &_list{
        border-top: 1px solid #dedede;
        margin-top: 15px;
        max-height: 50vh;
        overflow-y: auto;
        >h4{
          color: #f80;
          margin: 10px 0;
          font-weight: 400;
          font-size: 16px;
          >span{
            font-size: 12px;
            margin: 0 10px;
          }
        }
        >span{
          margin: 0 15px 10px 0;
        }
      }
    }
    &_footer{
      margin-top: 20px;
      text-align: center;
      .el-button{
        margin-top: 10px;
      }
    }
  }
</style>
<template>
  <div class="record">
    <!-- 随访计划 -->
    <el-dialog title="随访计划详情" :visible.sync="dialogVisible" width="900px" top="5vh" class="record_dialog">
      <div class="record_header">
        <h3 class="record_header_name">
          {{baseData.brxm}}
          <span class="record_header_sexAndage">
            {{baseData.brxb}}/{{baseData.brage}}
          </span>
          <el-tag v-if="baseData.GzTag">
            {{baseData.GzTag}}
          </el-tag>
        </h3>
        <h4 class="record_header_param">
          诊断名称: {{baseData.icdName}}
        </h4>
        <h4 class="record_header_param">
          手机号码: {{baseData.mobile}}
        </h4>
        <h4 class="record_header_param">
          就诊时间: {{baseData.diagnoseTime}}
        </h4>
        <el-button v-if="baseData.GzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
        <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
      </div>

      <div class="record_content" v-show="modelFollplanData.orderList.length>0">
        <h4>随访方案 : {{modelFollplanData.questionTempleName}} </h4>
        <h4>随访次数 : 共{{modelFollplanData.allCount}}次</h4>
        <div class="record_content_list">
          <template v-for="(item,index) in modelFollplanData.orderList">
            <h4>第{{index+1}}次随访:
              <span>开始时间 :{{item.dateBegin}}</span>
              <el-tag type="warning">{{item.statusStr}}</el-tag>
            </h4>
            <template v-for="(ite,ins) in item.CollectionIndex" v-show="ite" >
              <el-tag v-if="ite" :key="index+'_'+ins" type="primary">{{ite}}</el-tag>
            </template>
          </template>
        </div>
      </div>
      <!-- 审核 -->
      <div class="record_footer" v-if="tabActive == 0">
        <!--<div class="el-alert el-alert&#45;&#45;info" v-show="timeTip">提示：{{timeTip}}</div>-->
        <el-button type="primary" @click="modelOut">未通过</el-button>
        <el-button type="primary" @click="modelPass">通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 随访计划
 * @module followPlan
 */
import { CommonAPI } from 'HNDC_API/common';
import mixin from '@/assets/HN_DoctorClient/js/mixin';
// let timerInterval = null;
// function getAutoPassTime(startTime, databaseCurrentTime) {
//   const oneDayMilliSeconds = 24 * 60 * 60 * 1000;
//   const shouldStartTime = Date.parse(new Date(startTime)) + oneDayMilliSeconds; // 开始时间
//   const currentTime = databaseCurrentTime ? Date.parse(new Date(databaseCurrentTime)) : Date.parse(new Date()); // 当前时间
//   const timeNumber = Number(shouldStartTime) - Number(currentTime);
//   if (timeNumber > 0) {
//     const dd = parseInt(timeNumber / 1000 / 60 / 60 / 24);// 计算剩余的天数
//     const hh = parseInt(timeNumber / 1000 / 60 / 60 % 24);// 计算剩余的小时数
//     const mm = parseInt(timeNumber / 1000 / 60 % 60);// 计算剩余的分钟数
//     return `${dd}天${hh}时${mm}分后默认通过`;
//   } else {
//     clearInterval(timerInterval);
//     return '';
//   }
// }
export default {
  data() {
    return {
      modelFollplanData: { orderList: [] }, // 随访计划data
      loading: false, // 加载动画
      dialogVisible: false, // 弹框是否显示
      // timeTip: '', // 倒计时提示
      baseData: {} // 患者基本信息
    };
  },
  props: ['patientId', 'taskId', 'tabActive'],
  // 含getPatientInfo,handleislike两个方法
  mixins: [mixin],
  methods: {
    /**
       * 切换随访计划弹框的显示
       * @function toggleShowModal
       */
    toggleShowModal() {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.getPtWay(this.taskId);
          this.getPatientInfo().then(res => {
            this.baseData = res.data;
          });
        });
      }
    },
    /**
       * 关闭随访计划弹框
       * @function toggleShowModal
       */
    closeDialog() {
      this.dialogVisible = false;
    },
    /**
       * 获取病人随访方案
       * @function getPtWay
       * @param {String} taskId taskId
       */
    getPtWay() {
      this.modelFollplanData = { orderList: [] };
      CommonAPI.getVisitOrderDetail({
        'taskId': this.taskId
      }).then((res) => {
        if (res.code === 0) {
          res.data.orderList.forEach((item) => {
            item.CollectionIndex = item.CollectionIndex.split(',');
          });
          this.modelFollplanData = res.data;
        } else {
          this.modelFollplanData = { orderList: [] };
        }
        // 默认通过倒计时--去掉
        // if (this.tabActive === '0') {
        //   const startTime = res.data.startDate;// 开始时间
        //   this.timeTip = getAutoPassTime(startTime, res.currentTime);
        //   if (!this.timeTip) {
        //     return false;
        //   }
        //   timerInterval = setInterval(() => {
        //     this.timeTip = getAutoPassTime(startTime);
        //   }, 60000);
        // }
      }).catch((error) => {
        console.log(error);
      });
    },
    /**
       * 点击 不通过 按钮
       * @function modelOut
       */
    modelOut() {
      this.$emit('nopassBtn');
    },
    /**
       * 点击 通过 按钮
       * @function modelPass
       */
    modelPass() {
      this.$emit('passBtn');
    }
  }
};
</script>

