<template>
	<div class="exSelect">
		<!-- 审核不通过 -->
		<el-dialog
			title="审核不通过原因"
			:visible.sync="noCheckDg"
			width='450px'
			:before-close="resetBtn"
			:append-to-body="true"
			custom-class="checknoPass">
				<el-row slot>
				 <el-col :span='24' >
					<el-select v-model='notPassParams.notPassReason' placeholder='请选择' style="width: 80%;" >
						<el-option  v-for='item in checkoptions' :key='item.value' :label='item.label' :value='item.value' v-show="item.value!='6'"></el-option>
					</el-select>
				</el-col>
         <el-col :span='24' >
					<el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5}"
            placeholder="请输入内容"
            v-model="notPassParams.notPassRemark"
            style="margin-top: 20px;width: 80%">
          </el-input>
				</el-col>
				<el-col
					:span='24'
					class='btnCheck'
					style='margin-top:28px;'
					>
					<el-button type='primary' @click='sureBtn'>确定</el-button>
					<el-button type='info' @click='resetBtn'>取消</el-button>
				</el-col>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>

<script>
	import notpassReasonOptions from './notpassReason'
	import { AdmissionNotice } from 'RJZL_API/hospitalNotice';
	import { mapState } from 'vuex';
	export default {
		name: 'notPassDialog',
		data () {
			return {
        noCheckDg: false,
				checkoptions: notpassReasonOptions,
				notPassParams: {
					notPassReason: '',
					notPassRemark: ''
				}
			}
		},
		props: [
			'checkId'
		],
		computed: {
    ...mapState({
      'patientInfo': state => state.user.scopeRowData.row,
    })
  },
		methods: {
			sureBtn() {
				// 判断是从详情终止还是从页面终止
				let ids = []
				if(this.checkId&&this.checkId.length) {
					ids = this.checkId
				} else {
					ids.push(this.patientInfo.taskId);
				}
				// 判断非空
				if(this.notPassParams.notPassReason == ''||this.notPassParams.notPassRemark==''){
					this.$message.error('请填写审核不通过原因！')
				} else {
					this.handleCheck(ids)
					
				}
      },
			/** 关闭弹框 */
      resetBtn() {
				this.notPassParams.notPassReason = ''
				this.notPassParams.notPassRemark = ''
				this.noCheckDg = false
      },
			// 终止
			handleCheck(ids) {
				AdmissionNotice
					.cancelNotice({
						adminId: sessionStorage.getItem('userId'),
						ids: ids,
						notPassReason: this.notPassParams.notPassReason,
						notPassRemark: this.notPassParams.notPassRemark
					})
					.then(res => {
						if (res.code === 0) {
							this.noCheckDg = false
							this.$message.success(res.message)
							this.$emit('getNotPassReason',true)
						}else {
							this.$message.error(res.message)
						}
						this.notPassParams.notPassReason = ''
						this.notPassParams.notPassRemark = ''
					})
					.catch(error => {
						this.notPassParams.notPassReason = ''
						this.notPassParams.notPassRemark = ''
						this.$message.error(error.message)
					});
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