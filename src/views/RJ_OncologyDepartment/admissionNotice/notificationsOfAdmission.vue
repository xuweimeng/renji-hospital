<template>
  <div class='notificationsOfAdmission'>
    <!-- 查询 -->
		<el-row class='common-search'>
			<el-form :inline='true' :model='searchParams' label-position='center' label-width='80px'>
			  <el-col :span='6'>
			  	<el-form-item label='姓名'>
				    <el-input v-model='searchParams.brxm' placeholder='请输入患者姓名' clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='6'>
			  	<el-form-item label='联系电话'>
				    <el-input v-model='searchParams.mobile' placeholder='请输入患者联系电话' clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='6'>
			  	<el-form-item label='随访方案'>
				    <el-input v-model='searchParams.schemeName' placeholder='请输入随访方案' clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='6'>
			  	<el-form-item label='疾病名称'>
					  <el-select
							v-model='searchParams.icdName'
							filterable
							remote
              clearable
							reserve-keyword
							placeholder='请输入疾病类型'
							:remote-method='remoteMethod'
              :loading='queryLoading'
							>
							<el-option
								v-for='item in diseaseList'
								:key='item.id'
								:label='item.jbmc'
								:value='item.jbmc'>
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span='6'>
			  	<el-form-item label='性别'>
				    <el-select v-model='searchParams.brxb' placeholder='性别'>
				      <el-option label='全部' value=''></el-option>
				      <el-option label='男' value='男'></el-option>
				      <el-option label='女' value='女'></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span='6'>
			  	<el-form-item label='年龄'>
				  	<el-row>
				  		<el-col :span='11'><el-input v-model='searchParams.ageBegin' placeholder='0'></el-input></el-col>
				  		<el-col :span='2' style='text-align: center;'>-</el-col>
				  		<el-col :span='11'><el-input v-model='searchParams.ageEnd'></el-input></el-col>
				  	</el-row>
			  	</el-form-item>
			  </el-col>
			  <el-col :span='6'>
			  	<el-button type='primary' @click='getData'>查询</el-button>
			  </el-col>

			</el-form>
		</el-row>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
				<el-tabs v-model='activeName' @tab-click='handleClick'>
			    <el-tab-pane label='入院通知' name='first'>
			    	<el-table
              border
              :data='tableData_list.list'
              @selection-change='selectChange'
              v-loading='tableData_list.loading'
              ref='multipleTable'>
			    		<el-table-column type='selection' align='center'></el-table-column>
			    		<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
			    		<el-table-column label='性别/年龄' align='center' width='100'>
                <template slot-scope='scope'>
                  {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop='schemeName' label='通知方案' width='200' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='icdName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='orderTime' label='入院时间' align='center'></el-table-column>
              <el-table-column prop='visitStartTime' label='通知开始时间' align='center'></el-table-column>
			    		<el-table-column prop='name' label='操作' width='200' align='center'>
			    			<template slot-scope='scope'>
                  <el-button type='danger' @click='passoutBtn(scope.row.id)' size='mini'>终止</el-button>
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
			    		<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
			    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
			    		<el-table-column label='性别/年龄' align='center' width='100'>
                <template slot-scope='scope'>
                  {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop='schemeName' label='通知方案' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='icdName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
			    		<el-table-column prop='visitStartTime' label='通知开始时间' align='center'></el-table-column>
			    		<el-table-column prop='name' label='操作' align='center'>
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
					<el-select v-model='selectCheck' placeholder='请选择' @change='changeSelect' popper-class='selectOut'>
						<el-option  v-for='item in checkoptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
					</el-select>
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
    <!-- 通知详情 -->
		<el-dialog :visible.sync='infoShow' title='通知计划详情' class-name='sfjhModel' >
      <el-row class='sfjhContent'>
        <el-row class='patientMs'>
          <el-col :span='4' :offset='4' class='hzName'>{{infoParams.znjqrHzxx.brxm}}</el-col>
          <el-col :span='16' class='hzxq'>{{infoParams.znjqrHzxx.brxb}}
          <span>/</span>{{infoParams.znjqrHzxx.age}}</el-col>
        </el-row>
        <el-row class='patientMs2'>
          <el-col :span='4' :offset='4' class='hzXx1'>疾病诊断:</el-col>
          <el-col :span='16' class='hzXx2'>{{infoParams.icdName}}</el-col>
        </el-row>
        <el-row class='patientMs2'>
          <el-col :span='4' :offset='4' class='hzXx1'>电话号码:</el-col>
          <el-col :span='16' class='hzXx2'>{{infoParams.znjqrHzxx.jtdh}}</el-col>
        </el-row>
        <el-row class='patientMs2'>
          <el-col :span='4' :offset='4' class='hzXx1'>就诊日期:</el-col>
          <el-col :span='16' class='hzXx2'>{{infoParams.visitStartTime}}</el-col>
        </el-row>
        <!-- 随访模板 -->
        <el-row class='patientMs2 gray'>
          <el-col :span='4' :offset='4' class='hzXx1'>通知方案:</el-col>
          <el-col :span='16' class='hzXx2'>{{infoParams.schemeName}}</el-col>
        </el-row>
        <el-row class='patientMs2 gray'>
          <el-col :span='4' :offset='4' class='hzXx1'>通知进度:</el-col>
          <el-col :span='16' class='hzXx2'>{{infoParams.totalNum}}</el-col>
        </el-row>
        <!-- 随访计划时间 -->
        <el-row style='height:500px;overflow-y:auto;'>
          <el-row class='gray' style='font-size:14px;padding-top:20px;' v-for='(item,index) in infoParams.orders' :key='index'>
            <el-col :span='20' :offset='4'>{{item.startDate}}</el-col>
            <el-row style='padding-left:200px;'>
              <el-col :span='6' v-for='(item1,index1) in (item.CollectionIndex.split(','))' :key='index1+1' style='line-height:30px;'>{{item1}}</el-col>
            </el-row>
          </el-row>
        </el-row>
      </el-row>
      <el-row slot='footer'>
      </el-row>
    </el-dialog>
    	<!-- 随访计划 -->
		<plan
      :planDg='planDg'
      @closeChildrenPlan='closeChildrenPlan'></plan>
  </div>
</template>
<script>
import Plan from '@/components/dialog/plan/plan';
import { AdmissionNotice } from 'RJZL_API/hospitalNotice';
import auditOptions from 'utils/auditOptions'
const tableName = [ 'list', 'stop'];
export default {
  name: 'notificationsOfAdmission',
  data() {
    return {
      searchParams: {
        adminId: sessionStorage.getItem('userId'),
        pager: 1, //当前页码
        limit: 10, //每页条数
        brxm: '', //患者姓名（可选）
        mobile: null, //；联系方式（可选）
        brxb: '', //病人性别（可选）
        schemeName: '', //随访方案（可选）
        ageBegin: null, //开始年龄（可选）
        ageEnd: null, //结束年龄（可选）
        status:null //默认显示入院通知列表，赋值显示已终止通知列表
      },
      tableData_list: { // 入院通知
        list: [],
        pager: 1,
        totalPage: null,
        loading: false,
        status: null
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
      checkoptions: auditOptions, // 审核不通过原因
      infoShow: false /* 通知计划详情显示 */,
      infoParams: {
        znjqrHzxx: {
          brxm: ''
        }
      },
      selectCheck: '', // 选中的审核不通过
      checkId: [], // 随访通过的id(多选时),
      noCheck: false, // 审核不通过弹框
      queryLoading: false,
      planDg: false, // 详情弹窗
      tabIndex: '0' // tab 0:入院通知，1：已终止通知
    };
  },
  components: {
    Plan
  },
  mounted() {
    this.getData(this.tableData_list);
  },
  methods: {
    /**
     * 疾病远程搜索
     */
    remoteMethod(query) {
      this.queryLoading = true;
      if (query === '') {
        return false;
      }
      this.diseaseList = [];
      AdmissionNotice.getDisease({
        jbmc: query
      })
        .then(res => {
          this.queryLoading = false;
          this.diseaseList = res.data;
        })
        .catch(error => {});
    },
    /* 获取数据 */
    getData(param) {
      param.loading1 = true
      AdmissionNotice.getPlan({
        ...this.searchParams,
        status: param.status,
        pager: param.pager
      })
        .then(res => {
          param.list = res.data
          param.totalPage = res.total;
          param.loading = false;
      }).catch( err => {
        param.loading = false;
      });
    },

    /* 展示随访计划详情 */
    showInfo(scope) {
      this.planDg = true
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
    selectChange(selection){
      this.checkId.length = 0;
      selection.forEach( item => {
        this.checkId.push(item.id)
      })
    },
    /**
     *弹框点击不通过确定
    *@function noothroughCkeck
    *@description 点击表格操作弹框不通过
    */
    noothroughCkeck() {
      if(this.selectCheck){
        this.handleCheck(this.checkId, this.selectCheck);
      }
    },
    /** 取消 */
    resetBtn () {
      this.noCheck = false
      this.selectCheck = ''
      this.checkId.length = 0
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
    handleCheck( ids, notPassReason) {
      AdmissionNotice
        .cancelNotice({
          ids: ids,
          notPassReason: notPassReason,
          notPassRemark: '终止计划'
        })
        .then(res => {
          if (res.code == 0) {
            this.noCheck = false;
            this.selectCheck = ''
            this.checkId.length = 0
            const getTableName = `tableData_${tableName[this.tabIndex]}`
            this.getData(this[getTableName])
          }
        })
        .catch(error => {});
    },
    /**
     * [handleClick description] 切换tab
     */
    handleClick(tab, event) {
      this.tabIndex = tab.index
      const getTableName = `tableData_${tableName[this.tabIndex]}`
      this.getData(this[getTableName])
    },
    /**
     * 分页
     */
    handleCurrentChange(page) {
      const getTableName = `tableData_${tableName[this.tabIndex]}`
      this.getData(this[getTableName])
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
        this.$message.error('请选择患者！')
        return false;
      }
      this.noCheck = true;
    },
    /**
     * [lang description]表格通过按钮
     * @type {String}
     */
    passoutBtn(id) {
      this.checkId.push(id)
      this.noCheck = true;
    },
    /** 监听详情的关闭操作 */
    closeChildrenPlan(val) {
      this.planDg = false;
    }
  }
}
</script>
<style lang='scss'>
  @import '~styles/search';
  .notificationsOfAdmission {
    .checknoPass {
      text-align: center;
    }
  }
</style>