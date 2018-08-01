<template>
  <div class="dischargeFollowupResults">
    <!-- 搜索 -->
		<el-row class="common-search">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
			  <el-col :span="6">
			  	<el-form-item label="患者姓名">
				    <el-input v-model="formInline.brxm" placeholder="请输入患者姓名" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="联系电话">
				    <el-input v-model="formInline.mobile" placeholder="请输入患者联系电话" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
			  	<el-form-item label="随访方案">
				    <el-input v-model="formInline.schemeName" placeholder="请输入随访方案" clearable></el-input>
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
              :remote-method="remoteMethod"
              :loading="loadingSelect">
              <el-option
                v-for="(item, index) in options4"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="随访日期" class="formTime">
						<el-date-picker
              @change="timeChange"
						  v-model="createTime"
							type="daterange"
							value-format="yyyy-MM-dd"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
              :picker-options="pickerTime">
						</el-date-picker>
					</el-form-item>
				</el-col>
        <el-col :span="6">
          <el-form-item label="采集情况">
            <el-select v-model="formInline.resultStatus" placeholder="采集情况" @change="resultStatusChange">
            	<el-option label="全部" value=""></el-option>
              <el-option label="部分采集" value="1"></el-option>
							<el-option label="接通未采集" value="3"></el-option>
              <el-option label="接通无应答" value="4"></el-option>
							<el-option label="无异常" value="2"></el-option>
              <el-option label="有异常" value="6"></el-option>
							<el-option label="未接通未采集" value="5"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
				<el-col :span="6">
			  	<el-form-item label="通话状态">
				    <el-select v-model="formInline.backStatus" placeholder="通话状态">
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
				</el-col>
				<el-col :span="6" v-if="tabIndex==1">
			  	<el-form-item label="处理意见">
				    <el-select v-model="formInline.diseaseInfo" placeholder="处理意见">
							<el-option label="全部" value="100" ></el-option>
              <el-option label="病情稳定" value="0"></el-option>
              <el-option label="通知就诊" value="1"></el-option>
              <el-option label="暂不处理" value="2"></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span="6">
			  	<el-button type="primary" @click="onSearch">查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
		<!-- 表格 -->
		<el-row class="common-table">
			<el-col :span="24">
				<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="待处理" name="first">
						<el-table :data="tableData" border style="width: 100%;" v-loading="loading">
							<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
							<el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
							<el-table-column prop="icdName" label="疾病名称" align="center"></el-table-column>
							<el-table-column prop="backStatusStr" label="通话状态" align="center"></el-table-column>
							<el-table-column prop="schemeName" label="随访方案" align="center"></el-table-column>
							<el-table-column prop="dateEnd" label="随访日期" align="center" show-overflow-tooltip ></el-table-column>
							<el-table-column prop="totalNum" label="随访进度" align="center"></el-table-column>
							<el-table-column prop="collectionStr" label="采集情况" align="center"></el-table-column>
							<el-table-column label="呼叫情况" align="center">
								<template slot-scope="scope">
									<el-button type="warning" @click="callDetailBtn(scope)" size="mini">呼叫详情</el-button>
								</template>
							</el-table-column>
							<el-table-column label="随访记录" align="center" width="220">
								<template slot-scope="scope">
									<el-button type="danger" @click="resolveBtn(scope)" size="mini">结果处理</el-button>
									<el-button type="primary" @click="operationBtn(scope)" size="mini">详情</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-row v-if="tableData.length">
							<!-- 分页 -->
							<el-col :span="12" :offset="12">
								<div class="block" style="margin-top: 11px;">
									<el-pagination
										@current-change="handleCurrentChange"
										:current-page.sync="currentPage"
										:page-size="10"
										layout="total,prev, pager, next, jumper"
										:total="totalPage">
									</el-pagination>
								</div>
							</el-col>
						</el-row>
			    </el-tab-pane>
			    <el-tab-pane label="已处理" name="second">
						<el-table :data="tableData1" border style="width: 100%;" v-loading="loading1">
							<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
							<el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
							<el-table-column label="性别/年龄" align="center" width="110">
								<template slot-scope="scope">
									{{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
								</template>
							</el-table-column>
							<el-table-column prop="icdName" label="疾病名称" align="center"></el-table-column>
							<el-table-column prop="backStatusStr" label="通话状态" align="center"></el-table-column>
							<el-table-column prop="schemeName" label="随访方案" align="center"></el-table-column>
							<el-table-column prop="dateEnd" label="随访日期" align="center" show-overflow-tooltip ></el-table-column>
							<el-table-column prop="totalNum" label="随访进度" align="center"></el-table-column>
							<el-table-column prop="diseaseInfo" label="处理意见" align="center">
								<template slot-scope="scope">
									{{scope.row.diseaseInfo == '0' ? '病情稳定': scope.row.diseaseInfo == '1'? '通知就诊': scope.row.diseaseInfo == '2'?'暂不处理':''}}
								</template>
							</el-table-column>
							<el-table-column label="呼叫情况" align="center">
								<template slot-scope="scope">
									<el-button type="warning" @click="callDetailBtn(scope)" size="mini">呼叫详情</el-button>
								</template>
							</el-table-column>
							<el-table-column label="随访记录" align="center" width="220">
								<template slot-scope="scope">
									<el-button type="danger" @click="resolveBtn(scope)" size="mini">重新处理</el-button>
									<el-button type="primary" @click="operationBtn(scope)" size="mini">详情</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-row v-if="tableData1.length">
							<!-- 分页 -->
							<el-col :span="12" :offset="12">
								<div class="block" style="margin-top: 11px;">
									<el-pagination
										@current-change="handleCurrentChange1"
										:current-page.sync="currentPage1"
										:page-size="10"
										layout="total,prev, pager, next, jumper"
										:total="totalPage1">
									</el-pagination>
								</div>
							</el-col>
						</el-row>
					</el-tab-pane>
			  </el-tabs>
			</el-col>
		</el-row>
		<!-- 随访计划 -->
		<result
			:resultDg="resultDg"
			@closeChildren="closeChildren"
		>
		</result>
		<!-- 结果处理 -->
		<el-dialog
			title="结果处理"
			:visible.sync="resovleDg"
			custom-class="resovleDg"
			width="500px">
      <el-row>
        <el-col :span="8" v-for="(item, index) in btnList" :key="index">
          <el-button :type="item.type" plain @click="clBtn(index)">{{item.value}}</el-button>
        </el-col>
      </el-row>
		</el-dialog>
		<!-- 呼叫详情 -->
		<el-dialog
			title="呼叫次数"
			:visible.sync="callDg"
			custom-class="resovleDg"
			width="900px"
			:before-close="beforeClose">
			<el-collapse v-model="activeNames" v-if="callDetailDate.length">
				<el-collapse-item
					:title="`${'第'+ item.index + '随访'+'    '+ '随访时间' +item.dateBegin }`"
					:name="item.index"
					v-for="(item, index) in callDetailDate"
					:key="index">
					<el-table :data="item.callResults" v-if="item.callResults" width="100%" border>
						<el-table-column label="呼叫次数" align="center">
							<template slot-scope="scope">
								第{{scope.row.rowNo}} 次
							</template>
						</el-table-column>
						<el-table-column property="dateAdd" label="呼叫时间" align="center"></el-table-column>
						<el-table-column property="remark" label="通话状态" align="center"></el-table-column>
					</el-table>
					<el-row v-if="!item.callResults">
						<el-col :span="24">暂时没有数据哦...</el-col>
					</el-row>
				</el-collapse-item>
			</el-collapse>
			<!-- 无数据的时候 -->
			 <el-row v-if="!callDetailDate.length">
				<el-col :span="24">
					暂时没有数据哦...
				</el-col>
			</el-row>
		</el-dialog>
  </div>
</template>
<script>
  import { followUp } from 'RJZL_API/followPlan'
	import Result from 'components/dialog/result/result'
	import * as getTime from 'utils/getDate'
	import * as utilsIndex from 'utils'
  export default {
    name: 'dischargeFollowupResults',
    data () {
			return {
				formInline: {
					adminId: sessionStorage.getItem('userId'),
					resultStatus: '',   //采集情况
					isNormal: '', // 采集是否有异常
					brxm: '', // 病人姓名
					mobile: '', // 手机号
					schemeName: '', // 随访方案
					icdName: '', // 疾病名称
					backStatus: '',  //通话状态
					dateEndBegin: '', //生成开始时间（可选）
					dateEndEnd: '', //生成结束时间（可选）
					// vetStatus: '10' , //审核状态: 0 未审核，1 已审核,10 未处理,11 已处理,12 已取消
					diseaseInfo: '-1', // 100（已处理的全部状态：0:病情稳定 1:通知就诊  2:暂不处理）, -1（未处理）, 0/1/2 表示上面3种情况
					activeType: '0',
					pager: '1',
					limit: '10'
				},
			  tableData: [],
        loading: false, // loading...
        currentPage: 1, // 当前页
				totalPage: 0, // 总页数
				tableData1: [],
        loading1: false, // loading...
        currentPage1: 1, // 当前页
				totalPage1: 0, // 总页数
				loadingSelect: false, // 疾病检索的loading
				options4: [], // 疾病检索options
				resultDg: false, // 详情弹窗
				cjsb: 'cjsb',//采集失败(灰色)
        wyc: 'wyc',//无异常(绿色)
				yyc: 'yyc',//有异常(红色)
				createTime: [],
				pickerTime: {
					shortcuts: utilsIndex.pickerOptions
				},
				resovleDg: false, // 处理意见
				activeName: 'first', // tab切换
				tabIndex: '0', // tabindex
				btnList:[
					{
						value: '病情稳定',
						type: ''
					},
					{
						value: '通知就诊',
						type: 'success'
					},
					{
						value: '暂不处理',
						type: 'danger'
					}
				], // 处理按钮
				cyId: '', // 处理结果id
				callDg: false, // 呼叫详情
				activeNames: [],
				callDetailDate: [] // 呼叫详情data
			}
		},
		components: {
			Result
		},
		mounted () {
			this.getCurrent()
			this.list(1)
		},
		methods: {
			getCurrent() {
				this.formInline.dateEndBegin = getTime.currentTime + ' ' + '00:00:00';
				this.formInline.dateEndEnd =  getTime.currentTime + ' ' + '23:59:59';
				this.createTime = [this.formInline.dateEndBegin, this.formInline.dateEndEnd]
			},
			// 采集情况
			resultStatusChange (value) {
				console.log(value);
				if (value === '1'|| value === '2') {
					this.formInline.isNormal = true
				} else if (value === '6') {
					this.formInline.isNormal = false
				} else {
					this.formInline.isNormal = ''
				}
			},
			/** 待处理 */
			list () {
				this.loading = true
				this.formInline.pager = this.currentPage
			  followUp.leaveResultList(this.formInline).then((res)=>{
					this.loading = false
          if(res.code == 0) {
						this.tableData = res.data
            this.totalPage = res.total
          }
        }).catch((error)=>{
					this.loading = false
        })
			},
			/** 已处理 */
			list1 () {
				this.loading1 = true
				this.formInline.pager = this.currentPage1
			  followUp.leaveResultList(this.formInline).then((res)=>{
					this.loading1 = false
          if(res.code == 0) {
            this.tableData1 = res.data
            this.totalPage1 = res.total
          }
        }).catch((error)=>{
					this.loading1 = false
        })
			},
			/**@description
     * 创建时间更改
     */
			timeChange(time) {
				if(time) {
					this.formInline.dateEndBegin = time[0] + ' ' + '00:00:00';
					this.formInline.dateEndEnd = time[1] + ' ' + '23:59:59';
				} else {
					this.formInline.dateEndBegin = '';
					this.formInline.dateEndEnd = '';
				}
			},
			/** 疾病检索 **/
			remoteMethod(query) {
        if (query !== '') {
          this.loadingSelect = true;
          setTimeout(() => {
            this.loadingSelect = false;
             commonUrl.getdiseasefix({
              'jbmc': query
            }).then((res)=>{
              console.log(res)
              this.loadingSelect = false
              if(res.code == 0) {
                this.options4=res.data.map(item => {
                  return {label: item.jbmc,value: item.jbmc}
                })
              }
            }).catch((error)=>{
              console.log(error)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
			},
			/**	查询 */
			onSearch () {
				if (this.tabIndex === '0') {
					this.currentPage = 1
					this.list()
				} else {
					console.log('test2');
					this.currentPage1 = 1
					this.list1()
				}
			},
      /** 分页 */
      handleCurrentChange(val) {
        this.list()
			},
			handleCurrentChange1(val) {
        this.list1()
			},
			/** tab切换 */
			handleClick(tab, event) {
				if (tab.index === '0') {
					this.tabIndex = '0'
					this.formInline.diseaseInfo = '-1'
					this.currentPage = 1
					this.list()
				} else if(tab.index === '1') {
					this.tabIndex = '1'
					this.formInline.diseaseInfo = '100'
					this.currentPage1 = 1
					this.list1()
				}
      },
			/** 详情 */
			operationBtn (scope) {
				this.resultDg = true
				this.$store.dispatch('getScopeRowData', scope)
			},
			/** 监听弹窗子组件的关闭动作 */
			closeChildren (val) {
			 	this.resultDg = val
			},
			/** 处理结果 */
			resolveBtn (scope) {
				this.resovleDg = true
				this.cyId = scope.row.id
			},
			/**
			 * 处理结果
			 */
			clBtn(index) {
			  followUp.leaveResult({
					'id': this.cyId,
					'diseaseInfo': index
				}).then((res)=>{
          this.resovleDg = false
					this.$message.info(res.message)
					if (this.tabIndex === '0') {
						this.list()
					} else {
						this.list1()
					}
        }).catch((error)=>{
					this.resovleDg = false
					this.$message.error(error.message)
        })
			},
			/**
			 * 呼详情按钮
			 */
			callDetailBtn (scope) {
				this.callDg = true
				// this.callDetailDate.length = 0
			  followUp.getCallDetail({
					'taskId': scope.row.taskId
				}).then((res)=>{
					if (res.code === 0) {
						this.activeNames.push(res.data.length)
						this.callDetailDate = res.data
					}
        }).catch((error)=>{})
			},
			beforeClose (done) {
				console.log('test');
				this.activeNames.length = 0
				this.callDetailDate.length = 0
				done()
			}

		}
  }
</script>
<style lang="scss">
@import '~styles/search';
  .dischargeFollowupResults {
  }
</style>