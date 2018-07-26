<template>
	<div class="halfInfo">
  	<el-row class="upnum">
  		<el-col class="center" :span="24">完善疾病类型的患者才能发起院后随访，请完善患者<span class="red">疾病类型</span>信息</el-col>
  	</el-row>
		<!-- 查询 -->
		<el-row class="common-search">
			<el-form :inline="true" :model="formInline" class="demo-form-inline">
				<el-col :span="4">
					<el-form-item label="患者姓名">
						<el-input v-model="formInline.name" placeholder="请输入姓名" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="联系电话">
						<el-input v-model="formInline.mobile" placeholder="请输入联系电话" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="患者性别">
						<el-select v-model="formInline.sex" placeholder="性别">
							<el-option label="全部" value=""></el-option>
							<el-option label="男" value="男"></el-option>
							<el-option label="女" value="女"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item label="患者年龄">
						<el-row>
							<el-col :span="11"><el-input v-model="formInline.startAge" placeholder="0" clearable></el-input></el-col>
							<el-col :span="2" style="text-align: center;">-</el-col>
							<el-col :span="11"><el-input v-model="formInline.endAge" clearable></el-input></el-col>
						</el-row>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="onSearch">查询</el-button>
				</el-col>
			</el-form>
		</el-row>
		<el-row>
			<el-col :span="24">
				<el-table
					:data="tableData"
					style="width: 100%"
					class="upTable"
					v-loading="halfLoading"
					ref="tableData">
          <el-table-column prop="intime" label="入院时间" align="center"></el-table-column>
          <el-table-column prop="outtime" label="出院时间" align="center"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center"></el-table-column>
          <el-table-column prop="mobile" label="联系方式" align="center"></el-table-column>
          <el-table-column prop="sex" label="性别" align="center"></el-table-column>
          <el-table-column prop="age" label="年龄" align="center"></el-table-column>
          <el-table-column prop="diagnose" label="诊断" align="center"></el-table-column>
          <el-table-column prop="addtime" label="导入时间" align="center"></el-table-column>
          <el-table-column prop="icdName" label="疾病类型" align="center" show-overflow-tooltip>
          	<template slot-scope="scope">
							<span
								:class="[scope.row.icdName=== ''?red:'']">
								{{scope.row.icdName=== ''?'未完善':scope.row.icdName}}
							</span>
						</template>
          </el-table-column>
          <el-table-column prop="date" label="操作" width="180" align="center">
						<template slot-scope="scope">
							<el-button
								v-if="icdSpan"
								@click="editjb(scope)"
								size="mini"
								:type="`${scope.row.icdName === ''? 'primary':'default'}`">
								{{scope.row.icdName=== ''?'完善':'修改'}}
							</el-button>
							<el-button @click="passoutBtn(scope.row)" size="mini">删除</el-button>
						</template>
          </el-table-column>
  			</el-table>
			</el-col>
		</el-row>
		<div class="block" style="padding: 11px 50px 11px 0;text-align: right;background: #fff;">
			<el-pagination
				@current-change="handleCurrentChange2"
				:current-page.sync="currentPage2"
				:page-size="10"
				layout="total,prev, pager, next, jumper"
				:total="totalPage2"
			>
			</el-pagination>
		</div>
		<el-row class="center" style = "padding:20px 0 50px 0;background: #fff;border-top: 1px solid #f0f0f0;">
			<el-button type="success" @click="saveOkHzzTemp">保存已完善的信息</el-button>
		</el-row>
		<!-- 完善疾病名称diglog -->
		<disease
			:diseaseDg="diseaseDg"
			:hzid="hzid"
			@closeDialogFun="closeDialogFun"
			@saveIcdName="saveIcdName"
			></disease>
	</div>
</template>

<script>
	import { hzList } from 'RJZL_API/patientList'
	import Disease from '@/components/dialog/disease'
	export default {
		data () {
			return {
				tableData: [],
				currentPage2: 1, //当前页
				totalPage2: null, // 总页数
				formInline: {
					name: '', // 姓名
					mobile: '', // 电话号码
					startAge: '', // 年龄
					endAge: '', // 年龄
					sex: '' // 性别
				},
				halfLoading: false,
				red: 'red', // 未完善的字体颜色
				options4: [],
				icdSpan: true, // icdName的td时是否为空
				diseaseDg: false, //疾病检索dialog
				hzid: '', // 患者id
				nowIndex: null, // 当前选中的行
			}
		},
		components: {
			Disease
		},
		mounted () {
			this.list(1)
		},
		methods: {
			list(page) {
        this.halfLoading = true
        hzList.OncologyTempList({
          'adminId': sessionStorage.getItem('userId'),
          'sex': this.formInline.sex,
          'name': this.formInline.name,
          'mobile': this.formInline.mobile,
          'startAge': this.formInline.startAge,
          'endAge': this.formInline.endAge,
          'pager': page,
          'limit': '10'
        }).then((res)=>{
          this.halfLoading = false
          if(res.code == 0) {
            this.tableData = res.data
            if(this.currentPage2 == 1) {
							this.totalPage2 = res.count
						}
          } else {
						this.$message.error(res.message)
					}
        }).catch((error)=>{
					this.halfLoading = false
          console.log(error)
        })
      },
			handleClick () {

			},
      selectChange (val) {
      	console.log(val)
      	// this.icdSpan = true
      },
      /**
       * 关闭疾病检索弹框
       */
      closeDialogFun (val) {
      	this.diseaseDg = val
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
			 * [saveBtn description]
			 * @description 保存疾病类型
			 * @DateTime    2018-04-19
			 */
			saveBtn () {
				this.icdSpan = true
			},
			/**
			 * 保存疾病名称
			 */
			saveIcdName (val) {
				this.tableData[this.nowIndex].icdName = val
			},
			/**
			 * [passBtn description] 修改
			 * @return {[type]} [description]
			 */
			passBtn () {

			},
			/**
			 * [passoutBtn description]
			 * @description 删除
			 * @DateTime    2018-04-20
			 * @param       {{Sring}} id 患者id
			 */

			passoutBtn (scope) {
				this.$confirm('确定通过该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.deleteTempById(scope.id)
        }).catch(() => {
					this.$message.info('已取消！')
				});
			},
			deleteTempById (id) {
				hzList.deleteTempById({
          'id': id,
        }).then((res)=>{
          if(res.code == 0) {
          	this.$message.success(res.message)
          	this.list(this.currentPage2)
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.$message.error(error.message)
        })
			},
			/** 保存 */
			saveOkHzzTemp () {
				hzList.saveOkHzzTemp({
          'adminId': sessionStorage.getItem('userId'),
        }).then((res)=>{
          if(res.code == 0) {
          	this.$message.success(res.message)
          	this.$router.push({path: '/hzList'})
          } else {
          	this.$message.error(res.message)
          }
        }).catch((error)=>{
        	this.$message.error(error.message)
        })
			},
			handleCurrentChange2 (val) {
				this.list(val)
				this.currentPage2 = val
			},
			/**
			 * [onSearch description] 查询
			 * @return {[type]} [description]
			 */
			onSearch () {
				this.currentPage2 = 1
				this.list(1)
			},

		}
	}
</script>

<style lang="scss">
@import '~styles/search';

.halfInfo {
	background: #fff;
	.upnum .el-col{
		color: #999;
		padding: 20px 20px;
		border-bottom: 1px solid #f0f0f0;
		span {
			color: red;
		}
		strong {
			color: #000;
		}
	}
}
.upTable {
	.el-table__header, .el-table__body {
		width: 100%!important;
	}
}
//批量审核
.checkPiliang .el-button{
  padding: 6px 12px;
  color: #fff;
  margin-top: 13px;
  margin-left: 40px;
  float:left;
}
.gray {
  color: #999999;
}
.red {
	color: #FF0000;
}
.white {
	background: #fff;
}
.center {
	text-align: center;
}
.finishjb {
	padding-bottom: 10px;
	border-bottom: 1px solid #ebeef5;
}
//疾病类型下拉框
.selectjb {
	.el-input .el-input__inner {
		height: 28px!important;
		line-height: 28px!important;
	}
}
</style>
