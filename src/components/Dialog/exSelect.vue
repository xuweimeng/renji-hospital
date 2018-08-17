<template>
	<div class="exSelect">
		<!-- 审核不通过 -->
		<el-dialog
			title="审核不通过原因"
			:visible.sync="noCheck"
			width="350px"
			:center = "false"
			:before-close="closeFun"
			:append-to-body="true"
			custom-class="checknoPass">
			<el-row slot>
				 <el-col :span="24" >
					<el-select
						v-model="selectCheck"
						placeholder="请选择"
						@change="changeSelect"
						popper-class="selectOut">
						<el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-col>
				<el-col
					:span="24"
					class="btnCheck"
					style="margin-top:28px;">
					<el-button type="primary" @click="sureFun">确定</el-button>
					<el-button type="info" @click="closeFun">取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				checkoptions: [ // 审核不通过options
					{
	          value: '',
	          label: '请选择'
	        },
	        {
	          value: '1',
	          label: '患者已死亡'
	        }, {
	          value: '2',
	          label: '患者不接受随访'
	        }, {
	          value: '3',
	          label: '随访方案重复'
	        }, {
	          value: '4',
	          label: '方案不匹配'
	        }
	       ],
				selectCheck: '' // 选中的审核不通过
			}
		},
		props: [
			'noCheck'
		],
		// mounted() {
		// 	this.selectCheck = ''
		// },
		methods: {
			/**
			 *审核不通过的原因
			 *@function changeSelect
			 *@param {String} value 审核不通过的原因
			 */
			  changeSelect(value) {
				 	this.selectCheck = value
			  },
			  /** 关闭弹框 **/
			  closeFun () {
					if (this.selectCheck) {
						this.selectCheck = ''
					}
					this.$emit('closeChildren', false)
					this.$emit('sendReason', this.selectCheck)
			  },
			  /**
			   * [sureFun description]
			   * @description 确定按钮，传递不通过原因给父组件
			   * @DateTime    2018-04-17
			   */
			  sureFun () {
			   	if(this.selectCheck) {
						  this.$emit('sendReason', this.selectCheck)
						  this.$emit('closeChildren', false)
						  this.selectCheck = ''
					} else {
						 this.$message.error('请选择不通过原因！')
					}
			  }
		}
	}
</script>

<style lang="scss">
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
    	  text-align: center;
      .el-row .btnCheck {
        .el-button {
          padding: 6px 19px;
          color: #fff;
					border: none;
        }
      }
    }
  }
</style>