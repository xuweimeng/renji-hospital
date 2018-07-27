<template>

  <div class="cancelAll">
    <el-dialog title="终止原因"
      :visible.sync="cancelDialog"
      width="450px"
      :before-close = "dgFailBtn"
      :center = "false"
      custom-class="checknoPass">
			<el-row slot>
				 <el-col :span="24" >
					<el-select v-model="notPassReason" placeholder="请选择终止原因" popper-class="selectOut" style="width: 350px;">
						<el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-col>
        <el-col :span="24">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入详情(必填)"
            v-model="notPassRemark"
            :style="{'width':'350px','marginTop': '20px'}">
          </el-input>
        </el-col>
				<el-col
					:span="24"
					class="btnCheck"
					style="margin-top:28px;">
					<el-button type="primary" @click="dgPassBtn" style="margin-right: 30px;">确定</el-button>
					<el-button type="info" @click="dgFailBtn">取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
  </div>
</template>
<script>
import { hzList } from 'RJZL_API/patientList'
export default {
  name: 'CancelAll',
  data () {
    return {
      notPassReason: "", //选中的审核不通过
      notPassRemark: '', //不通过详情
      checkoptions: [
        {
          value: "",
          label: "请选择"
        },
        {
          //审核不通过options
          value: "1",
          label: "患者已死亡"
        },
        {
          value: "2",
          label: "患者不接受随访"
        },
        {
          value: "3",
          label: "随访方案重复"
        },
        {
          value: "4",
          label: "方案不匹配"
        }
      ],
      isClose: {
        close: false, // 是否关闭
        response: false // 是否请求成功
      }
    }
  },
  props: [
    'cancelDialog',
    'rowData'
  ],
  mounted (){
  },
  methods: {
    /** 弹框点击不通过确定 */
    dgPassBtn() {
      if(!this.notPassReason) {
        this.$message.error('请选择终止原因!')
      } else if(!this.notPassRemark) {
        this.$message.error('请填写详情!')
      } else {
        this.handleCheck()
      }
    },
    /** 终止原因--取消 */
    dgFailBtn () {
      this.$emit('closeCancelDialog', this.isClose)
      this.notPassReason = ''
      this.notPassRemark = ''
    },
     /**
     *审核功能
     */
    handleCheck() {
      hzList
        .cancleall({
          id: this.rowData.id,
          notPassReason: this.notPassReason,
          notPassRemark: this.notPassRemark
        })
        .then(res => {

          if (res.code == 0) {
            this.notPassReason = ''
            this.notPassRemark = ''
            this.$message.success(res.message)
            // 返回父组件请求结果
            this.isClose.response = true
            this.$emit('closeCancelDialog', this.isClose)
          }else {
            this.$emit('closeCancelDialog', this.isClose)
            this.$message.error(res.message)
          }
        })
        .catch(error => {
          this.$emit('closeCancelDialog', this.isClose)
          this.$message.error(error.message)
        });
    },
  }
}
</script>
<style lang="scss">
  .cancelAll {
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
  }
</style>