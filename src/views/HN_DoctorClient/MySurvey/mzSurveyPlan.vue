<template>
  <div class="followplan">
    <!-- 搜索 -->
    <el-row class="searchList">
      <el-col :span="24">
        <el-form :inline="true" :model="searchParam" class="demo-form-inline">
          <el-form-item label="姓名" class="inputLength">
            <el-input size="small" v-model.trim="searchParam.brxm" clearable placeholder="请输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" class="inputLength">
            <el-input size="small" v-model.trim="searchParam.mobile" clearable placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="科室" class="seclectLength">
            <el-cascader
              popper-class="searchSelect"
              size="small"
              :options="departMentList"
              v-model="medGpId"
              @change="getDepartchange"
              filterable
              clearable
              >
            </el-cascader>
          </el-form-item>
          <el-form-item label="就诊时间">
            <el-date-picker
                size="small"
                v-model="time_disease"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="diseaseTime" >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- tab切换 -->
    <el-row class="rsTabs">
      <el-col :span="24">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
          <!-- 待审核 -->
          <el-tab-pane :label="`待审核(${param_wait.total})`" name="first">
            <el-table :data="param_wait.tableData" style="width: 1130px" class="rsTable" v-loading="param_wait.loading" @selection-change="handleSelectionChange" ref="multipleTable">
              <el-table-column type="selection" width="55" align="center">
              </el-table-column>
              <el-table-column prop="brxm" label="姓名" align="center" width="120px">
              </el-table-column>
              <el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="schemeName" label="方案名称" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="medGpName" label="科室" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderTime" label="就诊时间" align="center" show-overflow-tooltip>
              </el-table-column>
             <!--  <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center">
              </el-table-column> -->
              <el-table-column label="审核" align="center" width="140">
                <template slot-scope="scope">
                  <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
                  :13px;" @click="throughCkeck(scope)">通过</el-button>
                  <el-button style="height:22px;width:52px;padding:0;margin:0;font-size
                  :13px;" @click="noThroughCkeck(scope)">不通过</el-button>
                </template>
              </el-table-column>
              <el-table-column label="详情" align="center" width="140">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="getInfo(scope)" style="height:23px;width:52px;padding:0;font-size
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
                  <el-button @click="numCheckFail">批量不通过</el-button>
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
          <el-tab-pane :label="`已通过`" name="second">
            <el-table :data="param_pass.tableData" style="width: 1110px" class="rsTable" v-loading="param_pass.loading">
              <el-table-column prop="brxm" label="姓名" width="146" align="center">
              </el-table-column>
              <el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="schemeName" label="方案名称" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="medGpName" label="科室" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderTime" label="就诊时间" align="center" show-overflow-tooltip>
              </el-table-column>
              <!-- <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center" show-overflow-tooltip>
              </el-table-column> -->
              <el-table-column prop="operator" label="审核人" align="center">
              </el-table-column>
              <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="详情" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="getInfo(scope)" style="height:23px;width:52px;padding:0;font-size
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
          <el-tab-pane :label="`未通过`" name="third">
            <el-table :data="param_nopass.tableData" style="width: 1110px" class="rsTable" v-loading="param_nopass.loading">
              <el-table-column prop="brxm" label="姓名" align="center">
              </el-table-column>
              <el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="schemeName" label="方案名称" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="medGpName" label="科室" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="orderTime" label="就诊时间" align="center" show-overflow-tooltip>
              </el-table-column>
               <el-table-column prop="notPassReason" label="未通过原因" align="center" show-overflow-tooltip>
                 <template slot-scope="scope">
                   {{scope.row.notPassReason==1?"患者已死亡":scope.row.notPassReason==2?"患者不接受随访":scope.row.notPassReason==3?"随访方案重复":"方案不匹配"}}
                </template>
              </el-table-column>
              <el-table-column prop="operator" label="审核人" align="center">
              </el-table-column>
              <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="详情" align="center">
                <template slot-scope="scope">
                  <el-button type="primary" @click.stop="getInfo(scope)" style="height:23px;width:52px;padding:0;font-size
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
    <el-dialog title="审核不通过原因" :visible.sync="noCheck" width="350px" :center = "false" custom-class="checknoPass">
      <el-row slot>
         <el-col :span="24" >
          <el-select v-model="selectCheck" placeholder="请选择" @change="changeSelect" popper-class="selectOut">
            <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="24" class="btnCheck" style="margin-top:28px;" @click.native="noothroughCkeck"><el-button>确定</el-button><el-button @click="noCheck=false">取消</el-button></el-col>
      </el-row>
    </el-dialog>
    <!-- 详情 -->
   <!--  <survey-plan :surveyPlan="surveyPlan" @planClose="planClose"></survey-plan> -->

    <el-dialog top="5vh" class="plan_info" title="调查计划" :visible.sync="surveyPlan">
        <h3>
			{{infoData.brxm||""}}
          	<span>
			{{infoData.brxb||""}}/{{infoData.brage||""}}
          	</span>
        </h3>
        <ul class="plan_info_base">
			<li>联系电话：{{infoData.mobile}}</li>
			<li>医疗组/科室：{{infoData.departmentName||infoData.medGpName}}</li>
			<li>出院时间/就诊时间：{{infoData.diagnoseTime}}</li>
        </ul>
        <h4 v-show="infoMessage.orderList.length>0">随访方案 : {{infoMessage.questionTempleName}} </h4>
        <h4 v-show="infoMessage.orderList.length>0">随访次数 : 共{{infoMessage.allCount}}次</h4>
			<div class="plan_info_inner">
				<ul class="plan_info_message" v-for="(item,index) in infoMessage.orderList" :key="index">
					<h4>第{{index+1}}次随访: <span>开始时间 :{{item.dateBegin}}</span>   <span>{{item.statusStr}}</span> </h4>
					<li v-for="(ite,ins) in item.CollectionIndex.split(',')" v-show="ite" :key="ins">{{ite}}</li>
				</ul>
			</div>
    </el-dialog>

  </div>
</template>

<script>
/**
 * 随访计划
 * @module followParam
 */
import { MySurvey } from '@/api/HN_DoctorClient/MySurvey';
import { CommonAPI } from '@/api/HN_DoctorClient/common';
const typeMap = ['wait', 'pass', 'nopass']; // 依次是 待审核、已通过、未通过；用来匹配 不同的param_
export default {
  data() {
    return {
      medGpId: [],
      /* 计划详情 */
      infoData: {
        brxm: '',
        brxb: '',
        brage: '',
        medGpName: '',
        departmentName: ''
      },
      infoMessage: {
        allCount: '',
        questionTempleName: '',
        orderList: []
      },
      userId: '', // 从localStorage获取登录页的医生id
      searchParam: {
        limit: 10, // 每页数量
        adminId: sessionStorage.getItem('userId'), // 医生ID
        brxm: '', // 患者姓名
        mobile: '', // 联系电话
        departmentId: '', // 科室ID
        medGpId: '', // 医疗组ID
        VisitStartTimeBegin: '', // 计划执行时间开始时间
        VisitStartTimeEnd: '', // 计划执行时间结束时间
        dateAddBegin: '', // 就诊(出院)开始时间
        dateAddEnd: '', // 就诊（出院）结束时间
        // status: "", // 状态(4 待审核 2 不通过 1 审核通过 5 已取消)
        activeType: 7 // 6:住院满意度 7.门诊
      },
      time_plan: '', // 计划执行时间
      time_disease: '', // 就症时间
      surveyPlan: false, // 详情弹框
      activeName: 'first', // tab切换默认选中
      dialogVisible: false,
      /* 待审核的数据集合 */
      param_wait: {
        page: 1,
        total: 0,
        loading: false,
        tableData: [],
        status: 4
      },
      /* 通过的数据集合 */
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

      deparmentId: [],
      departMentList: [] /* 科室 */,
      groupList: [] /* 医疗组 */,

      isNull: false,
      activeName2: '1', // 随访语音折叠面板
      tabActive: 0, // 当前选中的tab0全部患者1特别关心
      multipleSelection: [] /* 选中的数据*/,
      noCheck: false, // 审核不通过弹框
      selectCheck: '', // 选中的审核不通过
      checkoptions: [
        {
          value: '',
          label: '请选择'
        },
        {
          // 审核不通过options
          value: '1',
          label: '患者已死亡'
        },
        {
          value: '2',
          label: '患者不接受随访'
        },
        {
          value: '3',
          label: '随访方案重复'
        },
        {
          value: '4',
          label: '方案不匹配'
        }
      ],
      checkId: [], // 随访通过的id(多选时),

      modelFollplanData: [] // 随访计划data
    };
  },
  mounted() {
    this.getUserId();
    this.getDepartMentList();
    this.getGroupList();
    this.getData(this.param_wait);
  },
  methods: {
    getInfoData(item) {
      CommonAPI
        .getPatientRecord({
          /*   visitOrderId:, */
          adminId: this.userId,
          patientId: item.hzxxId
        })
        .then(res => {
          this.infoData = res.data;
          this.infoData.mobile = item.mobile;
          this.infoData.medGpName = item.medGpName;
          this.infoData.departmentName = item.departmentName;
          this.getInfoMessage(item.id);
        });
    },
    getInfoMessage(id) {
      CommonAPI
        .getVisitOrderDetail({
          taskId: id
        })
        .then(res => {
          if (res.data) {
            this.infoMessage = res.data;
          } else {
            this.infoMessage = {
              orderList: []
            };
          }
        });
    },
    /**
     * @description 科室变化
     * @function {function name}
     * @return {type} {description}
     */
    getDepartchange(data) {
      this.searchParam.medGpId = data[data.length - 1];
    },
    /**
     * @description 获取科室组
     * @function getDepartMentList
     * @return {type} {description}
     */
    getDepartMentList() {
      MySurvey.getDepart().then(res => {
        this.departMentList = this.dataFormat(res.data);
      });
    },
    /**
     * @description 获取医疗组
     * @function getGroupList
     * @return {type} {description}
     */
    getGroupList() {
      MySurvey.getGroup().then(res => {
        this.groupList = res.data;
      });
    },
    /**
     * @description 科室格式化
     * @function dataFormat
     * @param  {type} data {description}
     * @return {type} {description}
     */
    dataFormat(data) {
      const arrList = [];
      /**
       * 等级分组
       */
      for (const item of data) {
        item.expand = true;
        item.label = item.name;
        item.value = item.id;
        if (!arrList[item.level]) {
          arrList[item.level] = [];
        }
        arrList[item.level].push(item);
      }
      const appendChild = (child, parent) => {
        for (const item of child) {
          for (const ite of parent) {
            if (item.parentId == ite.id) {
              if (!ite.children) {
                ite.children = [];
              }
              ite.children.push(item);
            }
          }
        }
      };
      for (let i = arrList.length - 1; i > 0; i--) {
        appendChild(arrList[i], arrList[i - 1]);
      }
      return arrList[0];
    },
    /**
     * @description 就诊时间改变触发函数
     * @function diseaseTime
     * @param  {array} date 返回的时间值数组
     */
    diseaseTime(date) {
      if (date) {
        this.searchParam.dateAddBegin = date[0];
        this.searchParam.dateAddEnd = date[1];
      } else {
        this.searchParam.dateAddBegin = '';
        this.searchParam.dateAddEnd = '';
      }
    },
    /**
     * @description 计划执行时间改变触发函数
     * @function planTime
     * @param  {array} date 返回的时间值数组
     */
    planTime(date) {
      this.searchParam.VisitStartTimeBegin = date[0];
      this.searchParam.VisitStartTimeEnd = date[1];
    },
    /** 监听详情关闭弹框 */
    planClose(val) {
      console.log(val);
      if (!val) {
        this.surveyPlan = false;
      }
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
     * @description 获取表格数据
     * @function getData
     * @param  {type} param {description}
     * @return {type} {description}
     */
    getData(param) {
      param.loading = true;
      MySurvey
        .queryOrderTaskMYDList({
          ...this.searchParam,
          status: param.status,
          pager: param.page
        })
        .then(res => {
          param.loading = false;
          if (res.code === 0) {
            // 匹配当前病人是否被关注
            res.data.forEach(item => {
              if (item.islike === 0 || item.islike === '0' || !item.islike) {
                item.islike = false;
              } else if (item.islike === 1 || item.islike === '1') {
                item.islike = true;
              }
            });
            param.tableData = res.data;
            param.total = res.total;
          }
        })
        .catch(error => {
          console.log(error);
          param.loading = false;
        });
    },
    /**
     * 待审核分页
     * @function pageChange_wait
     * @param {String} val 当前页码
     * @description
     */
    pageChange_wait(page) {
      this.param_wait.page = page;
      this.getData(this.param_wait);
    },
    /**
     * 已通过分页
     * @function pageChange_wait
     * @param {String} val 当前页码
     * @description
     */
    pageChange_pass(page) {
      this.param_pass.page = page;
      this.getData(this.param_pass);
    },
    /**
     * 不通过分页
     * @function pageChange_wait
     * @param {String} val 当前页码
     * @description
     */
    pageChange_nopass(page) {
      this.param_nopass.page = page;
      this.getData(this.param_nopass);
    },
    /**
     * 数据查询
     * @function searchData
     * @param {String} 1 返回第一页
     */
    searchData() {
      // 修改page会触发 分页方法的调用,无需在调用getData
      const param_name = `param_${typeMap[this.tabActive]}`;
      if (this[param_name].page !== 1) {
        this[param_name].page = 1;
        return false;
      }
      this.getData(this[param_name]);
    },
    /**
     * 获取详情
     * @function getInfo
     * @param {Object} scope 点击列表的scope的信息
     */
    async getInfo(scope) {
      this.surveyPlan = true;
      this.infoData.medGpName = scope.row.medGpName;
      const res = await this.getInfoData(scope.row);
      /*  if(res.taskId){
        await this.getInfoMessage(res.taskId);
      } */
      /* this.$store.dispatch("rowData", scope.row); */
    },
    /**
     *列表上方的tab切换--不改变page
     *@function handleClick
     *@param {object} tab tab信息
     *@param {event} event 点击事件
     */
    handleClick(tab, event) {
      this.tabActive = tab.index;
      const param_name = `param_${typeMap[tab.index]}`;
      this.getData(this[param_name]);
    },
    /**
     *待审核表格全选
     *@function toggleSelection
     *@param {object} rows 选中的行（参见element-ui的table-rows）
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
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
     *批量审核通过
     *@function numCheck
     *@description 批量审核，传入多学值，参考handleCheck
     */
    numCheck() {
      const ids = [];
      this.multipleSelection.forEach(item => {
        ids.push(item.id);
      });
      if (!ids.length) {
        this.$message.error('请选择患者!');
      } else {
        this.handleCheck(2, 2, ids.join(','));
      }
    },
    /**
     *批量审核不通过
     *@function numCheck
     *@description 批量审核，传入多学值，参考handleCheck
     */
    numCheckFail() {
      if (!this.multipleSelection.length) {
        this.$message.error('请选择患者!');
      } else {
        this.noCheck = true;
        this.checkId = []; // 每次点击时清空选中的患者id
        this.multipleSelection.forEach(item => {
          this.checkId.push(item.id);
        });
        this.noCheck = true;
        this.selectCheck = '';
      }
    },
    /**
     *表格内审核通过
     *@function throughCkeck
     *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
     */
    throughCkeck(scope) {
      this.handleCheck(2, 2, scope.row.id);
      this.searchData();
    },
    /**
     *表格内审核不通过
     *@function throughCkeck
     *@param {object} scope 当前行内容（参加element-ui的table的scope概念）
     */
    noThroughCkeck(scope) {
      this.checkId = []; // 每次点击时清空选中的患者id
      this.checkId.push(scope.row.id);
      this.noCheck = true;
      this.selectCheck = '';
    },
    /**
     *审核不通过的原因
     *@function changeSelect
     *@param {String} value 审核不通过的原因
     */
    changeSelect(value) {
      this.selectCheck = value;
    },
    /**
     *弹框点击不通过确定
     *@function noothroughCkeck
     *@description 点击表格操作弹框不通过
     */
    noothroughCkeck() {
      const id = this.checkId.join(',');
      this.handleCheck(1, 2, id, this.selectCheck);
      this.noCheck = false;
      this.searchData();
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
      if (!noPassReason && operateType == 1) {
        this.$message.error('请选择不通过原因!');
        return false;
      }
      MySurvey
        .editVisitProjectStatus({
          adminId: this.userId,
          operateType: operateType,
          isAll: isAll,
          ids: ids,
          noPassReason: noPassReason
        })
        .then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作已完成',
              type: 'success'
            });
            this.getDaSurveyPlanta(this.param_wait);
            this.getData(this.param_pass);
            this.getData(this.param_nopass);
            this.noCheck = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss">
  /*
@import "../../assets/scss/mixin";
@import "../../assets/scss/reset";
@import "../../common/style/base";
*/

.plan_info {
  h3 {
    color: #f80;
    text-align: left;
    font-size: 20px;
  }
  h4 {
    text-align: left;
    margin: 3px 0;
    font-weight: 400;
    color: #209eff;
    font-size: 13px;
  }
  &_inner {
    max-height: 500px;
    overflow-y: auto;
    h4 {
      font-weight: 400;
      color: #f80;
      font-size: 14px;
      span {
        color: #999;
        font-size: 12px;
      }
    }
  }
  &_message {
    margin-bottom: 5px;
    text-align: left;
    li {
      display: inline-block;
      margin-right: 8px;
      text-align: left;
      background-color: #209eff;
      padding: 0 5px;
      border-radius: 3px;
      color: #fff;
      font-size: 12px;
    }
  }
  &_base {
    border-bottom: 5px solid #dadada;
    margin-bottom: 10px;
    padding-bottom: 5px;
    li {
      text-align: left;
      font-size: 12px;
      text-indent: 5px;
    }
  }
}
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
.checkPiliang .el-button {
  padding: 6px 12px;
  background: #ff6e40;
  color: #fff;
  margin-top: 20px;
  margin-left: 40px;
  float: left;
}
//审核不通过下拉框
.selectOut {
  margin-top: 12px !important;
  //top: 278px !important;
  //下拉框
  .el-scrollbar {
    .el-select-dropdown__wrap
      .el-select-dropdown__list
      .el-select-dropdown__item {
      padding: 0 14px;
    }
  }
  //箭头
  .popper__arrow {
    left: 188px !important;
  }
}
.searchList {
  /*  height: 52px; */
  margin-bottom: 10px;
  background: #fff;
  .el-col {
    .el-form {
      height: 55px;
      padding-left: 25px;
      &:after {
        content: "";
        display: block;
        clear: both;
      }
      .el-form-item:nth-of-type(1),
      .el-form-item:nth-of-type(2) {
        margin-bottom: 0;
        float: left;

        .el-form-item__label {
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content {
          line-height: 52px;
          .el-input {
            width: 125px;

            .el-input__inner {
              border-radius: 18px;

              padding-left: 5px;
            }
          }
        }
      }
      .el-form-item:nth-of-type(3) {
        margin-bottom: 0;
        float: left;

        .el-form-item__label {
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content {
          line-height: 52px;
          .el-input {
            width: 90px;

            .el-input__inner {
              border-radius: 18px;

              text-align: center;
            }
          }
        }
      }
      .el-form-item:nth-of-type(4) {
        margin-bottom: 0;
        float: left;

        .el-form-item__label {
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content {
          line-height: 52px;
          .el-date-editor {
            border-radius: 18px;
            .el-input__inner {
              text-align: center;
            }
          }
        }
      }
      .el-form-item:nth-of-type(5) {
        margin-bottom: 0;
        float: left;

        .el-form-item__label {
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content {
          line-height: 52px;
          .el-button {
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
</style>
