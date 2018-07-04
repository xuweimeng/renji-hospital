<template>
  <div class="followway">
    <!-- 搜索 -->
    <el-row class="form-search">
      <el-col :span="24">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="姓名" class="inputLength" style="height: 40px;">
            <el-input v-model.trim="searchParam.patientName" clearable placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="随访方案" class="inputLength" style="height: 40px;">
            <el-input v-model.trim="searchParam.schemeName" clearable placeholder="请输入随访方案"></el-input>
          </el-form-item>
          <el-form-item label="诊断名称" class="inputLength" style="height: 40px;">
            <el-input v-model.trim="searchParam.icdName" clearable placeholder="请输入疾病类型"></el-input>
          </el-form-item>
          <el-form-item label="性别" class="seclectLength" style="height: 40px;">
            <el-select v-model="searchParam.sex" placeholder="请选择" popper-class="searchSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="时间" class="seclectLength" style="height: 40px;">
            <el-select v-model="searchParam.type" placeholder="请选择" popper-class="searchSelect">
              <el-option label="全部" value="3"></el-option>
              <el-option label="近七天" value="2"></el-option>
              <el-option label="近30天" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" class="seclectLength" style="height: 40px;">
            <el-input v-model="searchParam.fromAge" placeholder="0"></el-input>
            <span>-</span>
            <el-input v-model="searchParam.endAge" placeholder="99"></el-input>
          </el-form-item>
          <el-form-item label="通话状态" style="float: left;margin-top: 5px;">
          <el-select v-model="searchParam.backStatus" placeholder="请选择" popper-class="searchSelectLarge">
            <el-option label="全部" value=""></el-option>
            <el-option label="呼叫失败" value="1"></el-option>
            <el-option label="正常通话" value="2"></el-option>
            <el-option label="通话中" value="3"></el-option>
            <el-option label="关停机" value="4"></el-option>
            <el-option label="无人接听" value="5"></el-option>
            <el-option label="空号" value="6"></el-option>
            <el-option label="号码有误" value="7"></el-option>
          </el-select>
          </el-form-item>
          <!--add by yugou0625 添加采集情况筛选 todo-->
          <el-form-item label="采集情况" style="float: left;margin-top: 5px;">
            <el-select v-model="searchParam.scquisitionState" placeholder="请选择" popper-class="searchSelectLarge">
              <el-option label="全部" value=""></el-option>
              <el-option label="无异常" value="1"></el-option>
              <el-option label="有异常" value="2"></el-option>
              <el-option label="部分采集" value="3"></el-option>
              <el-option label="接通未采集" value="4"></el-option>
              <el-option label="接通无应答" value="5"></el-option>
              <el-option label="未接通未采集" value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="waySearchBtn">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- tab切换 -->
    <el-row class="rsTabs">
      <el-col :span="24">
        <el-tabs type="border-card" @tab-click="handleClick">
          <!-- 未处理 -->
          <el-tab-pane :label="`未处理(${param_unhandled.total})`">
            <el-table :data="param_unhandled.tableData" style="width: 1110px" class="rsTable" v-loading="param_unhandled.loading">
              <el-table-column label="姓名" width="120" align="center">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="tbName fl-left" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="随访计划" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span @click="sfjhModel(scope)">{{scope.row.schemeName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="dateBegin" label="随访日期" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="随访进度" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.currentVisitTime}}/{{scope.row.visitCount}}</span>
                </template>
              </el-table-column>
              <el-table-column label="通话状态" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.backStatusStr}}</span>
                </template>
              </el-table-column>
              <!--update by yugou 情况进一步细分-->
              <el-table-column label="采集情况" align="center">
                 <template slot-scope="scope">
                  <!--<span v-if="scope.row.resultStatus==0" v-bind:class="[scope.row.resultStatus==0?cjsb:'']">采集失败</span>-->
                  <!--<span v-if="scope.row.resultStatus!=0" v-bind:class="[scope.row.currentVisitError>0?yyc:wyc]">{{scope.row.currentVisitError>0?scope.row.currentVisitError+'项异常':'无异常'}}</span>-->
                   <span v-if="scope.row.currentVisitError ===0 " :class="scope.row.stateClass">{{scope.row.scquisitionStateText}}</span>
                   <span v-if="scope.row.currentVisitError !==0 " class="yyc">{{scope.row.currentVisitError}}项异常</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="随访记录" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="wayButton(scope)" class="operateBtn">
                  详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="rsfy">
              <el-col :span="14" :offset="10">
                <el-pagination  @current-change="handleCurrentUnhandled" :current-page.sync="param_unhandled.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                  :total="param_unhandled.total" v-if="param_unhandled.total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 已处理 -->
          <el-tab-pane :label="`已处理`">
            <el-table :data="param_handled.tableData" style="width: 1110px" class="rsTable" v-loading="param_handled.loading">
              <el-table-column label="姓名" width="120" align="center">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="tbName fl-left" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
               <el-table-column prop="icdName" label="疾病诊断" align="center">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
               <el-table-column label="随访计划" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span @click="sfjhModel(scope)">{{scope.row.schemeName}}</span>
                </template>
              </el-table-column>
              <el-table-column label="通话状态" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.backStatusStr}}
                </template>
              </el-table-column>
              <el-table-column prop="dateBegin" label="随访日期" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="随访进度" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.currentVisitTime}}/{{scope.row.visitCount}}</span>
                </template>
              </el-table-column>
              <el-table-column label="处理意见" align="center">
                <template slot-scope="scope">
                  <span v-bind:class="[scope.row.visitResult==1?yyc:scope.row.visitResult==2?originC:wyc]">
                    {{scope.row.visitResult==0?'病情稳定':scope.row.visitResult==1?'通知就诊':scope.row.visitResult==2?'暂不处理':''}}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="随访记录" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click="wayButton(scope)" class="operateBtn">
                  详情
                </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row class="rsfy">
              <el-col :span="14" :offset="10">
                <el-pagination  @current-change="handleCurrentHandled" :current-page.sync="param_handled.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                  :total="param_handled.total" v-if="param_handled.total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 随访记录 -->
    <follow-record
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskId"
      :sf-number="sfNumber"
      :tab-active="tabActive"
      v-on:refreshData="refreshList"
      ref="followRecord"></follow-record>
    <!-- 就诊档案 不显示 随访记录 链接 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      ref="patientFile"
      :show-record-link="false"
      v-on:refreshData="refreshList"
    ></patient-file>
    <!-- 随访计划 -->
    <follow-plan
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskId"
      v-on:refreshData="refreshList"
      ref="followPlan"
    ></follow-plan>
  </div>
</template>

<script>
/**
 * 随访结果
 * @module followway
 */
import { FollowRecord } from '@/api/HN_DoctorClient/FollowRecord'
import patientFile from 'HNDC/common/patientFile'
import followPlan from 'HNDC/common/FollowPlan'
import followRecord from 'HNDC/common/followRecord'
const typeMap = ['unhandled','handled']; // 对应：未处理、已处理；用来匹配 不同的param_
  export default {
    data() {
      return {
        userId: '',//医生id
        searchParam: {
          sex:"",   // 病人性别
          patientName: '',  // 姓名
          icdName: '', // 疾病类型
          fromAge: '', // 搜索起始年龄
          endAge: '', // 搜索结束年龄
          type: '1', // 时间 3：全部，2：近7天，1：近30天
          schemeName: '', // 方案名称
          backStatus: '', // 通话状态
          scquisitionState: '', // 采集状态 1、无异常。2、有异常。3、部分采集。4、接通未采集。5、接通无应答。6、未接通未采集。
          limit: 10, // 每页条数
        },
        /* 未处理的数据集合 */
        param_unhandled: {
          page: 1,
          total: 0,
          loading: false,
          tableData: [],
          status: 1
        },
        /* 已处理的数据集合 */
        param_handled: {
          page: 1,
          total: 0,
          loading: false,
          tableData: [],
          status: 11
        },
        cjsb: 'cjsb',//采集失败(灰色)--采集情况不同时，文字颜色不同的处理
        wyc: 'wyc',//无异常(绿色)
        yyc: 'yyc',//有异常(红色)
        originC: 'originC',//橙色
        patientId: '',//病人id
        visitOrderId: '', // 选中的行的visitOrderId
        taskId: '',//获取病人的taskId
        sfNumber: '',//选中第几次
        tabActive: 0, // 当前选中的tab 0未处理，1已处理
      }
    },
    mounted() {
      this.getUserId(11)
      this.getList(this.param_unhandled);
    },
    components:{
      followRecord,
      patientFile,
      followPlan,
    },
    methods: {
      /**
       * 刷新当前列表数据--特别关注切换后--子组件调用
       * @function refreshList
       */
      refreshList() {
        let param_name = `param_${typeMap[this.tabActive]}`;
        this.getList(this[param_name]);
      },
      /**
      * 从sessionStorage获取医生id
      * @function getUserId
      * @param {String} userId 获取医生id
      */
      getUserId() {
        this.userId = sessionStorage.getItem('userId')//用户名
      },
      /**
      * 列表数据获取
      * @function getList
      * @param {Object} param search参数
      * @param {String} adminId 医生Id
      * @param {String} sex 病人性别
      * @param {String} patientName 病人名称
      * @param {String} icdName 疾病类型
      * @param {String} fromAge 搜索起始年龄
      * @param {String} endAge 搜索结束年龄
      * @param {String} type 时间 3：全部，2：近7天，1：近30天
      * @param {String} schemeName 方案名称
      * @param {String} vetStatus 未处理(1未处理，11已处理)
      * @param {String} backStatus 通话状态
      * @param {String} pager 当前页码
      * @param {String} limit 每页显示条数
      */
      getList(param) {
        param.loading = true;
        FollowRecord.list({
          ...this.searchParam,
          vetStatus: param.status,
          pager: param.page,
          adminId: this.userId,
        }).then((res)=>{
          param.loading = false
          if(res.code == 0) {
            const scquisitionStateMap = ['','无异常','有异常','部分采集','接通未采集','接通无应答','未接通未采集'];
            const stateColorMap = ['','wyc','yyc','yyc','cjsb','originC',''];
            //匹配当前病人是否被关注
            res.data.forEach((item)=>{
              if(item.islike == 0 || !item.islike) {
                item.islike = false
              }else if(item.islike == 1) {
                item.islike = true
              }
              item.stateClass = stateColorMap[item.scquisitionState];
              item.scquisitionStateText = scquisitionStateMap[item.scquisitionState];
            });
            param.tableData = res.data;
            param.total = res.count;
          }
        }).catch((error)=>{
          param.loading = false;
        });
      },
      /**
       * 分页--未处理
       * @function handleCurrentUnhandled
       * @param {String} val 当前页码
       * @description
       */
      handleCurrentUnhandled(page) {
        this.param_unhandled.page = page;
        this.getList(this.param_unhandled);
      },
      /**
       * 分页--已处理
       * @function handleCurrentHandled
       * @param {String} page 当前页码
       * @description
       */
      handleCurrentHandled(page) {
        this.param_handled.page = page;
        this.getList(this.param_handled);
      },
      /**
      * 查询
      * @function waySearchBtn
      */
      waySearchBtn() {
        // 修改page会触发 分页方法的调用,无需在调用getList
        let param_name = `param_${typeMap[this.tabActive]}`;
        if(this[param_name].page !== 1){
          this[param_name].page = 1;
          return false;
        }
        this.getList(this[param_name]);
      },
     /**
      * 获取表格选中行信息
      * @function wayButton
      * @param {Object} scope 点击列表的scope的信息
      */
      wayButton(scope) {
        this.patientId = scope.row.hzxxId
        this.visitOrderId = scope.row.visitOrderId
        this.taskId = scope.row.taskId
        this.sfNumber = scope.row.currentVisitTime;
       setTimeout(() => {
         this.$refs.followRecord.toggleShowModal();
       },0);
      },
      /**
       *列表上方的tab切换--不改变page
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
      handleClick(tab, event) {
        this.tabActive = tab.index;
        let param_name = `param_${typeMap[tab.index]}`;
        this.getList(this[param_name]);
      },
      /**
       *@function tdClick
       *@description 点击表格中的患者姓名
       */
      tdClick(scope) {
        this.patientId = scope.row.hzxxId
        this.visitOrderId = scope.row.visitOrderId
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        },0);
      },
      /**
       *@function sfjhModel
       *@description 点击表格中的随访计划，弹出 随访方案 框
       */
      sfjhModel(scope) {
        this.patientId = scope.row.hzxxId
        this.visitOrderId = scope.row.visitOrderId
        this.taskId = scope.row.taskId;
        setTimeout(() => {
          this.$refs.followPlan.toggleShowModal();
        },0);
      }
    }
  }
</script>

<style lang="scss">
  /*
 @import '../../assets/scss/mixin';
 @import '../../assets/scss/reset';
 @import '../../common/style/base';
  .followway {
    background: $background;
  }
  */
  /*************搜索************/
.form-search {
  /*height: 52px;*/
  margin-bottom: 10px;
  background: #fff;
  .el-col {
    .el-form {
      /*height: 52px;*/
      padding-left: 25px;
      .el-form-item{
        margin-bottom: 5px;
      }
      //姓名，随访方案，疾病诊断
      .el-form-item:nth-of-type(1),.el-form-item:nth-of-type(2), .el-form-item:nth-of-type(3){
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-input {
            width: 125px;
            height: 26px;
            .el-input__inner {
              border-radius: 12px;
              height: 26px;
              padding-left: 5px;
            }
          }
        }
      }
      //性别
      .el-form-item:nth-of-type(4), .el-form-item:nth-of-type(5){
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-input {
            width: 90px;
            height: 26px;
            .el-input__inner {
              border-radius: 12px;
              height: 26px;
              text-align: center;
            }
          }
        }
      }
      //年龄
      .el-form-item:nth-of-type(6) {
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-input {
            width: 57px;
            height: 26px;
            .el-input__inner {
              border-radius: 12px;
              height: 26px;
              padding: 0 10px;
            }
          }
          span {
            margin: 0 3px;
          }
        }
      }
      //搜索
      /*.el-form-item:nth-of-type(8) {*/
      /*update by yugou*/
      .el-form-item:last-child{
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-button {
            height: 26px;
            line-height: 0;
            margin-top: 13px;
            background: #fff9f7;
            border-color: #fdd3c4;
            color: #ff6e40;
            font-size: 14px;
          }
        }
      }
    }
  }
}
  .wyc {
    color: #00ae00;
  }
  .yyc {
    color: #ff2626;
  }
  .cjsb {
    color: #ffb15d;
  }
  .originC {
    color: #ff6800;
  }
  //表格详情按钮
  .operateBtn {
    height:23px;
    width:62px;
    padding:0!important;
    font-size:13px;
  }
  //失效按钮
  .disabledBtn {
    pointer-events: none;
    background: #9E9E9E!important;
    border: none!important;
  }
  .el-input--suffix .el-input__inner{
    border-radius: 12px;
    height: 26px;
    text-align: center;
  }
  /*add  by yugou*/
  /*较宽的select--通话状态、采集情况*/
  .searchSelectLarge{
    top: 163px !important;
  }
  .searchSelectLarge .popper__arrow{
    left: 222.5px !important;
  }
</style>
