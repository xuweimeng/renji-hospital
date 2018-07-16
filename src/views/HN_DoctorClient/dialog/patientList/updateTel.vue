
<template>
  <div class="update_tel">
    <!-- 弹出手机号码修改 -->
    <el-dialog
      :visible.sync="modalShow"
      title="修改手机号"
      width="500px"
      class="update_tel_dialog"
    >
      <el-form label-position="right" label-width="90px">
        <el-form-item label="原手机号">
          <el-input v-model="patientRecord.mobile" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改手机号">
          <el-input v-model="phone" type="number" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="toggleShowModal">放弃修改</el-button>
        <el-button type="primary" @click="getProject">确定修改</el-button>
      </div>
    </el-dialog>
    <!-- 弹出存在的随访方案 -->
    <el-dialog
      :visible.sync="finishShow"
      title="修改确认"
      width="750px"
      center
    >
      <el-alert
        :title="'您所修改的手机号码  '+phone+'  有其他计划正在执行'"
        type="warning"
        :closable="false"
        description="请问您是否需要终止其他计划，或者直接放弃修改号码。"
        show-icon
        v-show="tableData.length>0">
      </el-alert>
      <el-table
        v-show="tableData.length>0"
        :data="tableData"
        max-height="500"
      >
        <el-table-column
          prop="brxm"
          align="center"
          label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.brxm}}</span>
            <el-tag v-show="scope.row.brxm == patientRecord.brxm">本人</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="mobile"
          align="center"
          label="当前联系电话">
        </el-table-column>
        <el-table-column
          prop="icdName"
          align="center"
          label="疾病类型">
        </el-table-column>
        <el-table-column
          prop="schemeName"
          align="center"
          label="方案名称">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.status != 4"
              @click="handleStopPlan(scope)">终止方案</el-button>
            <el-button
              size="mini"
              disabled
              v-if="scope.row.status == 4"
            >已终止</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button type="primary" @click="changeCode">确定修改</el-button>
        <el-button @click="finishShow = false">放弃修改</el-button>
      </div>
    </el-dialog>
    <!-- 弹出终止随访的选项 -->
    <el-dialog
      :visible.sync="reasonShow"
      title="终止随访"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="选择终止原因">
          <el-select v-model="selectReason" size="small" style="width:200px">
            <el-option v-for="item in finshReason" :value="item.value" :key="item.value">{{ item.value }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填写终止备注">
          <el-input v-model="notPassRemark" type="textarea" :rows="4" placeholder="必填，请填写终止备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="reasonShow = false">取消</el-button>
        <el-button type="primary" @click="finishProject">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { UpdateTel } from 'HNDC_API/PatientList_updateTel';
  import mixin from '@/assets/HN_DoctorClient/js/mixin';
  export default {
    name: 'updateTel',
    data() {
      return {
        finishShow: false /* 是否显示终止随访方案 */,
        reasonShow: false /* 是否显示终止原因弹框 */,
        modalShow: false,
        finshReason: [
          {
            key: 1,
            value: '患者已死亡'
          },
          {
            key: 1,
            value: '患者不接受随访'
          },
          {
            key: 1,
            value: '随访方案重复'
          },
          {
            key: 1,
            value: '方案不匹配'
          }
        ] /* 终止原因列表 */,
        selectProject: '' /* 当前操作的随访计划的id */,
        selectReason: '' /* 选择的终止原因 */,
        notPassRemark: '' /* 终止随访的备注 */,
        tableData: [], // 随访计划列表
        phone: '', // 新手机号
        patientRecord: {}, // 患者信息，含原手机号
        userId: ''
      };
    },
    props: {
      // 原手机号
      visitOrderId: {
        type: String,
        default: ''
      },
      patientId: {
        type: String,
        default: ''
      }
    },
    mixins: [mixin],
    methods: {
      /**
       * @function 切换显示弹框
       * @return {type} {description}
       */
      toggleShowModal() {
        this.modalShow = !this.modalShow;
        if (this.modalShow === true) {
          this.phone = '';
          // 解决偶现的patientId为空的情况
          if (this.patientId) {
            this.getPatientInfo();
          } else {
            setTimeout(() => {
              this.getPatientInfo();
            }, 0);
          }
        }
      },
      /**
       * @function 终止方案
       * @return {type} {description}
       */
      finishProject() {
        if (!this.selectReason) {
          this.$message({
            message: '请选择终止原因',
            type: 'warning'
          });
          return false;
        }
        if (!this.notPassRemark) {
          this.$message({
            message: '请填写终止备注',
            type: 'warning'
          });
          return false;
        }
        UpdateTel
          .finishProject({
            id: this.selectProject.id, // id
            notPassReason: this.selectReason, // 未通过原因:1,患者已死亡;2,患者不接受随访;3,随访方案重复;4,方案不匹配;
            notPassRemark: this.notPassRemark
          })
          .then(res => {
            this.reasonShow = false;
            this.selectProject.status = 4;
          })
          .catch(rer => {});
      },
      /**
       * @function  修改手机号
       * @return {type} {description}
       */
      changeCode() {
        UpdateTel
          .changeMobile({
            patientId: this.patientId,
            oldPhone: this.patientRecord.mobile, // 修改前的手机号
            newPhone: this.phone // 要修改成的号码
          })
          .then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.finishShow = false;
            this.reasonShow = false;
            this.modalShow = false;
          })
          .catch(rer => {
            console.log(rer);
          });
      },
      /**
       * @function 获取随访中的方案
       * @return {type} {description}
       */
      getProject() {
        if (!this.phone) {
          this.$message({
            message: '请填写手机号码',
            type: 'warning'
          });
          return false;
        }
        if (this.phone === this.patientRecord.mobile) {
          this.$message({
            message: '手机号码和原号码相同',
            type: 'warning'
          });
          return false;
        }
        UpdateTel
          .getProject({
            patientId: this.patientId,
            oldPhone: this.patientRecord.mobile, // 修改前的手机号
            newPhone: this.phone // 要修改成的号码
          })
          .then(res => {
            // 多加了一个参数isNeedShow判断是否要弹出 正在执行的随访弹框
            if (res.data.length > 0 && res.isNeedShow) {
              /* 展示终止页面 */
              this.finishShow = true;
              this.tableData = res.data;
              this.modalShow = false;
            } else {
              /* 调用直接终止方法 */
              this.changeCode();
            }
          })
          .catch(rer => {});
      },
      /**
       * @function 终止方案 按钮点击时调用
       * @return {type} {description}
       */
      handleStopPlan(scope) {
        /* 清空选择，显示选项框 */
        this.selectReason = '';
        this.selectProject = scope.row;
        this.notPassRemark = '';
        this.reasonShow = true;
      }
    }
  };
</script>
<style>
  /*去掉谷歌，火狐下的type="number"中的右边箭头*/
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
    -webkit-appearance: none !important;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }
</style>
