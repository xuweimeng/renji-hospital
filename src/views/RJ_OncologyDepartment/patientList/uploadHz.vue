<template>
	<div class="uploadHz">
		<el-row style="background: #fbfbfb;padding: 10px">
		  <el-col :span="12" :offset="6">
				<el-steps :active="step" align-center>
					<el-step title="上传信息" icon="el-icon-edit"></el-step>
					<el-step title="完善信息" icon="el-icon-upload"></el-step>
					<el-step title="上传完成" icon="el-icon-success"></el-step>
				</el-steps>
		  </el-col>
		  <el-col :span="6"></el-col>
		</el-row>
		<transition name="el-zoom-in-top">
		<div class="stepContent" v-if="step === 0">
			<step1 @stepFun="stepFun"></step1>
		</div>
		</transition>
		<div class="step2" v-if="step === 1">
		  <step2 :step="step"></step2>
		</div>
	</div>
</template>

<script>
	import { hzList } from 'RJZL_API/patientList'
	import Step1 from './step/step1'
	import Step2 from './step/step2'
	export default {
		data () {
			return {
				// API: API,
				data1: {
					adminId: sessionStorage.getItem('userId')
				},
				step: 0, // 步骤
			}
		},
		components: {
			Step1,
			Step2
		},
		mounted () {},
		methods: {
			/**
			 * [stepFun description]
			 * @description 监听子组件的step1的step
			 * @DateTime    2018-04-19
			 */
			stepFun (val) {
				this.step = val
			},
		}
	}
</script>

<style lang="scss">
.uploadHz {
	position: absolute;
	top: 0;
	bottom:0;
	left:0;
	right: 0;
	background: #fff;
	z-index: 100;
	.stepContent {
		position:relative;
		width: 100%;
		min-height: 600px;
		background: #fff;
	}
	.step2 {
		.upnum .el-col{
			color: #999;
			padding: 10px 20px;
			border-bottom: 1px solid #f0f0f0;
			span {
				color: red;
			}
			strong {
				color: #000;
			}
		}
		.el-tabs {
			.el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll {
				padding-left: 20px;
			}
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
</style>
