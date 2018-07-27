<style lang="scss" scoped>
/deep/.record {
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
      font-size: 14px;
    }
    &_cancel {
      position: absolute;
      top: 0;
      right: 30px;
    }
  }
  &_content {
    &_box{
      max-height: 300px;
      overflow-y: auto;
      border-top: 2px solid #f1f1f1;
    }
    &_list {
      padding: 0;
      margin: 0;
    }
    &_single {
      color: #409eff;
      font-size: 12px;
    }
    &_content {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      margin-top: 10px;
    }
    &_param {
      width: 50%;
      color: #333;
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>
<template>
  <div class="record">
    <!-- 就诊档案 -->
    <el-dialog width="900px" top="5vh" title="就诊档案" :visible.sync="dialogVisible" append-to-body custom-class="daDialog">
      <div class="record_header">
          <h3 class="record_header_name">
              {{baseData.brxm}}
              <span class="record_header_sexAndage">
                  {{baseData.brxb}}/{{baseData.brage}}
              </span>
              <el-tag v-show="baseData.gzTag">
                  {{baseData.GzTag}}
              </el-tag>
          </h3>
          <h4 class="record_header_param">
            出生年月: {{baseData.patientBithday}}
          </h4>
          <h4 class="record_header_param">
            手机号码: {{baseData.mobile}}
          </h4>
          <h4 class="record_header_param">
            联系地址: {{baseData.patientAddress}}
          </h4>
          <el-button v-if="baseData.gzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
          <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
      </div>
      <div class="content" slot>
      <!-- 个人信息 -->
        <!--  就诊时间 -->
        <el-row class="resolveBtn">
          <el-col :span="24" style="text-align:left;color:#000;">
            <!-- swiper -->
            <swiper :options="swiperOption" class="swiperTime" ref="swiper">
              <swiper-slide v-for="(item, index) in swiperDate" :key="index" @click.native="sliderClick(item,index)" :class="{'activeSlider': selectNumber === index}">{{item.mzOrzy==1?'门诊':item.mzOrzy=='2'?'住院':item.mzOrzy==3?'门急/住':''}}<br>{{item.diagnosetime}}</swiper-slide>
              <!-- 按钮 -->
              <div class="swiper-button-prev" slot="button-prev">
                <i class="el-icon-arrow-left" style="margin-top:12px;font-size:20px; color:#ff6800"></i>
              </div>
              <div class="swiper-button-next" slot="button-next">
                <i class="el-icon-arrow-right" style="margin-top:12px;font-size:20px; color:#ff6800;margin-left:5px;"></i>
              </div>
            </swiper>
          </el-col>
        </el-row>
        <!-- 患者就诊信息 -->
        <el-row class="visitRecords" v-loading="patientFileLoading">
          <!-- 住院 -->
          <el-row v-if="zyData.length" v-for="(item,index) in zyData" :key="index">
            <el-row class="bed">
              <el-col :span="12">
                <span style="font-size:20px;color:#333;">住院</span>
                <span class="sfjlTag" @click="sfDialog(item.adminPatientDiagnose.taskId)"
                      v-if="item.visitTaskStatus!='没有随访' && item.visitTaskStatus!='' && showRecordLink"
                >随访记录
              </span>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-row class="bedInfo" >
              <el-col :span="12">
                <span class="colorLight">就诊卡号 &nbsp;:&nbsp;</span>
                 <span class="colorLight1" v-if="item.mzOrZyNum">{{item.mzOrZyNum}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">患者性质 &nbsp;:&nbsp;</span>
                <span class="colorLight1" v-if="item.brxz">{{item.brxz}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">入院时间 &nbsp;:&nbsp;</span>
                <span class="colorLight1" v-if="item.znjqrCyxjList[0]">{{item.znjqrCyxjList[0].admissiontime}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">出院时间 &nbsp;:&nbsp;</span>
                <span class="colorLight1" v-if="item.znjqrCyxjList[0]">{{item.znjqrCyxjList[0].leavetime}}</span>
              </el-col>
              <el-col :span="12">
                <span>科室 &nbsp;:&nbsp;</span>
                <span>{{item.adminDepartment}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">主治医生 &nbsp;:&nbsp;</span>
                <span class="colorLight1">{{item.adminName}}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 0 36px;text-align:left;">
              <el-col :span="24" style="border-bottom: 1px solid #d8f1ff;color:#333;text-indent:10px;font-size: 14px;margin-top:20px;">
                出院小结
              </el-col>
            </el-row>
            <el-row class="leaveHospital">
              <el-collapse v-model="leaveHospital" accordion>
                <el-collapse-item  v-for="(item1,index1) in item.znjqrCyxjList" :title="'出院小结'+index1+1" :name="index1+1+''" :key="index1">
                  <el-col v-if="dischargedMap[discharged]" v-for="(discharged,ind) in Object.keys(item1)" :key="ind" :span="24" class="color666">{{dischargedMap[discharged]}}&nbsp;:&nbsp;{{item1[discharged]}}</el-col>
                  <!-- <el-col :span="5" class="color666">入院诊断&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.admissiondiagnose}}</el-col>
                  <el-col :span="5" class="color666">入院情况&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left"> {{item1.admissiondescription}}</el-col>
                  <el-col :span="5" class="color666">诊治经过&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.cureprocess}}</el-col>
                  <el-col :span="5" class="color666">转归情况&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.filedescription}}</el-col>
                  <el-col :span="5" class="color666">出院诊断&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.leavediagnose}}</el-col>
                  <el-col :span="5" class="color666">出院情况&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.leavedescription}}</el-col>
                  <el-col :span="5" class="color666">出院医嘱&nbsp;:&nbsp;</el-col><el-col :span="19" class="text-left">{{item1.leavedoctorcharge}}</el-col> -->
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </el-row>
          <!-- 门急诊 -->
          <el-row v-if="mzData.length" v-for="(item2,index2) in mzData" :key="index2">
            <el-row class="bed">
              <el-col :span="12">
                <span style="font-size:20px;color:#333;">门诊</span>
                <span class="sfjlTag" @click="sfDialog(item2.adminPatientDiagnose.taskId)"
                      v-if="item2.visitTaskStatus!='没有随访' && item2.visitTaskStatus!='' && showRecordLink"
                >随访记录
              </span>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-row class="bedInfo" >
              <el-col :span="12">
                <span class="colorLight">就诊卡号 &nbsp;:&nbsp;</span>
                <span class="colorLight1" v-if="item2.mzOrZyNum">{{item2.mzOrZyNum}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">患者性质 &nbsp;:&nbsp;</span>
                <span class="colorLight1">{{item2.brxz}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">医生姓名 &nbsp;:&nbsp;</span>
                <span class="colorLight1">{{item2.adminName}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">科室 &nbsp;:&nbsp;</span>
                <span class="colorLight1">{{item2.adminDepartment}}</span>
              </el-col>
              <el-col :span="24">
                <span class="colorLight">疾病诊断 &nbsp;:&nbsp;</span>
                <span class="colorLight1" v-if="item2.znjqrCfxx">{{item2.adminPatientDiagnose.icdName}}</span>
              </el-col>
              <el-col :span="24">
                <span>主诉 &nbsp;:&nbsp;</span>
                <span v-if="item2.zs">{{item2.zs}}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 0 36px;text-align:left;">
              <el-col :span="24" style="border-bottom: 1px solid #d8f1ff;color:#333;text-indent:10px;font-size: 14px;margin-top:20px;">
                处方
              </el-col>
            </el-row>
            <!-- 药品信息 -->
            <el-row class="medchine" v-if="item2.znjqrCfmxList!=''">
              <el-collapse v-model="ypxx" accordion>
                <el-collapse-item v-for="(item3,index3) in item2.znjqrCfmxList" :key="index3+1" :title="'药品名称  : ' +item3.ypmc" :name="index3+1">
                  <el-col :span="12" class="text-left indent30 color666">规格&nbsp;:&nbsp;{{item3.yfgg}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666">药品类型&nbsp;:&nbsp;{{item2.znjqrCfxx.cflx}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 产地&nbsp;:&nbsp;{{item3.ypcd}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 数量&nbsp;:&nbsp;{{item3.yspl}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 单位&nbsp;:&nbsp;{{item3.yfdw}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 剂量&nbsp;:&nbsp;{{item3.ycjl}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 剂量单位&nbsp;:&nbsp;{{item3.jldw}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666">使用天数&nbsp;:&nbsp;{{item3.yyts}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666"> 每日次数&nbsp;:&nbsp;{{item3.mrcs}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666">频次&nbsp;:&nbsp;{{item3.cflx}}</el-col>
                  <el-col :span="12" class="text-left indent30 color666">用法&nbsp;:&nbsp;{{item3.yf}}</el-col>
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </el-row>
          <!-- 无信息的时候 -->
          <el-row v-if="isNull" style="height: 250px;">
            <el-col :span="12" style="height: 250px;line-height:386px;text-align:right;"><img src="../../../assets/HN_DoctorClient/images/animal.png" style="margin-right:20px;" alt=""></el-col>
            <el-col :span="12" style="height: 250px;line-height:350px;text-align:left;"><span>这个病人没有就诊信息哦...</span></el-col>
          </el-row>
        </el-row>
        <!-- div分割线 -->
      </div>
    </el-dialog>

    <!-- 随访记录 -->
    <follow-record
      v-if="showRecordLink"
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskIdRecord"
      v-on:refreshData="refreshListFunc"
      sf-number="0"
      tab-active="0"
      ref="followRecord"></follow-record>
  </div>
</template>

<script>
/**
 * 患者档案
 * @module patientFile
 */
import { PatientFile } from 'HNDC_API/common/patientFile';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import mixin from '@/assets/HN_DoctorClient/js/mixin';
import followRecord from 'HNDC/common/followRecord';
export default {
  data() {
    return {
      // 药物字典
      medicineMap:{
        yfgg:'规格',
        ypcd:'产地',
        yspl:'数量',
        yfdw:'单位',
        ycjl:'剂量',
        jldw:'剂量单位',
        yyts:'使用天数',
        mrcs:'每日次数',
        cflx:'频次',
        yf:'用法'
      },
      //出院小结字典
      dischargedMap:{
        admissiondiagnose:'入院诊断',
        admissiondescription:'入院情况',
        cureprocess:'诊治经过',
        filedescription:'转归情况',
        leavediagnose:'出院诊断',
        leavedescription:'出院情况',
        leavedoctorcharge:'出院医嘱'
      },
      userId: '', // 从localStorage获取登录页的医生id
      leaveHospital: '', // 出院小结手风情默认展示索引
      isNull: false, // 病人的住院、门诊信息都为空时true
      ypxx: '1', // 患者档案--门诊处方信息
      baseData: {}, // 患者基本信息
      isCare: '', // 点击记录后，查看病人是否被关注
      patientFileLoading: false, // 患者档案 加载动画
      zyData: [], // 患者档案-住院信息
      mzData: [], // 患者档案-门诊信息,
      dialogVisible: false, // 患者档案弹框是否显示
      selectNumber: null, // 患者档案-选中的就诊时间的index
      taskIdRecord: '', // 传给随访记录的taskid
      swiperDate: [], // 患者档案-就诊时间的数据
      swiperOption: {// swiper组件的配置参数
        slidesPerView: 4,
        spaceBetween: 30,
        slidesPerGroup: 4,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    };
  },
  props: ['patientId', 'visitOrderId', 'showRecordLink', 'taskId', 'sfNumber'],
  // 含getPatientInfo,handleislike两个方法
  mixins: [mixin],
  components: {
    swiper,
    swiperSlide,
    followRecord
  },
  methods: {
    /**
     * @description 触发父组件刷新列表，供子组件-随访记录用
     * @function  refreshListFunc
     */
    refreshListFunc() {
      this.$emit('refreshData');
      this.baseData=this.getPatientInfo();
    },
    // 有 随访记录 按钮时调用
    sfDialog(taskId) {
      this.taskIdRecord = taskId;
      setTimeout(() => {
        this.$refs.followRecord.toggleShowModal();
      }, 0);
      // this.dialogWay = true;
      // this.targetTab = [];
      // this.modelData = [];
      // this.getWayResult(1); //判断是否被处理
    },
    /**
       * 切换患者档案弹框的显示
       * @function toggleShowModal
       */
    toggleShowModal() {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        // 解决偶现的patientId为空的情况
        if (this.patientId) {
          this.getPtTime();
          this.getPatientInfo();
        } else {
          console.log('再次获取--patientId为空时');
          setTimeout(() => {
            this.getPtTime();
            this.getPatientInfo();
          }, 0);
        }
      }
    },
    /*
     *点击就诊时间
     */
    sliderClick(item, index) {
      this.zyData = [];
      this.mzData = [];
      this.selectNumber = index;
      this.currentPartientInfo(item.diagnosetime);
    },
    /*
      *请求当前时间的患者信息
      */
    currentPartientInfo(item) {
      this.isNull = false;
      this.patientFileLoading = true;
      this.mzData = [];
      this.zyData = [];
      PatientFile.getRecordByDate({
        'adminId': this.userId,
        'patientId': this.patientId,
        'date': item
      }).then((res) => {
        this.patientFileLoading = false;
        if (res.code === 0) {
          res.data.forEach((item) => {
            if (item.mzOrZy === 'zy') {
              this.zyData.push(item);
            } else if (item.mzOrZy === 'mz') {
              this.mzData.push(item);
            }
          });
          // 当住院&&门诊都为空时，显示宠物
          if (!this.zyData.length && !this.mzData.length) {
            this.isNull = true;
          }
        }
      }).catch((error) => {
        console.log(error);
        // this.patientFileLoading = false;
      });
    },
    /**
       * 请求患者随访时间
       */
    getPtTime() {
      this.swiperDate = [];
      PatientFile.getRecordDate({
        'adminId': this.userId,
        'patientId': this.patientId
      }).then((res) => {
        if (res.code === 0) {
          this.swiperDate = res.data;
          this.zyData = [];
          this.mzData = [];
          this.selectNumber = 0;
          if (res.data.length) {
            this.patientFileLoading = true;
            this.currentPartientInfo(res.data[0].diagnosetime);
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  }
};
</script>


