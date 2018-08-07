<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="请输入患者姓名"  v-model.trim="searchParam.brxm"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input  placeholder="请输入患者电话"  v-model.trim="searchParam.mobile"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >科室</label>
        <el-cascader
          :options="departMentList"
          v-model="medGpId"
          @change="getDepartchange"
          filterable
          clearable
        >
        </el-cascader>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">就诊时间</label>
        <el-date-picker
          v-model="time_disease"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
          @change="diseaseTime" >
        </el-date-picker>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search"  @click="searchData"
                   :loading="params[0].loading || params[1].loading || params[2].loading">查询</el-button>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane v-for="item,index in params" :label="index==='0' ? `${item.label}(${item.total})` : `${item.label}`" :key="index">
        <el-table
          :data="item.tableData"
          border highlight-current-row
          v-loading="item.loading"
          @selection-change="handleSelectionChange"
          :ref="`multipleTable${index}`"
        >
          <el-table-column type="selection" width="55" align="center" v-if="index === '0'"></el-table-column>
          <el-table-column prop="brxm" label="姓名" align="center" width="120px"></el-table-column>
          <el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="schemeName" label="方案名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="medGpName" label="科室" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderTime" label="就诊时间" align="center" show-overflow-tooltip></el-table-column>
          <!--  <el-table-column prop="visitStartTimeStr" label="计划开始日期" align="center">
           </el-table-column> -->
          <el-table-column label="审核" align="center" width="160" v-if="index === '0'">
            <template slot-scope="scope">
              <el-button size="mini" @click="throughCkeck(scope)">通过</el-button>
              <el-button size="mini" @click="noThroughCkeck(scope)">不通过</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="notPassReason" label="未通过原因" align="center" show-overflow-tooltip v-if="index === '3'">
            <template slot-scope="scope">
              {{scope.row.notPassReason==1?"患者已死亡":scope.row.notPassReason==2?"患者不接受随访":scope.row.notPassReason==3?"随访方案重复":"方案不匹配"}}
            </template>
          </el-table-column>
          <template v-if="index !== '0'">
            <el-table-column prop="operator" label="审核人" align="center"></el-table-column>
            <el-table-column prop="dateUpdate" label="审核时间" align="center" show-overflow-tooltip></el-table-column>
          </template>
          <el-table-column label="详情" align="center" width="140">
            <template slot-scope="scope">
              <el-button type="primary" @click.stop="getInfo(scope)" size="mini">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
          <!-- 分页 -->
          <div class="pagination-container">
            <div style="margin-left: 10px;float: left;" v-if="item.tableData.length && index === '0'">
              <el-button type="primary" @click="toggleSelection(item.tableData)">全选</el-button>
              <el-button type="primary" @click="numCheck">批量通过</el-button>
              <el-button type="primary" @click="numCheckFail">批量不通过</el-button>
            </div>
            <el-pagination  @current-change="pageChange" :current-page.sync="item.page" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                            :total="item.total" v-if="item.total">
            </el-pagination>
          </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 审核不通过 -->
    <el-dialog title="审核不通过原因" :visible.sync="noCheck" width="350px" :center = "false" custom-class="checknoPass">
      <el-select v-model="selectCheck" placeholder="请选择" @change="changeSelect" popper-class="selectOut">
        <el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="noothroughCkeck" type="primary">确定</el-button>
        <el-button @click="noCheck=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
       
    <plan-record
      ref="record"
      :baseData="infoData"
      :planInfo="infoMessage"
    >
    </plan-record>

  </div>
</template>

<script>
/**
 * 随访计划
 * @module followParam
 */
import { MySurvey } from 'HNDC_API/MySurvey';
import { CommonAPI } from 'HNDC_API/common';
import PlanRecord from "./Pop-ups/PlanRecord";
const base_param = {
  page: 1,
  total: 0,
  loading: false,
  tableData: []
};
export default {
  components:{
    PlanRecord
  },
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
        adminId: this.$store.state.user.token, // 医生ID
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
      params: {
        0: {
          ...base_param,
          label: '待审核',
          status: 4
        },
        1: {
          ...base_param,
          label: '已通过',
          status: 1
        },
        2: {
          ...base_param,
          label: '未通过',
          status: 2
        }
      },
      deparmentId: [],
      departMentList: [] /* 科室 */,
      groupList: [] /* 医疗组 */,
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
      pickerOptionsShortcuts:  // 时间日期选择器的快捷方式数据
        {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date(new Date().setHours(23, 59, 59, 59));
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date(new Date().setHours(23, 59, 59, 59));
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date(new Date().setHours(23, 59, 59, 59));
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  
  mounted() {
    this.getUserId();
    this.getDepartMentList();
    this.getGroupList();
    this.getData();
  },
  methods: {
    getInfoData(item) {
      CommonAPI
        .getPatientRecord({
          adminId: this.userId,
          patientId: item.hzxxId
        })
        .then(res => {
          this.infoData = res.data;
          this.infoData.mobile = item.mobile;
          this.infoData.medGpName = item.medGpName;
          this.infoData.departmentName = item.departmentName;
        });
        this.getInfoMessage(item.id);
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
      this.userId = this.$store.state.user.token; // 用户名
    },
    /**
     * @description 获取表格数据
     * @function getData
     * @param  {type} param {description}
     * @return {type} {description}
     */
    getData() {
      const param = this.params[this.tabActive];
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
     * 分页
     * @function pageChange
     * @param {String} page 当前页码
     * @description
     */
    pageChange(page) {
      this.params[this.tabActive].page = page;
      this.getData();
    },
    /**
     * 数据查询
     * @function searchData
     * @param {String} 1 返回第一页
     */
    searchData() {
      this.params[this.tabActive].page = 1;
      this.getData();
    },
    /**
     * 获取详情
     * @function getInfo
     * @param {Object} scope 点击列表的scope的信息
     */
    async getInfo(scope) {
      this.infoData.medGpName = scope.row.medGpName;
      const res = await this.getInfoData(scope.row);
      this.$refs.record.recordVisible=true;
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
      this.getData();
    },
    /**
     *待审核表格全选
     *@function toggleSelection
     *@param {object} rows 选中的行（参见element-ui的table-rows）
     */
    toggleSelection(rows) {
      // element-ui自带的方法
      this.$refs.multipleTable0[0].toggleAllSelection();
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
            this.getData();
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
<style lang="scss" scoped>
  @import '../../../styles/HN_DoctorClient/surveyPlan.scss';
</style>
