<template>
  <div class="sfjhDialog">
    <!-- 随访计划 -->
    <el-dialog title="随访方案" :visible.sync="dialogVisible" width="600px" top="30px" :center = "false" custom-class="sfjhDialog">
      <div class="content" slot>
        <!-- 个人信息 -->
        <el-row class="personInfo">
          <el-col :span="12" class="elCol1"><span class="personName colororigen">{{patientRecord.brxm}}</span><span class="personSex colororigen">{{patientRecord.brxb}} / {{patientRecord.brage}}</span> <span class="personXg">{{patientRecord.GzTag}}</span></el-col>
          <el-col :span="12" class="elCol2">
            <el-button type="text" @click="handleislike" v-bind:class="{ careColor: isCare}">
              <i class="iconfont" v-bind:class="{ careColor: isCare}" style="margin-right:5px; font-size:12px;">&#xe604;</i>
              {{isCare?'取消关心':'特别关心'}}
            </el-button>
          </el-col>
        </el-row>
        <el-row class="personResult">
          <el-col :span="24" class="elCol3">
            <span class="elCol3Span1">诊断名称&nbsp;:&nbsp;</span>
            <span class="elCol3Span2">{{patientRecord.icdName}}</span>
          </el-col>
        </el-row>
        <el-row class="personResult">
          <el-col :span="24" class="elCol3">
            <span class="elCol3Span1">手机号码&nbsp;:&nbsp;</span>
            <span class="elCol3Span2">{{patientRecord.mobile}}</span>
          </el-col>
        </el-row>
        <el-row class="personResult">
          <el-col :span="24" class="elCol3">
            <span class="elCol3Span1">就诊时间&nbsp;:&nbsp;</span>
            <span class="elCol3Span2">{{patientRecord.diagnoseTime}}</span>
          </el-col>
        </el-row>
      </div>
      <!-- 随访计划列表 -->
      <div class="content2">
        <el-row>
          <el-col :span="24" class="colLabel">随访方案&nbsp;:&nbsp;<span style="color: #ff6e40;">{{modelFollplanData.questionTempleName}}</span></el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="colLabel">随访次数&nbsp;:&nbsp;<span>共{{modelFollplanData.allCount || 0}}次</span></el-col>
        </el-row>
        <el-row v-for="(item,index) in modelFollplanData.orderList" :key="index" style="margin-bottom: 20px;">
          <el-row>
            <el-col :span="24" class="colLabel">
              第{{item.index}}次随访&nbsp;:&nbsp;<span style="color:#333;">开始时间&nbsp;:&nbsp;{{item.dateBegin}}</span>&nbsp;{{item.status}}
            </el-col>
          </el-row>
          <el-row style="padding-left: 42px;">
            <el-col :span="5" v-for="(item1,index1) in item.CollectionIndex" :key="index1" style="color:#209eff;">{{item1}}</el-col>
          </el-row>
        </el-row>
      </div>
      <!-- 审核 -->
      <div class="content3">
        <el-row style="height:47px;margin-top:14px;">
          <el-col :span="12" v-if="this.tabActive ==0">
            <el-button type="button" @click="modelOut">未通过</el-button>
          </el-col>
          <el-col :span="12" v-if="this.tabActive ==0">
            <el-button type="button" @click="modelPass">通过</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="text-align:center;" v-if="this.tabActive ==0">
            <p style="font-size:12px;">{{timeTip}}</p>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 随访计划
 * @module followPlan
 */
import { CommonAPI } from '@/api/HN_DoctorClient/common';
import mixin from '@/assets/HN_DoctorClient/js/mixin';
export default {
  data() {
    return {
      userId: '', // 从localStorage获取登录页的医生id
      modelFollplanData: [], // 随访计划data
      loading: false, // 加载动画
      dialogVisible: false, // 弹框是否显示
      timeTip: '', // 倒计时提示
      interObj: {}, // 倒计时对象，全局清除倒计时
      patientRecord: {}, // 患者基本信息
      isCare: ''// 点击记录后，查看病人是否被关注
    };
  },
  props: ['patientId', 'visitOrderId', 'taskId', 'tabActive'],
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
        // 解决偶现的patientId为空的情况
        if (this.patientId) {
          this.getPtWay(this.taskId);
          this.getPatientInfo();
        } else {
          setTimeout(() => {
            this.getPtWay(this.taskId);
            this.getPatientInfo();
          }, 0);
        }
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
      this.modelFollplanData = {};
      CommonAPI.getVisitOrderDetail({
        'taskId': this.taskId
      }).then((res) => {
        if (res.code === 0) {
          res.data.orderList.forEach((item) => {
            item.CollectionIndex = item.CollectionIndex.split(',');
            const statusMap = ['等待随访', '随访中', '已随访', '停止', '配置错误'];
            item.status = statusMap[item.status];
          });
          this.modelFollplanData = res.data;
        } else {
          this.modelFollplanData = {};
        }
        if (!this.tabActive || this.tabActive != 0) {
          return false;
        }
        const time3 = 24 * 60 * 60 * 1000;
        const startTime = res.data.startDate;// 开始时间
        const endTime = res.currentTime;// 当前时间
        const startDate1 = Date.parse(new Date(startTime)) + time3;
        const startDate2 = Date.parse(new Date(endTime));
        const timeNumber = Number(startDate1) - Number(startDate2);
        if (timeNumber > 0) {
          this.interObj['timer1'] = setInterval(function() {
            timer(timeNumber);
          }, 1000);
          const _this = this;
          function timer(timeNumber) {
            const dd = parseInt(timeNumber / 1000 / 60 / 60 / 24);// 计算剩余的天数
            const hh = parseInt(timeNumber / 1000 / 60 / 60 % 24);// 计算剩余的小时数
            const mm = parseInt(timeNumber / 1000 / 60 % 60);// 计算剩余的分钟数
            const tt = dd + '天' + hh + '时' + mm + '分后默认通过';
            _this.timeTip = tt;
          }
        } else {
          clearInterval(this.interObj['timer1']);
        }
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
<style lang="scss">
  @import '../../../styles/HN_DoctorClient/base';
</style>

