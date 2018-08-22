<template>
  <div class='noticePlan'>
    <!-- 查询 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >医生姓名</label>
        <el-input v-model.trim="searchParams.brxm" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系方式</label>
        <el-input v-model.trim="searchParams.mobile" clearable placeholder="请输入联系方式"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >所属科室</label>
        <el-input v-model.trim="searchParams.department" clearable placeholder="请输入所属科室"></el-input>
      </li>
       <li class="common_search_single">
          <label class="radio-label" >随访方案</label>
          <el-input v-model='searchParams.schemeName' placeholder='请输入随访方案' clearable></el-input>
      </li>
      <li class="common_search_single common_search_single_date">
          <label class="radio-label" >预约时间</label>
          <el-date-picker
            @change='timeChange'
            v-model='createTime'
            type="datetimerange"
            :picker-options="pickerTime"
            value-format='yyyy-MM-dd HH:mm:ss'
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            align="right">
          </el-date-picker>
      </li>
      <li class="common_search_single">
          <el-button type="primary" @click.native="searchFun" icon="el-icon-search">查询</el-button>
      </li>
    </ul>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
				<el-tabs v-model='activeName' @tab-click='handleClick'>
			    <el-tab-pane label='看诊通知列表' name='first'>
			    	<el-table
              border
              :data='tableData_list.list'
              @selection-change='selectChange'
              v-loading='tableData_list.loading'
              ref='multipleTable'>
			    		<el-table-column type='selection' align='center'></el-table-column>
			    		<el-table-column prop='brxm' label='医生姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
              <el-table-column prop='department' label='所属科室' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='schemeName' label='方案名称' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column prop='orderTime' label='预约看诊时间' align='center'></el-table-column>
              <el-table-column prop='visitStartTime' label='AI通知时间' align='center'></el-table-column>
			    		<el-table-column label='操作' width='200' align='center'>
			    			<template slot-scope='scope'>
                  <el-button type='danger' @click='passoutBtn(scope.row.taskId)' size='mini' v-show="scope.row.status!=6">终止</el-button>
                  <el-button type='primary' @click='showInfo(scope)' size='mini'>详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
			    	<el-row v-if='tableData_list.list.length' style='margin-top: 11px;'>
              <!-- 批量通过 -->
              <el-col :span='12'>
                <el-button type='danger' size="mini" @click='numCheck'>批量终止</el-button>
              </el-col>
              <!-- 分页 -->
              <el-col :span='12'>
                <el-pagination
                  @current-change='handleCurrentChange'
                  :current-page.sync='tableData_list.pager'
                  :page-size='10'
                  layout='total,prev, pager, next, jumper'
                  :total='tableData_list.totalPage'
                  v-if='tableData_list.totalPage'>
                </el-pagination>
              </el-col>
            </el-row>
			    </el-tab-pane>
			    <el-tab-pane label='已终止通知' name='second'>
						<el-table border :data='tableData_stop.list' style='width: 100%;' v-loading='tableData_stop.loading'>
			    		<el-table-column prop='brxm' label='医生姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
              <el-table-column prop='department' label='所属科室' align='center' show-overflow-tooltip ></el-table-column>
			    		<el-table-column prop='schemeName' label='方案名称' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column prop='orderTime' label='预约看诊时间' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='visitStartTime' label='通知开始时间' align='center'></el-table-column>
              <el-table-column prop='notPassReason' label='终止原因' align='center' show-overflow-tooltip></el-table-column>
              <el-table-column prop='dateUpdate' label='终止时间' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column label='操作' align='center'>
			    			<template slot-scope='scope'>
                  <el-button
                  type='primary'
                  @click='showInfo(scope)'
                  size='mini'>详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
			    	<el-row v-if='tableData_stop.totalPage'>
              <!-- 分页 -->
              <el-col :span='12' style='margin-top: 11px; float:right;' :offset="12">
                <el-pagination
                  @current-change='handleCurrentChange'
                  :current-page.sync='tableData_stop.pager'
                  :page-size='10'
                  layout='total,prev, pager, next, jumper'
                  :total='tableData_stop.totalPage'>
                </el-pagination>
              </el-col>
            </el-row>
					</el-tab-pane>
			  </el-tabs>
			</el-col>
		</el-row>
		<!-- 审核不通过 -->
		<el-dialog title='终止原因' :visible.sync='noCheck' width='450px' :center = 'false' custom-class='checknoPass'>
			<el-row slot>
				 <el-col :span='24' >
					<el-select v-model='selectCheck' placeholder='请选择' @change='changeSelect' style="width: 80%;" >
						<el-option  v-for='item in checkoptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
					</el-select>
				</el-col>
         <el-col :span='24' >
					<el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            placeholder="请输入内容"
            v-model="notPassRemark"
            style="margin-top: 20px;width: 80%">
          </el-input>
				</el-col>
				<el-col
					:span='24'
					class='btnCheck'
					style='margin-top:28px;'
					>
					<el-button type='primary' @click='noothroughCkeck'>确定</el-button>
					<el-button type='info' @click='resetBtn'>取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
    	<!-- 随访计划 -->
		<plan
      :planDg='planDg'
      @closeChildrenPlan='closeChildrenPlan'></plan>
    <!-- 特约门诊 -->
    <not-pass-dialog ref="notPassDialog" :checkId="checkId" @getNotPassReason="getNotPassReason">
    </not-pass-dialog>
  </div>
</template>
<script>
import Plan from '@/components/dialog/plan/plan';
import { AdmissionNotice } from 'RJZL_API/hospitalNotice';
import { specialDoctor } from 'RJZL_API/specialDoctor';
import notpassReasonOptions from './notpassReason';
import NotPassDialog from './notPassDialog';
import * as utilsIndex from 'utils';
import Cookies from 'js-cookie';
const tableName = ['list', 'stop'];
export default {
  name: 'noticePlan',
  data() {
    return {
      userId: Cookies.get('userId'),
      searchParams: {
        // adminId: sessionStorage.getItem('userId'),
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        activeType: '10', // 类型 9胃肠镜通知;10特约门诊通知 ,
        brxm: '', // 医生姓名 ,
        department: '', // 医生所属科室 ,
        mobile: '', // 联系电话 ,
        orderTimeEnd: '', // 医生预约结束看诊时间 ,
        orderTimeStart: '', // 医生预约开始看诊时间 ,
        schemeName: '', // 方案名称 ,
        status: '1' // 1:看诊通知列表 2:已终止通知
      },
      tableData_list: { // 入院通知
        list: [],
        pager: 1,
        totalPage: null,
        loading: false,
        status: '1'
      },
      tableData_stop: { // 已终止通知
        list: [],
        pager: 1,
        totalPage: null,
        loading: false,
        status: '2'
      },
      activeName: 'first', // tab
      diseaseList: [] /* 疾病列表 */,
      checkoptions: notpassReasonOptions, // 审核不通过原因
      selectCheck: '', // 选中的审核不通过
      notPassRemark: '', // 审核不通过原因
      checkId: [], // 随访通过的id(多选时),
      noCheck: false, // 审核不通过弹框
      planDg: false, // 详情弹窗
      tabIndex: '0', // tab 0:入院通知，1：已终止通知
      pickerTime: {
        shortcuts: utilsIndex.pickerOptions
      },
      createTime: [], /* 创建时间 */
    };
  },
  components: {
    Plan,
    NotPassDialog
  },
  mounted() {
    this.getData(this.tableData_list);
  },
  methods: {
    /** 选择预约时间 */
    timeChange(time) {
      if(time) {
        this.searchParams.orderTimeStart = time[0];
        this.searchParams.orderTimeEnd = time[1];
      } else {
        this.searchParams.orderTimeStart = '';
        this.searchParams.orderTimeEnd = '';
      }
    },
    /** 查询 */
    searchFun() {
      const getTableName = `tableData_${tableName[this.tabIndex]}`;
      this[getTableName].pager = 1;
      this.getData(this[getTableName]);
    },
    /* 获取数据 */
    getData(param) {
      param.loading = true;
      specialDoctor.specialList({
        ...this.searchParams,
        status: param.status,
        pager: param.pager
      })
        .then(res => {
          
          if(this.tabIndex == 1) {
            this.formatNotpassReason(res.data);
          }
          param.list = res.data;
          param.totalPage = res.total;
          param.loading = false;
        }).catch(err => {
          param.loading = false;
        });
    },
    /** 不通过原因 */
    formatNotpassReason(data) {
       data.forEach(item => {
         if(item.notPassReason === '1') {
          item.notPassReason =  '医生已死亡'
        } else if(item.notPassReason === '2') {
          item.notPassReason =  '医生不接受随访'
        } else if(item.notPassReason === '3') {
          item.notPassReason =  '随访方案重复'
        } else if(item.notPassReason === '4') {
          item.notPassReason =  '方案不匹配'
        }else if(item.notPassReason === '5') {
          item.notPassReason =  '其他'
        }else if(item.notPassReason === '6') {
          item.notPassReason =  '医生已删除'
        }
      })
    },

    /* 展示随访计划详情 */
    showInfo(scope) {
      this.planDg = true;
      // 添加来源为特约门诊
      scope.row.from = 'tymn';
      this.$store.dispatch('getScopeRowData', scope);
    },
    /**
     *审核不通过的原因
    *@function changeSelect
    *@param {String} value 审核不通过的原因
    */
    changeSelect(value) {
      this.selectCheck = value;
    },
    /** 批量审核选择患者 */
    selectChange(selection) {
      this.checkId.length = 0;
      if(selection.length){
        // 判断是否是已完成，是的话不能被选择，否的话可以被选择
        selection.forEach(item => {
          if(item.status!=6) {
            this.checkId.push(item.taskId);
          }else {
            this.$refs.multipleTable.toggleRowSelection(item, false)
            let cannotCheck = selection.length-this.checkId.length
            if(cannotCheck>1){
              this.$message.warning(`${cannotCheck}条通知计划已完成，不能被终止！`)
            }else{
              this.$message.warning(`该条条通知计划已完成，不能被终止！`)
            }
            
          }
        });
      }
    },
    /**
     *弹框点击不通过确定
    *@function noothroughCkeck
    *@description 点击表格操作弹框不通过
    */
    noothroughCkeck() {
      if (this.selectCheck) {
        this.handleCheck(this.checkId, this.selectCheck);
      }
    },
    /** 取消 */
    resetBtn() {
      this.noCheck = false;
      this.selectCheck = '';
      this.notPassRemark = '';
      this.checkId.length = 0;
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
    handleCheck(ids, notPassReason) {
      AdmissionNotice
        .cancelNotice({
          adminId: this.userId,
          ids: ids,
          notPassReason: notPassReason,
          notPassRemark: this.notPassRemark
        })
        .then(res => {
          if (res.code === '0') {
            this.noCheck = false;
            this.selectCheck = '';
            this.notPassRemark = '';
            this.checkId.length = 0;
            const getTableName = `tableData_${tableName[this.tabIndex]}`;
            this.getData(this[getTableName]);
          }else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {});
    },
    /**
     * [handleClick description] 切换tab
     */
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      const getTableName = `tableData_${tableName[this.tabIndex]}`;
      this.getData(this[getTableName]);
    },
    /**
     * 分页
     */
    handleCurrentChange(page) {
      const getTableName = `tableData_${tableName[this.tabIndex]}`;
      this.getData(this[getTableName]);
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
    // 部分通过
    numCheck() {
      if (this.checkId.length === 0) {
        this.$message.error('请选择患者！');
        return false;
      }
     this.$refs.notPassDialog.noCheckDg = true
    },
    /**
     * [lang description]表格通过按钮
     * @type {String}
     */
    passoutBtn(id) {
      this.checkId.length=0;
      this.checkId.push(id);
      this.$refs.notPassDialog.noCheckDg = true
    },
    /** 监听详情的关闭操作 */
    closeChildrenPlan(val) {
      this.planDg = false;
      const getTableName = `tableData_${tableName[this.tabIndex]}`;
      this.getData(this[getTableName]);
    },
    /** 监听审核，成功后刷新页面 */
    getNotPassReason(item) {
      if(item) {
        const getTableName = `tableData_${tableName[this.tabIndex]}`;
        this.getData(this[getTableName]);
      }
    }
  }
};
</script>
<style lang='scss'>
  @import '~styles/search';
  .noticePlan {
    .checknoPass .el-dialog__body{
      text-align: center;
    }
  }
</style>