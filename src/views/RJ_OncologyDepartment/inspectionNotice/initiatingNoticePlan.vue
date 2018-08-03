<template>
  <div class='initiatingNoticePlan'>
    <!-- 查询 -->
    <el-row class='common-search'>
			<el-form :inline='true' :model='searchParams' label-position='center' label-width='80px'>
			  <el-col :span='5'>
			  	<el-form-item label='姓名'>
				    <el-input v-model='searchParams.name' placeholder='请输入患者姓名' clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='5'>
			  	<el-form-item label='联系电话'>
				    <el-input v-model='searchParams.mobile' placeholder='请输入患者联系电话' clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='5'>
			  	<el-form-item label='检查项目'>
				    <el-select v-model='searchParams.icdCheckItem' clearable filterable  placeholder='请选择'>
				      <el-option
                v-for='item in ProjectList'
                :key='item.icd10'
                :label='item.jbmc'
                :value='item.icd10'>
               </el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span='6'>
          <el-form-item label='检查时间' class='formTime'>
            <el-date-picker
              v-model='startTime'
              @change='timeChange'
              type="daterange"
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
              :picker-options="pickerTime">
            </el-date-picker>
          </el-form-item>
			  </el-col>
			  <el-col :span='3'>
			  	<el-button type='primary' @click='searchBtn'>查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
				<el-tabs v-model='activeName' @tab-click='handleClick'>
			    <el-tab-pane label='检查通知列表' name='first'>
			    	<el-table
              border
              :data='tableData_list.list'
              @selection-change='selectChange'
              v-loading='tableData_list.loading'
              style='width: 100%;'
              ref='multipleTable'>
			    		<el-table-column type='selection' align='center'></el-table-column>
			    		<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column label='性别/年龄' align='center'>
                <template slot-scope='scope'>
                  {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop='icdName' label='检查项目' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='orderTime' label='检查时间' align='center'></el-table-column>
              <el-table-column prop='visitStartTime' label='通知开始时间' align='center'></el-table-column>
			    		<el-table-column label='操作' align='center' width='180'>
			    			<template slot-scope='scope'>
                  <el-button type='primary' @click='showInfo(scope.row)' size='mini'>详情</el-button>
                  <el-button type='danger' @click='passoutBtn(scope.row.id)' size='mini'>终止</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
            <!-- 分页 -->
			    	<el-row v-if='tableData_list.totalPage' style="padding-top: 20px;">
              <el-col :span='12' v-if='tableData_list.totalPage'>
                <el-button type='danger' @click='numCheck' size='small'>批量终止</el-button>
              </el-col>
              <el-col :span='12'>
                <el-pagination
                  @current-change='handleCurrentChange'
                  :current-page.sync='tableData_list.pager'
                  :page-size='10'
                  layout='total,prev, pager, next, jumper'
                  :total='tableData_list.totalPage' v-if='tableData_list.totalPage'>
                </el-pagination>
              </el-col>
            </el-row>
			    </el-tab-pane>
			    <el-tab-pane label='已终止通知' name='second'>
						<el-table
              border
              :data='tableData_stop.list'
              style='width: 100%;'
              v-loading='tableData_stop.loading'>
			    		<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' width='190' show-overflow-tooltip></el-table-column>
			    		<el-table-column label='性别/年龄' align='center'>
                <template slot-scope='scope'>
                  {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop='icdName' label='检查项目' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='orderTime' label='检查时间' align='center'></el-table-column>
              <el-table-column prop='visitStartTime' label='通知开始时间' align='center'></el-table-column>
			    		<el-table-column label='操作' align='center'>
			    			<template slot-scope='scope'>
                  <el-button
                  type='primary'
                  @click='showInfo(scope.row)'
                  size='mini'>详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
            <!-- 分页 -->
			    	<el-row v-if='tableData_stop.totalPage' style="padding-top: 20px;">
              <el-col :span='12' :offset="12">
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
		<el-dialog title='终止原因'
      :visible.sync='noCheck'
      width='450px'
      :before-close = 'dgFailBtn'
      :center = 'false'
      style='text-align: center;'>
			<el-row slot>
				 <el-col :span='24' >
					<el-select v-model='selectCheck' placeholder='请选择终止原因' popper-class='selectOut' style='width: 350px;'>
						<el-option  v-for='item in checkoptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
					</el-select>
				</el-col>
        <el-col :span='24'>
          <el-input
            type='textarea'
            :autosize='{ minRows: 3, maxRows: 6 }'
            placeholder='请输入详情(必填)'
            v-model='notPassRemark'
            style='width:350px;margin-top: 20px'>
          </el-input>
        </el-col>
				<el-col
					:span='24'
					style='margin-top:28px;text-align: center;'>
					<el-button type='primary' @click='dgPassBtn' style='margin-right: 30px;' size="small">确定</el-button>
					<el-button type='info' @click='dgFailBtn'  size="small">取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
    <!-- 检查详情 -->
		<!-- 步骤一已预约检查 -->
    <checked-list
      :infoShow2='infoShow'
      :checkListData='gridData'
      @closeDialog='closeList'>
    </checked-list>
  </div>
</template>
<script>
import { InspectionNotice } from 'RJZL_API/InitiateNotification';
import { commonUrl } from 'RJZL_API/commonUrl';
import auditOptions from 'utils/auditOptions'
import CheckedList from './checkedList/checkedList';
import * as utilsIndex from 'utils'
const tabPaneName = ['list', 'stop'];
export default {
  name: 'initiatingNoticePlan',
  data() {
    return {
      searchParams: {
        pager: 1, // 当前页码
        limit: 10, // 每页条数
        name: '', // 患者姓名（可选）
        mobile: '', // 联系方式（可选）
        icdCheckItem: '', // 随访方案（可选）
        startOrderTime: '', // 检查开始时间
        endOrderTime: '' // 检查结束时间
      },
      startTime: '',
      activeName: 'first', // tab
      tableData_list: {
        list: [],
        loading: false,
        pager: 1,
        totalPage: null,
        status: '0' // 0表示正常状态   4表示已终止
      },
      tableData_stop: {
        list: [],
        loading: false,
        pager: 1,
        totalPage: null,
        status: '4'
      },
      checkoptions: auditOptions, // 审核不通过options
      infoShow: false /* 通知计划详情显示 */,
      selectCheck: '', // 选中的审核不通过
      notPassRemark: '', // 不通过详情
      checkId: [], // 随访通过的id(多选时),
      checkString: '', // 多选字符串
      noCheck: false, // 审核不通过弹框
      planDg: false, // 详情弹窗
      tabIndex: '0', // tab 0:入院通知，1：已终止通知
      gridData: [], // 检查详情
      ProjectList: [], // 检查项目
      hzxxId: '', // 患者信息id
      pickerTime: {
        shortcuts: utilsIndex.pickerOptions
      },
    };
  },
  components: {
    CheckedList
  },
  mounted() {
    this.getProjectList();
    this.getData(this.tableData_list);
  },
  methods: {
    /* 获取数据 */
    getData(param) {
      param.loading = true;
      this.searchParams.pager = param.nowpager;
      InspectionNotice.queryCheckTask({
        ...this.searchParams,
        status: param.status,
        pager: param.pager
      })
      .then(res => {
        param.list = res.data;
        param.loading = false;
        if (param.pager === 1) {
          param.totalPage = res.count;
        }
      });
    },
    /** 查询列表 */
    searchBtn() {
      const param_name = `tableData_${tabPaneName[this.tabIndex]}`;
      this[param_name].pager = 1;
      this.getData(this[param_name]);
    },
    /** 获取检查项目列表 */
    getProjectList() {
      commonUrl.getdiseasefix({
        diseasetype: '2'
      }).then(res => {
        this.ProjectList = res.data;
      });
    },
    /** 创建时间更改 */
    timeChange(time) {
      if (time) {
        this.searchParams.startOrderTime = time[0] + ' ' + '00:00:00';
        this.searchParams.endOrderTime = time[1] + ' ' + '23:59:59';
      } else {
        this.searchParams.startOrderTime = '';
        this.searchParams.endOrderTime = '';
      }
    },
    /* 展示随访计划详情 */
    showInfo(rows) {
      this.infoShow = true;
      this.getDetails(rows);
    },
    /**
     * 关闭已预约的弹框
     */
    closeList(value) {
      this.infoShow = value;
    },
    /**
     * 获取详情数据
     */
    getDetails(rows) {
      InspectionNotice
        .queryCheckDetail({
          hzxxId: rows.hzxxId,
          orderTime: rows.orderTime,
        })
        .then(res => {
          if (res.code == 0) {
            this.gridData = res.data
          }else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {});
    },
    /** 审核多选的id集合 */
    selectChange(selection) {
      this.checkId.length = 0;
      selection.forEach(item => {
        this.checkId.push(item.id);
      })
    },
    /** 弹框点击不通过确定 */
    dgPassBtn() {
      if (!this.selectCheck) {
        this.$message.error('请选择终止原因!');
      } else if (!this.notPassRemark) {
        this.$message.error('请填写详情!');
      } else {
        this.checkString = this.checkId.join(',');
        this.handleCheck(this.checkString, this.selectCheck, this.notPassRemark);
      }
    },
    /** 终止原因--取消 */
    dgFailBtn() {
      this.checkId.length = 0
      this.noCheck = false;
      this.selectCheck = '';
      this.notPassRemark = '';
    },
    /**
     *审核功能
     *@function handleCheck
     *@description 审核功能均调用这一个函数
     *@param {String} ids 患者id集合,数组转字符串
     *@param {String} noPassReason 审核不通过原因
     */
    handleCheck(ids, notPassReason, notPassRemark) {
      InspectionNotice
        .stopCheckTask({
          adminId: sessionStorage.getItem('userId'),
          ids: ids,
          notPassReason: notPassReason,
          notPassRemark: notPassRemark
        })
        .then(res => {
          if (res.code === 0) {
            const param_name = `tableData_${tabPaneName[this.tabIndex]}`;
            this.getData(this[param_name]);
            this.checkId.length = 0;
            this.noCheck = false;
            this.selectCheck = '';
            this.notPassRemark = '';
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /** 切换tab */
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      const param_name = `tableData_${tabPaneName[tab.index]}`;
      this.getData(this[param_name]);
    },
    /**
     * 分页
     * @function handleCurrentChange
     */
    handleCurrentChange(page) {
      const param_name = `tableData_${tabPaneName[this.tabIndex]}`;
      this.getData(this[param_name]);
    },
    /** 批量终止 */
    numCheck() {
      if (this.checkId.length === 0) {
        this.$message.error('患者不能为空！');
        return false;
      }
      this.noCheck = true;
    },
    /** 表格终止按钮 */
    passoutBtn(id) {
      this.noCheck = true;
      this.checkId.push(id);
    }
  }
};
</script>
<style lang='scss'>
  @import '~styles/search';
</style>