<template>
	<div class="step2">
		<el-row class="upnum">
			<el-col :span="24">
				上传结果：共<strong>{{Number(uploadNum.data.successNum) + Number(uploadNum.data.failNum)}}</strong>条&nbsp;|
				&nbsp;成功 <strong>{{uploadNum.data.successNum}}</strong> 条&nbsp;|
				&nbsp;失败<span>{{uploadNum.data.failNum}}</span>条
				</el-col>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<!-- 上传成功 -->
	    <el-tab-pane label="上传成功" name="first">
	    	<el-row class="finishjb">
	    		<el-col class="center" :span="24">完善疾病类型的患者才能发起院后随访，请完善患者<span class="red">疾病类型</span>信息</el-col>
	    	</el-row>
				<el-row>
					<el-col :span="24">
						<el-table :data="successTable" style="width: 100%" class="upTable" :loading="successLoading">
	            <el-table-column prop="intime" label="入院时间" align="center"></el-table-column>
	            <el-table-column prop="outtime" label="出院时间" align="center"></el-table-column>
	            <el-table-column prop="name" label="姓名" align="center">
								<template slot-scope="scope">
									<span>{{scope.row.name}}</span>
									<el-tag v-if="!scope.row.icdName" type="primary" :style="{height: '23px', lineHeight: '23px'}">新</el-tag>
								</template>
							</el-table-column>
	            <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
	            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
	            <el-table-column prop="age" label="年龄" align="center"></el-table-column>
	            <el-table-column prop="diagnose" label="诊断" align="center"></el-table-column>
	            <el-table-column prop="icdName" label="疾病类型" align="center" show-overflow-tooltip>
	            	<template slot-scope="scope">
									<span
										:class="[scope.row.icdName=== ''?red:'']">
										{{scope.row.icdName=== ''?'未完善':scope.row.icdName}}
									</span>
								</template>
	            </el-table-column>
	            <el-table-column label="操作" width="180" align="center">
								<template slot-scope="scope">
									<el-button
										@click="editjb(scope)"
										class="operationBtn"
										:type="`${scope.row.icdName === ''? 'primary':'warning'}`">
										{{scope.row.icdName=== ''?'完善':'修改'}}
									</el-button>
									<el-button type="danger" @click="passoutBtn(scope.row)" class="operationBtn">删除</el-button>
								</template>
	            </el-table-column>
	    			</el-table>
					</el-col>
				</el-row>
				<div class="block" style="padding: 11px 50px 0 0;text-align: right;background: #fff;">
					<el-pagination  @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="10" layout="total,prev, pager, next, jumper"
						:total="totalPage">
					</el-pagination>
				</div>
				<el-row class="center" style = "padding-bottom: 50px;background: #fff;border-top: 1px solid #f0f0f0;">
					<el-col :span="24" style="line-height: 50px;">尚未来得及完善的患者信息，下次可到"<span class="red">患者列表-未完善信息</span>"页面继续完善</el-col>
					<el-button type="primary" @click="saveOkHzzTemp">保存已完善的信息</el-button>
				</el-row>
		  </el-tab-pane>
			<!-- 上传失败 -->
	    <el-tab-pane label="上传失败" name="second">
				<el-row class="finishjb">
	    		<el-col class="center" :span="24">共<span class="red">{{uploadNum.data.failNum}}</span>条上传失败，以下患者请重新上传信息</el-col>
	    	</el-row>
				<el-row>
					<el-col :span="24">
						<el-table :data="failTable" style="width: 100%" class="upTable" :loading="failLoading">
	            <el-table-column prop="intime" label="入院时间" align="center"></el-table-column>
	            <el-table-column prop="outtime" label="出院时间" align="center"></el-table-column>
	            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
	            <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
	            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
	            <el-table-column prop="age" label="年龄" align="center"></el-table-column>
	            <el-table-column prop="diagnose" label="诊断" align="center"></el-table-column>
	            <el-table-column prop="errorinfo" label="失败原因" width="180" align="center"></el-table-column>
	    			</el-table>
					</el-col>
				</el-row>
				<el-row v-if="failTable.length" class="white" style="padding-bottom: 20px;">
					<!-- 批量通过 -->
					<el-col :span="12">
						<div class="checkPiliang">
							<el-button type="primary" v-if="uploadNum.downLoadName">
								<a :href="'/assets/templatedoc/'+`${uploadNum.downLoadName}`" style="color: #fff;">下载失败名单</a>
								</el-button>
						</div>
					</el-col>
					<!-- 分页 -->
					<el-col :span="12">
						<div class="block" style="margin-top: 11px;">
							<el-pagination  @current-change="handleCurrentChange1" :current-page.sync="currentPage1" :page-size="10" layout="total,prev, pager, next, jumper"
								:total="totalPage1" v-if="totalPage1">
							</el-pagination>
						</div>
					</el-col>
				</el-row>
	    </el-tab-pane>
	  </el-tabs>
	  <!-- 完善疾病名称diglog -->
		<disease
			:hzid="hzid"
			:diseaseDg="diseaseDg"
			@closeDialogFun="closeDialogFun"
			@saveIcdName="saveIcdName"
			></disease>
	</div>
</template>

<script>
	import { hzList } from 'RJZL_API/patientList'
	import Disease from '@/components/dialog/disease'
	import { mapState } from 'vuex'
	export default {
		data () {
			return {
				activeName: 'first',
				successTable: [],// successTable
				currentPage: 1, //当前页
				totalPage: null, // 总页数
				failTable: [], // failTable
				currentPage1: 1, //当前页
				totalPage1: null, // 总页数
				successLoading: false, // 上传成功的loading
				failLoading: false, // 上传失败的loading
				diseaseDg: false, //疾病检索dialog
				hzid: '', // 患者id
				red: 'red',
			}
		},
		props: [
			'step'
		],
		mounted () {
			this.successList()
			console.log(this.uploadNum);
		},
		components: {
			Disease
		},
		computed: {
			...mapState({
				"uploadNum": state => state.user.uploadNum
			})
    },
		methods: {
			/**
			 * [successList description]
			 * @description 上传成功的接口
			 * @DateTime    2018-04-20
			 * @param       {{Sring}}
			 * @return      {[type]}   [description]
			 */
			successList (pager) {
				this.successLoading = true
				hzList.OncologyTempList({
          'adminId': sessionStorage.getItem('userId'),
          'name': '',
          'startAge': '',
          'endAge': '',
          'mobile': '',
					'sex': '',
					'pager': pager,
					'limit': 10
        }).then((res)=>{
        	this.successLoading = false
          if(res.code == 0) {
          	this.successTable = res.data
						if(this.currentPage === 1) {
							this.totalPage = res.count
						}
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.successLoading = false
        	this.$message.error(error.message)
        })
			},
			/**
			 * [failList description]
			 * @description  上传失败
			 * @DateTime    2018-04-20
			 * @param       {{Sring}}
			 * @return      {[type]}   [description]
			 */
			failList (pager) {
				this.failLoading = true
				hzList.getOncologyTempErrorList({
          'adminId': sessionStorage.getItem('userId'),
          'name': '',
          'startAge': '',
          'endAge': '',
          'mobile': '',
					'sex': '',
					'pager': pager,
					'limit': 10
        }).then((res)=>{
        	this.failLoading = false
          if(res.code == 0) {
          	this.failTable = res.data
						if(this.currentPage1 === 1) {
							this.totalPage1 = res.count
						}
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.failLoading = false
        	this.$message.error(error.message)
        })
			},
			/**
			 * [passBtn description] 删除
			 * @return {[type]} [description]
			 */
			passoutBtn (scope) {
				console.log(scope.id)
				this.$confirm('确定删除该患者?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
					});
					this.deleteTempById(scope.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
			},
			deleteTempById (id) {
				hzList.deleteTempById({
          'id': id,
        }).then((res)=>{
					console.log(res)
          if(res.code == 0) {
          	this.$message.success(res.message)
          	this.successList(this.currentPage1)
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.$message.error(error.message)
        })
			},
			/**
			 *上传成功翻页
			 */
			handleCurrentChange (val) {
				this.successList(val)
			},
			/**
			 *上传失败翻页
			 */
			handleCurrentChange1 (val) {
				this.failList(val)
			},
			/** tab 切换 */
			handleClick(tab) {
        if (tab.index == 0) {
        	this.successList(1)
        } else {
        	this.failList(1)
        }
      },
      /**
			 * [editjb description]
			 * @description 编辑疾病
			 * @DateTime    2018-04-19
			 */
			editjb (scope) {
				this.diseaseDg = true
				this.nowIndex = scope.$index
				this.hzid = scope.row.id
			},
			/**
       * 关闭疾病检索弹框
       */
      closeDialogFun (val) {
      	this.diseaseDg = val
      },
      /**
			 * 保存疾病名称
			 */
			saveIcdName (val) {
				this.successTable[this.nowIndex].icdName = val
			},
			/*
			 *保存已完善的信息
			 */
			saveOkHzzTemp () {
				hzList.saveOkHzzTemp({
          'adminId': sessionStorage.getItem('userId'),
        }).then((res)=>{
          if(res.code == 0) {
          	this.$message.success(res.message)
          	this.$router.push({path: '/HzList'})
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.$message.error(error.message)
        })
			},
		},
		watch: {
			step(newV, oldV) {
				if(newV != oldV) {
					this.successList()
				}
			},
		}
	}
</script>

<style lang="scss">
	.red {
		color: red;
	}
	//操作按钮
.operationBtn {
	margin:0;
	padding:0;
	height:22px;
	width:52px;
	font-size :13px;
}
</style>