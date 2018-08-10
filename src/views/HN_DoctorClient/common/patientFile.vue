<style lang="scss" scoped>
/deep/.record {
  &_dialog{
    .el-dialog__body{
      padding-top: 10px;
      border-top: 1px solid #dadada;
    }
    .el-tabs__item{
      height: auto;
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
  &_table{
    .el-tabs__item{
      height: auto;
    }
    &_name{
      margin: 0;
      text-align: center;
      line-height: 20px;
      padding: 5px 0;
      box-sizing: border-box;
      font-size: 13px;
      >span{
        display: block;
      }
    }
  }
  &_content {
    &_name{
      font-size: 16px;
      color: #409eff;
      margin-bottom: 5px;
      font-weight: 400;
      margin-top: 15px;
    }
    &_name:first-child{
      margin-top: 0;
    }
    &_link{
      display: inline-block;
      color: #666;
      margin: 0 0 0 40px;
      vertical-align: bottom;
      cursor: pointer;
      font-weight: 400;
      line-height: 18px;
      padding: 0 5px;
      background: #409eff;
      color: #fff;
      border-radius: 3px;
    }
    &_msg{
      font-size: 16px;
      color: #409eff;
      margin-bottom: 5px;
      font-weight: 400;
      margin-top: 10px;
    }
    &_box {
      max-height: 300px;
      overflow-y: auto;
      border-top: 2px solid #f1f1f1;
    }
    &_list {
      padding: 0;
      margin: 0;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
    &_single {
      color: #409eff;
      font-size: 12px;
      width: 50%;
      margin-bottom: 5px;
      color: #f80
    }
    &_text{
      color: #555;
    }
    &_content {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      margin-top: 10px;
      padding-left: 0;
      >h6{
        width: 100%;
        margin: 5px;
        color: #409eff;
      }
    }
    &_step{
      margin-top: 15px;
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
    <el-dialog class="record_dialog"  width="900px" top="5vh" title="就诊档案" :visible.sync="dialogVisible" append-to-body >
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
            出生年月: {{baseData.patientBithday}}
          </h4>
          <h4 class="record_header_param">
            手机号码: {{baseData.mobile}}
          </h4>
          <h4 class="record_header_param">
            联系地址: {{baseData.patientAddress}}
          </h4>
          <el-button v-if="baseData.GzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
          <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
      </div>
      <el-tabs @tab-click="currentPartientInfo" v-model="currentTable"  type="border-card" v-if="timeList[0]">
          <el-tab-pane  v-for="(itemMain,index) in timeList" :key="index" :name="itemMain.diagnosetime" >
                <h6 class="record_table_name" slot="label"><span>{{itemMain.mzOrzy=='1'?'门诊':'住院'}}</span> {{itemMain.diagnosetime}}</h6>
            <template v-for="(item,index) in itemMain">
              <!--mzOrZy字段不对，有时会是空的-->
              <!--<template v-if="item.mzOrZy!='mz' && item.adminPatientDiagnose">-->
              <template v-if="itemMain.mzOrzy != '1' && item.adminPatientDiagnose">
                <h5 class="record_content_name">就诊信息
                  <h6 class="record_content_link" v-if="itemMain.isHasVisit=='1' && item.adminPatientDiagnose.taskId && showRecordLink && item.visitTaskStatus!='没有随访' && item.visitTaskStatus!=''"
                      @click="sfDialog(item.adminPatientDiagnose.taskId)">查看随访记录</h6>
                </h5>
                <!-- 有随访记录展示随访记录 -->
                <ul class="record_content_list">
                  <li  class="record_content_single">
                    就诊卡号:{{item.mzOrZyNum}}
                  </li>
                  <li  class="record_content_single">
                    患者性质:{{item.brxz}}
                  </li>
                  <li class="record_content_single">
                    入院时间:{{item.znjqrCyxjList[0].admissiontime}}
                  </li>
                  <li class="record_content_single">
                    出院时间:{{item.znjqrCyxjList[0].leavetime}}
                  </li>
                  <li class="record_content_single">
                    科室:{{item.adminDepartment}}
                  </li>
                  <li class="record_content_single">
                    主治医生:{{item.adminName}}
                  </li>
                </ul>
                <h5 class="record_content_msg">出院小结</h5>
                <div class="record_content_box">
                  <el-steps class="record_content_step" v-if="item.znjqrCyxjList.length>0" direction="vertical" :active="item.znjqrCyxjList.length">
                    <el-step v-for="ite in item.znjqrCyxjList"  :key="ite.id" :title="ite.admissiontime">
                      <div slot="description">
                        <p class="record_content_text" v-for="discharged in Object.keys(dischargedMap)"  :key="discharged">
                          <el-tag type="warning">
                            {{dischargedMap[discharged]}}
                          </el-tag>
                          {{ite[discharged]}}
                        </p>
                      </div>
                    </el-step>
                  </el-steps>
                </div>
              </template>
              <!--<template v-if="item.mzOrZy!='zy' && item.adminPatientDiagnose">-->
              <template v-if="itemMain.mzOrzy == '1' && item.adminPatientDiagnose">
                <h5 class="record_content_name">就诊信息
                  <h6 class="record_content_link"
                      v-if="itemMain.isHasVisit=='1' && item.adminPatientDiagnose.taskId && showRecordLink && item.visitTaskStatus!='没有随访' && item.visitTaskStatus!=''"
                      @click="sfDialog(item.adminPatientDiagnose.taskId)">查看随访记录</h6>
                </h5>
                <!-- 有随访记录展示随访记录 -->

                <ul class="record_content_list">
                  <li  class="record_content_single">
                    就诊卡号:{{item.mzOrZyNum}}
                  </li>
                  <li  class="record_content_single">
                    患者性质:{{item.brxz}}
                  </li>
                  <li class="record_content_single">
                    医生姓名:{{item.adminName}}
                  </li>
                  <li class="record_content_single">
                    科室:{{item.adminDepartment}}
                  </li>
                  <li class="record_content_single">
                    疾病诊断:{{item.adminPatientDiagnose.icdName}}
                  </li>
                  <li class="record_content_single">
                    主诉:{{item.zs}}
                  </li>
                </ul>
                <h5 class="record_content_msg">处方信息</h5>
                <div class="record_content_box">
                  <ul class="record_content_content" v-for="(ite,inde) in item.znjqrCfmxList" :key="inde">
                    <h6>药品名称:{{ite.ypmc}}</h6>
                    <li class="record_content_param" v-for="(it,ind) in Object.keys(medicineMap)" :key="ind">
                      <el-tag type="warning">
                        {{medicineMap[it]}}
                      </el-tag>
                      {{ite[it]}}
                    </li>
                  </ul>
                </div>
              </template>
            </template>
          </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 随访记录 -->
    <follow-record
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskIdRecord"
      v-on:refreshData="refreshListFunc"
      sf-number="1"
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
import mixin from '@/assets/HN_DoctorClient/js/mixin';
import followRecord from 'HNDC/common/followRecord';
export default {
  data() {
    return {
      currentTable: '',
      // 药物字典
      medicineMap: {
        yfgg: '规格',
        ypcd: '产地',
        yspl: '数量',
        yfdw: '单位',
        ycjl: '剂量',
        jldw: '剂量单位',
        yyts: '使用天数',
        mrcs: '每日次数',
        cflx: '频次',
        yf: '用法'
      },
      // 出院小结字典
      dischargedMap: {
        admissiondiagnose: '入院诊断',
        admissiondescription: '入院情况',
        cureprocess: '诊治经过',
        filedescription: '转归情况',
        leavediagnose: '出院诊断',
        leavedescription: '出院情况',
        leavedoctorcharge: '出院医嘱'
      },
      timeList: [{
        znjqrCyxjList: [{

        }],
        znjqrCfxx: {},
        adminPatientDiagnose: {}
      }],
      baseData: {}, // 患者基本信息
      dialogVisible: false, // 患者档案弹框是否显示
      taskIdRecord: '' // 传给随访记录的taskid
    };
  },
  props: {
    patientId: {
      type: String,
      default: null
    },
    visitOrderId: {
      type: String,
      default: null
    },
    taskId: {
      type: String,
      default: null
    },
    sfNumber: {
      type: String,
      default: null
    },
    showRecordLink: {
      type: Boolean,
      default: true
    }
  },
  // 含getPatientInfo,handleislike两个方法
  mixins: [mixin],
  components: {
    followRecord
  },
  methods: {
    /**
     * @description 触发父组件刷新列表，供子组件-随访记录用
     * @function  refreshListFunc
     */
    refreshListFunc() {
      this.getPatientInfo().then(res => {
        this.baseData = res.data;
      });
      this.$emit('refreshData');
    },
    // 有 随访记录 按钮时调用
    sfDialog(taskId) {
      this.taskIdRecord = taskId;
      this.$refs.followRecord.toggleShowModal();
    },
    /**
     * 切换患者档案弹框的显示
     * @function toggleShowModal
     */
    toggleShowModal() {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.getPtTime();
          this.getPatientInfo().then(res => {
            this.baseData = res.data;
          });
        });
      }
    },
    /**
     * @description 请求当前时间的患者信息
     * @param obj tab对象,例如{name:'2018-09-09'}
     * @function currentPartientInfo
     */
    currentPartientInfo(obj) {
      // 判断是否已经获取过
      for (const item of this.timeList) {
        if (item.diagnosetime === obj.name && item[0]) {
          return false;
        }
      }
      PatientFile.getRecordByDate({
        adminId: this.userId,
        patientId: this.patientId,
        date: obj.name
      })
        .then(res => {
          this.timeList.forEach((item, index) => {
            if (item.diagnosetime == obj.name) {
              // item = Object.assign(item, res.data[0]);
              // 同一天，可能会有多条就诊记录的情况
              item = Object.assign(item, res.data);
              this.timeList.splice(index, 1, item);
            }
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * @function 获取随访时间列表
     * @return {type} {description}
     */
    getPtTime() {
      PatientFile.getRecordDate({
        adminId: this.token,
        patientId: this.patientId
      })
        .then(res => {
          this.timeList = res.data;
          if (this.timeList.length) {
            this.currentTable = this.timeList[0].diagnosetime;
            this.currentPartientInfo({
              name: this.timeList[0].diagnosetime
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>


