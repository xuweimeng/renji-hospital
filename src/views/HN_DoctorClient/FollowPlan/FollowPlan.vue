<template>
  <div class="followplan">
    <!-- 搜索 -->
    <el-row class="formSearch">
      <el-col :span="24">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="姓名" class="inputLength">
            <el-input v-model.trim="searchParam.patientName" clearable placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="随访方案" class="inputLength">
            <el-input v-model.trim="searchParam.schemeName" clearable placeholder="请输入随访方案"></el-input>
          </el-form-item>
          <el-form-item label="疾病诊断" class="inputLength">
            <el-input v-model.trim="searchParam.icdName" clearable placeholder="请输入疾病诊断"></el-input>
          </el-form-item>
          <el-form-item label="性别" class="seclectLength">
            <el-select v-model="searchParam.sex" placeholder="请选择" popper-class="searchSelect">
              <el-option label="全部" value=""></el-option>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" class="seclectLength">
            <el-input v-model="searchParam.fromAge" placeholder="0"></el-input>
            <span>-</span>
            <el-input v-model="searchParam.endAge" placeholder="99"></el-input>
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
          <!-- 待审核 -->
          <el-tab-pane :label="`待审核(${param_wait.total})`">
            <el-table :data="param_wait.tableData" style="width: 1130px" class="rsTable" v-loading="param_wait.loading" @selection-change="handleSelectionChange" ref="multipleTable">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
               <el-table-column label="姓名" align="center" width="120px">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="tbName fl-left" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" align="center" width="85px">
                <template slot-scope="scope">
                  <span>{{scope.row.sex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center" show-overflow-tooltip width="164px">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center">
              </el-table-column>
              <el-table-column label="审核" align="center" width="140">
                <template slot-scope="scope">
                  <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
                  :13px;" @click="throughCheck(scope)">通过</el-button>
                  <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
                  :13px;" @click="noThroughCheck(scope)">不通过</el-button>
                </template>
              </el-table-column>
              <el-table-column label="随访计划" align="center" width="140">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="wayButton(scope)" style="height:23px;width:52px;padding:0;font-size
                  :13px;background:#1899ff;">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row v-if="param_wait.tableData.length">
              <!-- 批量通过 -->
              <el-col :span="10">
                <div class="checkPiliang">
                  <el-button @click="toggleSelection(param_wait.tableData)">全选</el-button>
                  <el-button @click="numCheck">批量通过</el-button>
                </div>
              </el-col>
              <!-- 分页 -->
              <el-col :span="14">
                <div class="block" style="margin-top: 11px;">
                  <el-pagination  @current-change="pageChange_wait" :current-page.sync="param_wait.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                                  :total="param_wait.total" v-if="param_wait.total">
                  </el-pagination>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 已通过 -->
          <el-tab-pane :label="`已通过`">
            <el-table :data="param_pass.tableData" style="width: 1110px" class="rsTable" v-loading="param_pass.loading">
              <el-table-column label="姓名" width="146" align="center">
                <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="tbName fl-left" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" align="center" width="85px">
                <template slot-scope="scope">
                  <span>{{scope.row.sex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center" show-overflow-tooltip width="164px">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="operator" label="审核人" align="center">
              </el-table-column>
              <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="随访计划" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="wayButton(scope)" style="height:23px;width:52px;padding:0;font-size
                  :13px;background:#1899ff;" >详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row class="rsfy">
              <el-col :span="14" :offset="10" style="margin-top: 11px;">
                <el-pagination  @current-change="pageChange_pass" :current-page.sync="param_pass.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                                :total="param_pass.total" v-if="param_pass.total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
          <!-- 未通过 -->
          <el-tab-pane :label="`未通过`">
            <el-table :data="param_nopass.tableData" style="width: 1110px" class="rsTable" v-loading="param_nopass.loading">
              <el-table-column label="姓名" width="146" align="center">
                 <template slot-scope="scope">
                  <div class="tbCare fl-left"><i class="iconfont" v-if="scope.row.islike==1">&#xe604;</i></div>
                  <div class="tbName fl-left" @click="tdClick(scope)"><span>{{ scope.row.patientName }}</span></div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="性别/年龄" align="center" width="85px">
                <template slot-scope="scope">
                  <span>{{scope.row.sex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="icdName" label="疾病诊断" align="center" show-overflow-tooltip width="164px">
                <template slot-scope="scope">
                  <div style="text-align: left;margin-left: 18px;">
                    <div class="tags">{{scope.row.diagnosetype ==1?'门诊':'住院'}}</div>
                    {{scope.row.icdName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="notPassReason" label="未通过原因" align="center">
              </el-table-column>
              <el-table-column prop="operator" label="审核人" align="center">
              </el-table-column>
              <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="随访计划" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="wayButton(scope)" style="height:23px;width:52px;padding:0;font-size
                  :13px;background:#1899ff;">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row class="block">
              <el-col :span="14" :offset="10" style="margin-top: 11px;">
                <el-pagination  @current-change="pageChange_nopass" :current-page.sync="param_nopass.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                                :total="param_nopass.total" v-if="param_nopass.total">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 审核不通过 -->
    <el-dialog title="审核不通过原因"
      :visible.sync="noCheck"
      width="350px"
      :center = "false"
      custom-class="checknoPass">
      <el-row slot>
         <el-col :span="24" >
          <el-select v-model="selectCheck" placeholder="请选择" @change="changeSelect" popper-class="selectOut">
            <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="24" class="btnCheck" style="margin-top:28px;">
          <el-button @click.native="noothroughCheck">确定</el-button>
          <el-button @click="noCheck=false">取消</el-button></el-col>
      </el-row>
    </el-dialog>
    <!-- 就诊档案 不显示 随访记录 链接-->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="false"
      ref="patientFile"
      v-on:refreshData="refreshList"
    ></patient-file>
    <!-- 随访计划 -->
    <follow-plan
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :task-id="taskId"
      ref="followPlan"
      :tab-active="tabActive"
      v-on:passBtn="modelPass"
      v-on:nopassBtn="modelOut"
      v-on:refreshData="refreshList"
    ></follow-plan>
  </div>
</template>

<script>
/**
 * 随访计划
 * @module followParam
 */
import { FollowPlan } from '@/api/HN_DoctorClient/FollowPlan'
import patientFile from 'HNDC/common/patientFile'
import followPlan from 'HNDC/common/FollowPlan'
const typeMap = ['wait','pass','nopass']; // 依次是 待审核、已通过、未通过；用来匹配 不同的param_
  export default {
    data() {
      return {
        userId: '',//从localStorage获取登录页的医生id
        searchParam: {
          limit: 10, // 每页数量
          patientName: '', // 病人名称
          icdName: '', // 疾病类型
          sex: '', // 病人性别
          fromAge: '', // 搜索起始年龄
          endAge: '', // 搜索结束年龄
          schemeName: '', // 方案名称
        },
        //(1:已通过 2:未通过 3:已审核 4:未审核)
        /* 待审核的数据集合 */
        param_wait: {
          page: 1,
          total: 0,
          loading: false,
          tableData: [],
          status: 4
        },
        /* 已通过的数据集合 */
        param_pass: {
          page: 1,
          total: 0,
          loading: false,
          tableData: [],
          status: 1
        },
        /* 未通过的数据集合 */
        param_nopass: {
          page: 1,
          total: 0,
          loading: false,
          tableData: [],
          status: 2
        },
        patientId: '',//病人id
        tabActive: 0,//当前选中的tab 0：待审核，1：已通过，2：未通过
        multipleSelection: [], // 待审核表格中的选中结果
        noCheck: false, //审核不通过弹框
        selectCheck: '', //选中的审核不通过
        //审核不通过options
        checkoptions: [{
          value: '',
          label: '请选择'
        },
        {
          value: '1',
          label: '患者已死亡'
        }, {
          value: '2',
          label: '患者不接受随访'
        }, {
          value: '3',
          label: '随访方案重复'
        }, {
          value: '4',
          label: '方案不匹配'
        }],
        checkId: [],//随访通过的id(多选时),
        taskId: '', // 选中的行的id ?
        visitOrderId: '', // 选中的行的visitOrderId
      }
    },
    mounted() {
      this.getUserId();
      this.getList(this.param_wait);
    },
    components:{
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
        this.userId = sessionStorage.getItem('userId'); // 用户名
      },
      /**
       * 列表数据获取
       * @function getList
       * @param {Object} param search参数
       * @param {String} adminId 医生Id
       * @param {String} status 审核状态(1:已通过 2:未通过 3:已审核 4:未审核)
       * @param {String} sex 病人性别
       * @param {String} patientName 病人名称
       * @param {String} icdName 疾病类型
       * @param {String} fromAge 搜索起始年龄
       * @param {String} endAge 搜索结束年龄
       * @param {String} schemeName 方案名称
       * @param {String} pager 当前页码
       * @param {String} limit 每页显示条数
       */
      getList(param) {
        param.loading = true;
        FollowPlan.list({
          ...this.searchParam,
          status: param.status,
          pager: param.page,
          adminId: this.userId,
        }).then((res) => {
          param.loading = false;
          if (res.code == 0) {
            res.data.forEach((item) => {
              if (item.islike == 0 || !item.islike) {
                item.islike = false
              } else if (item.islike == 1) {
                item.islike = true
              }
              //匹配审核不通过原因
              const reasonMap = ['', '患者已死亡', '患者不接受随访', '随访方案重复', '方案不匹配'];
              item.notPassReason = reasonMap[item.notPassReason];
              //随访类型
              if (!item.activeType) {
                item.activeType = 0;
              }
              const activeTypeMap = ['随访', '通知', '临时随访'];
              item.activeType = activeTypeMap[item.activeType];
            });
            param.tableData = res.data;
            // param.total = res.count;

            // "hadExamineCount" : 1760 , //已审核
            // "count" : 1865 , // 待审核
            //  passCount通过
            // "noPassCount" : 5 , //未通过总数
            // "unExamineCount" : 104 , //未审核
            const countMap = ['count','passCount','noPassCount'];
            param.total = res[countMap[this.tabActive]];
          }
        }).catch((error) => {
          param.loading = false;
        });
      },
      /**
       * 待审核分页
       * @function pageChange_wait
       * @param {String} page 当前页码
       * @description
       */
      pageChange_wait(page) {
        this.param_wait.page = page;
        this.getList(this.param_wait);
      },
      /**
       * 已通过分页
       * @function pageChange_wait
       * @param {String} page 当前页码
       * @description
       */
      pageChange_pass(page) {
        this.param_pass.page = page;
        this.getList(this.param_pass);
      },
      /**
       * 不通过分页
       * @function pageChange_wait
       * @param {String} page 当前页码
       * @description
       */
      pageChange_nopass(page) {
        this.param_nopass.page = page;
        this.getList(this.param_nopass);
      },
      /**
       * 查询
       * @function waySearchBtn
       */
      waySearchBtn() {
        // 修改page会触发 分页方法的调用,无需在调用getList
        let param_name = `param_${typeMap[this.tabActive]}`;
        if (this[param_name].page !== 1) {
          this[param_name].page = 1;
          return false;
        }
        this.getList(this[param_name]);
      },
      /**
       * 获取表格选中行信息-点击 详情
       * @function wayButton
       * @param {Object} scope 点击列表的scope的信息
       */
      wayButton(scope) {
        this.checkId = []
        this.checkId.push(scope.row.id)
        this.isCare = scope.row.islike //获取当前患者是否被关注
        this.patientId = scope.row.hzxxId
        this.taskId = scope.row.id;
        this.visitOrderId = scope.row.visitOrderId
        setTimeout(() => {
          this.$refs.followPlan.toggleShowModal();
        },0);
      },
      /**
       *列表上方的三个tab切换--不改变page
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
       *待审核表格全选
       *@function toggleSelection
       *@param {object} rows 选中的行（参见element-ui的table-rows）
       */
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      /**
       *待审核表格多选
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /**
       *批量审核
       *@function numCheck
       *@description 批量审核，传入多学值，参考handleCheck
       */
      numCheck() {
        let id_arr = []
        this.multipleSelection.forEach((item) => {
          id_arr.push(item.id)
        })
        if (!id_arr.length) {
          this.$message.error('请选择患者!')
        } else {
          this.handleCheck(2, 2, id_arr.join(','),)
        }
      },
      /**
       *表格内审核通过
       *@function throughCheck
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      throughCheck(scope) {
        this.handleCheck(2, 2, scope.row.id)
      },
      /**
       *表格内审核不通过
       *@function throughCheck
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      noThroughCheck(scope) {
        this.checkId = []//每次点击时清空选中的患者id
        this.checkId.push(scope.row.id)
        this.noCheck = true
        this.selectCheck = ''
      },
      /**
       *审核不通过的原因
       *@function changeSelect
       *@param {String} value 审核不通过的原因
       */
      changeSelect(value) {
        this.selectCheck = value
      },
      /**
       *审核不通过原因弹框 点击确定
       *@function noothroughCheck
       *@description 点击表格操作弹框不通过
       */
      noothroughCheck() {
        if (this.selectCheck) {
          let id = this.checkId.join(',')
          this.handleCheck(1, 2, id, this.selectCheck)
          this.$refs.followPlan.closeDialog();
          this.getList(this.param_wait);
        } else {
          this.$message.error('请选择不通过原因!')
        }
      },
      /**
       *随访计划详情弹框中 点击通过
       *@function modelPass
       */
      modelPass() {
        let id = this.checkId.join(',')
        this.handleCheck(2, 2, id)
        this.$refs.followPlan.toggleShowModal();
        this.getList(this.param_wait);
      },
      /**
       *随访计划详情弹框中 点击不通过
       *@function modelOut
       */
      modelOut() {
        this.noCheck = true
        this.selectCheck = ''
      },
      /**
       *审核功能
       *@function handleCheck
       *@description 审核功能均调用这一个函数
       *@param {String} adminId 医生id
       *@param {String} operateType 通过(1：不通过 2：通过)
       *@param {String} isAll 是否全部提交(1:是 2：否)
       *@param {String} ids 患者id集合,数组转字符串
       *@param {String} noPassReason 审核不通过原因
       */
      handleCheck(operateType, isAll, ids, noPassReason) {
        FollowPlan.editVisitProjectStatus({
          'adminId': this.userId,
          'operateType': operateType,
          'isAll': isAll,
          'ids': ids,
          'noPassReason': noPassReason,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: '操作已完成',
              type: 'success'
            });
            this.getList(this.param_wait);
            this.noCheck = false
          }
        }).catch((error) => {
        })
      },
      /**
       *@function tdClick
       *@description 点击患者姓名展示患者就诊档案
       *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
       */
      tdClick(scope) {
        this.patientId = scope.row.hzxxId
        this.visitOrderId = scope.row.visitOrderId
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        },0);
      },
    }
  }
</script>

<style lang="scss">
 /*@import '../../assets/scss/mixin';*/
 /*@import '../../assets/scss/reset';*/
 /*@import '../../common/style/base';*/

 /*
  .followplan {
    background: $background;
  }
  */
  //model指标遍历
  .targetLeft {
    text-align: left;
    color: #209eff;
  }
  //审核不通过弹框
  .checknoPass {
    .el-dialog__header {
      text-align: left;
      font-size: 18px;
      .el-dialog__title {
        color: #323333;
        line-height: 18px;
      }
    }
    .el-dialog__body {
      .el-row .btnCheck {
        .el-button {
          padding: 6px 19px;
          color: #fff;
        }
        .el-button:nth-of-type(1) {
          background: #ff602d;
        }
        .el-button:nth-of-type(2) {
          background: #afafaf;
        }
      }
    }
  }
  //批量审核
  .checkPiliang .el-button{
    padding: 6px 12px;
    background: #ff6e40;
    color: #fff;
    margin-top: 20px;
    margin-left: 40px;
    float:left;
  }
  //审核不通过下拉框
  .selectOut {
    margin-top: 12px!important;
    //top: 278px !important;
     //下拉框
    .el-scrollbar {
      .el-select-dropdown__wrap .el-select-dropdown__list .el-select-dropdown__item {
        padding: 0 14px;
      }
    }
    //箭头
    .popper__arrow {
     left: 188px !important;
    }
  }
</style>
