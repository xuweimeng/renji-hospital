<template>
  <div class="dischargeFollowupPlanReview">
    <!-- 查询 -->
		<el-row class="common-search">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-col :span="6">
			  	<el-form-item label="患者姓名">
				    <el-input v-model.trim="formInline.brxm" placeholder="请输入患者姓名" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="联系电话">
				    <el-input v-model.trim="formInline.mobile" placeholder="请输入患者联系电话" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="随访方案">
				    <el-input v-model.trim="formInline.schemeName" placeholder="请输入随访方案" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="疾病名称">
						<el-select
              v-model="formInline.icdName"
              filterable
              remote
              clearable
              placeholder="请输入关键词"
              @change="handChange"
              :remote-method="remoteMethod"
              :loading="loadingSelect">
              <el-option
                v-for="(item, index) in icdNameList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="患者性别">
				    <el-select v-model="formInline.brxb" placeholder="性别">
				      <el-option label="全部" value=""></el-option>
				      <el-option label="男" value="男"></el-option>
				      <el-option label="女" value="女"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span="6">
			  	<el-form-item label="患者年龄">
				  	<el-row>
				  		<el-col :span="11"><el-input v-model="formInline.beginAge" placeholder="0"></el-input></el-col>
				  		<el-col :span="2" style="text-align: center;">-</el-col>
				  		<el-col :span="11"><el-input v-model="formInline.endAge"></el-input></el-col>
				  	</el-row>
			  	</el-form-item>
			  </el-col>
			  <el-col :span="6">
			  	<el-button type="primary" size="small" @click="searchBtn">查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
		<!-- 表格 -->
		<el-row class="common-table">
			<el-col :span="24">
				<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="待审核" name="first">
			    	<el-table
              border
							:data="tableData_list.list"
							style="width: 100%;"
							ref="multipleTable"
							v-loading="tableData_list.loading"
							@select="selectSingal"
							@select-all="selectAll">
			    		<el-table-column type="selection" align="center"></el-table-column>
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip ></el-table-column>
			    		<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-show="scope.row.brxb && scope.row.age >= 0">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
			    		<el-table-column prop="icdName" label="疾病名称" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="schemeName" label="随访方案" align="center"></el-table-column>
			    		<el-table-column prop="visitStartTime" label="计划开始时间" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="审核" width="180" align="center">
			    			<template slot-scope="scope">
                  <el-button type="success" @click="passBtn(scope)" size="mini">通过</el-button>
                  <el-button type="warning" @click="passoutBtn(scope)" plain size="mini">不通过</el-button>
                </template>
			    		</el-table-column>
			    		<el-table-column label="详情" align="center" width="80">
			    			<template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="lookDetailes(scope)">详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
			    	<el-row v-if="tableData_list.list.length" style="margin-top: 11px;">
              <!-- 批量通过 -->
              <el-col :span="12">
                <el-button type="primary" size="small" @click="numCheck">批量通过</el-button>
              </el-col>
              <!-- 分页 -->
              <el-col :span="12">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="tableData_list.pager"
                  :page-size="10"
                  layout="total,prev, pager, next, jumper"
                  :total="tableData_list.totalPage">
                </el-pagination>
              </el-col>
            </el-row>
			    </el-tab-pane>
			    <el-tab-pane label="已通过" name="second">
						<el-table
              border
							:data="tableData_pass.list"
							style="width: 100%;"
							v-loading="tableData_pass.loading">
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
			    		<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-show="scope.row.brxb && scope.row.age >= 0">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
			    		<el-table-column prop="icdName" label="疾病名称" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="visitStartTime" label="计划开始时间" align="center"></el-table-column>
			    		<el-table-column prop="operator" label="审核人" align="center"></el-table-column>
							<el-table-column prop="dateVet" label="审核时间" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="详情" align="center" width="80">
			    			<template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="lookDetailes(scope)">详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
						<el-row v-if="tableData_pass.list.length" style="margin-top: 11px;">
              <!-- 分页 -->
              <el-col :span="12" :offset="12">
                <el-pagination
								  @current-change="handleCurrentChange"
								  :current-page.sync="tableData_pass.pager"
								  :page-size="10"
								  layout="total,prev, pager, next, jumper"
                  :total="tableData_pass.totalPage">
                </el-pagination>
              </el-col>
            </el-row>
					</el-tab-pane>
			    <el-tab-pane label="未通过" name="third">
						<el-table
              border
							:data="tableData_nopass.list"
							style="width: 100%;"
							v-loading="tableData_nopass.loading">
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
			    		<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-show="scope.row.brxb && scope.row.age >= 0">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
			    		<el-table-column prop="icdName" label="疾病名称" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="notPassReason" label="未通过原因" align="center"></el-table-column>
			    		<el-table-column prop="operator" label="审核人" align="center"></el-table-column>
							<el-table-column prop="dateVet" label="审核时间" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="详情" align="center" width="80">
			    			<template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="lookDetailes(scope)">详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
						<el-row v-if="tableData_nopass.list.length" style="margin-top: 11px;">
              <!-- 分页 -->
              <el-col :span="12" :offset="12">
                <el-pagination
									@current-change="handleCurrentChange"
									:current-page.sync="tableData_nopass.pager"
									:page-size="10"
									layout="total,prev, pager, next, jumper"
                  :total="tableData_nopass.totalPage">
                </el-pagination>
              </el-col>
            </el-row>
					</el-tab-pane>
					<el-tab-pane label="已终止" name="fourth">
						<el-table
              border
							:data="tableData_stop.list"
							style="width: 100%;"
							v-loading="tableData_stop.loading">
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center"></el-table-column>
			    		<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-show="scope.row.brxb && scope.row.age >= 0">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
			    		<el-table-column prop="icdName" label="疾病名称" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="schemeName" label="随访方案" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="notPassReason" label="终止原因" align="center"></el-table-column>
							<el-table-column prop="dateVet" label="终止时间" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="详情" align="center" width="80">
			    			<template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="lookDetailes(scope)">详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
						<el-row v-if="tableData_stop.list.length" style="margin-top: 11px;">
              <!-- 分页 -->
              <el-col :span="12" :offset="12">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page.sync="tableData_stop.pager"
                  :page-size="10"
                  layout="total,prev, pager, next, jumper"
                  :total="tableData_stop.totalPage">
                </el-pagination>
              </el-col>
            </el-row>
					</el-tab-pane>
			  </el-tabs>
			</el-col>
		</el-row>
		<!-- 审核不通过原因弹框 -->
		<ex-select
			:noCheck="noCheck"
			@sendReason="sendReason"
			@closeChildren="closeChildren">
		</ex-select>
		<!-- 随访计划 -->
		<plan
		:planDg="planDg"
		@closeChildrenPlan="closeChildrenPlan"></plan>
  </div>
</template>
<script>
import { followUp } from 'RJZL_API/followPlan';
import { commonUrl } from 'RJZL_API/commonUrl';
import { hzList } from 'RJZL_API/patientList';
import ExSelect from 'components/dialog/exSelect';
import Plan from 'components/dialog/plan/plan';
const tableName = ['list', 'pass', 'nopass', 'stop'];
export default {
	name: 'dischargeFollowupPlanReview',
	data() {
		return {
			formInline: { // 查询form
				adminId: sessionStorage.getItem('userId'),
				brxm: '', // 病人姓名
				mobile: '', // 手机号
				schemeName: '', // 随访方案
				icdName: '', // 疾病名称
				brxb: '', // 病人性别
				beginAge: '', // 开始年龄
				endAge: '', // 技术年龄
				activeType: '0',
				limit: 10
			},
			tableData_list: { // 待审核
				list: [], // 列表
				pager: 1, // 当前页码
				totalPage: null, // 总页数
				loading: false, // loading
				status: '0' // 状态
			},
			tableData_pass: { // 已通过
				list: [],
				pager: 1,
				totalPage: null,
				loading: false, // loading
				status: '2'
			},
			tableData_nopass: { // 未通过
				list: [],
				pager: 1,
				totalPage: null,
				loading: false, // loading
				status: 1
			},
			tableData_stop: { // 已终止
				list: [],
				pager: 1,
				totalPage: null,
				loading: false, // loading
				status: '4'
			},
			activeName: 'first', // tab
			tabIndex: '0', // tab 0待审核，1已通过，2未通过,3已终止
			getTableName: '', // 获取tab对应的tableName, 获取列表数据
			checkId: [], // 随访通过的id(多选时),
			noCheck: false, // 审核不通过弹框
			loadingSelect: false,
			icdNameList: [],
			ids: [], // 待审核
			notPassReason: '', // 审核不通过原因
			planDg: false, // 详情弹窗
			hzxxId: '' // 患者id
		};
	},
	components: {
		ExSelect,
		Plan
	},
	mounted() {
		this.list(this.tableData_list)
	},
	methods: {
		/** 获取列表 */
		list(param) {
			param.loading = true;
			followUp.leaveResultPlanList({
				...this.formInline,
				'status': param.status,
				'pager': param.pager
			}).then(res => {
				param.loading = false;
				if (res.code === 0) {
					param.list = res.data;
					if (param.pager === 1) {
						param.totalPage = res.total;
					}
				}
			});
		},
		/**
		 *@description 切换tab
		 */
		handleClick(tab, event) {
			// 获取tab的index
			this.tabIndex = tab.index;
			// 获取tab对应的tableName, 获取列表数据
			this.getTableName = `tableData_${tableName[tab.index]}`;
			this.list(this[this.getTableName]);
		},
		/**
		* 分页
		*/
		handleCurrentChange(val) {
			// 获取tab对应的tableName, 获取列表数据
			this.getTableName = `tableData_${tableName[this.tabIndex]}`;
			this.list(this[this.getTableName]);
		},
		/**
		 * [searchBtn description] 查询
		 * @return {[type]} [description]
		 */
		searchBtn() {
			// 获取tab对应的tableName, 获取列表数据
			const getTableName = `tableData_${tableName[this.tabIndex]}`;
			this[getTableName].pager = 1;
			this.list(this[getTableName]);
		},
		/** 疾病检索 **/
		remoteMethod(query) {
			if (query !== '') {
				this.loadingSelect = true;
				setTimeout(() => {
					this.loadingSelect = false;
					commonUrl.getdiseasefix({
						'jbmc': query
					}).then(res => {
						if (res.code === 0) {
							this.icdNameList = res.data.map(item => {
								return { label: item.jbmc, value: item.jbmc };
							});
						}
					}).catch(error => {
						this.$message.error(error.message);
					});
				}, 200);
			} else {
				this.icdNameList = [];
			}
		},
		/** 疾病检索获取label **/
		handChange(value) {
		//   let obj = this.icdNameList.find((item)=> {
		//     return item.value === value
		//   })
		//   this.ruleForm.icdName = obj.label
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
		* [closeChildren description]
		* @description 监听子组件的关闭动作
		* @DateTime    2018-04-17
		* @param       {{Sring}}
		* @param       {[type]}   val [description]
		* @return      {[type]}       [description]
		*/
		closeChildren(val) {
			this.noCheck = val;
		},
		/**
		* [sendReason description]
		* @description 监听子组件确定按钮时选择不通过的原因
		* @DateTime    2018-04-17
		*/
		sendReason(val) {
			this.notPassReason = val
			if (val != '') {
				if(val === '1') {
					this.$confirm('标记死亡后该患者的所有随访计划将终止, 确定标记该患者死亡?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.handleCheck(1, this.ids, val)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				} else {
					this.handleCheck(1, this.ids, val)
				}
			} else {
				this.ids.length = 0
			}
		},
		/** 待审核全选 */
		selectAll(val) {
			this.ids.length = 0
			val.forEach(item => {
				this.ids.push(item.id)
			})
		},
		/** 待审核单选 */
		selectSingal(selection, row) {
			this.ids.length = 0
			selection.forEach(item => {
				this.ids.push(item.id)
			})
		},
		/**
	 *审核功能
		*@function handleCheck
		*@description 审核功能均调用这一个函数
		*@param {String} status 通过(1：不通过 2：通过)
		*@param {String} ids id集合,数组转字符串
		*@param {String} notPassReason 审核不通过原因
		*/
		handleCheck(status, ids, notPassReason) {
			followUp.vet({
				'status': status,
				'ids': ids,
				'notPassReason': notPassReason,
			}).then((res)=>{
				if(res.code === 0) {
					this.ids.length = 0
					this.$message.success(res.message)
					this.list()
					if (this.noCheck) {
						this.noCheck = false
					}
					// 执行标记死亡的操作
					if(notPassReason === '1') {
						this.updateIsLiveFun()
					}
				} else {
					this.$message.error(res.message)
				}
			}).catch((error)=>{
				this.ids.length = 0
				this.$message.error(error.message)
			})
		},
		// 审核原因未死亡时执行标签死亡操作
		updateIsLiveFun() {
			hzList.updateIsLive({
				'hzxxId': this.hzxxId,
				'isDed': '1'
			}).then(res => {
			});
		},
		/** 批量通过 */
		numCheck() {
			if (this.ids.length > 0) {
				this.handleCheck(2, this.ids);
			} else {
				this.$message.error('请选择患者！');
			}
		},
		/**
		 * [lang description]表格通过按钮
		 * @type {String}
		 */
		passBtn(scope) {
			this.$confirm('确定通过该计划?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.handleCheck(2, scope.row.id);
			}).catch(() => {
				this.$message.info('已取消！');
			});
		},
		/** 审核不通过 */
		passoutBtn(scope) {
			this.ids.length = 0;
			this.noCheck = true;
			// id
			this.ids.push(scope.row.id);
			// hzxxId
			this.hzxxId = scope.row.hzxxId;
		},
		lookDetailes(scope) {
			this.ids.length = 0;
			// id
			this.ids.push(scope.row.id);
			// hzxxId
			this.hzxxId = scope.row.hzxxId;
			this.planDg = true;
			this.$store.dispatch('getScopeRowData', scope);
		},
		/** 监听详情的关闭操作 */
		closeChildrenPlan(val) {
			this.planDg = false;
			this.ids.length = 0;
			// 获取tab对应的tableName, 获取列表数据
			this.getTableName = `tableData_${tableName[this.tabIndex]}`;
			this.list(this[this.getTableName]);
		}
	}
};
</script>
<style lang="scss">
  @import '~styles/search';
</style>