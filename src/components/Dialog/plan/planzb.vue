<template>
  <div class='planZb'>
    <div class='planList'>
      <el-row>
        <el-col :span='24' class='colLabel'>随访方案&nbsp;:&nbsp;<span style='color: #ff6e40;'>{{modelFollplanData.schemeName}}</span></el-col>
      </el-row>
      <el-row>
        <el-col :span='24' class='colLabel'>随访次数&nbsp;:&nbsp;<span v-if='numbers'>共{{numbers}}次</span></el-col>
      </el-row>
      <el-row v-for='(item,index) in modelFollplanData.orders' :key='index'>
        <el-row>
          <el-col :span='24' class='colLabel'>
            {{item.startDate}}
          </el-col>
        </el-row>
        <el-row style='padding-left: 42px;'>
          <el-tag type='primary'
            v-for='(item1,index1) in item.CollectionIndex'
            :key='index1'
            style='margin: 5px 20px 5px 0;'>{{item1}}
          </el-tag>
        </el-row>
      </el-row>
     </div>
    <div class='content3'>
      <el-row style='height:47px;margin-top:14px;'>
        <el-col :span='12'  v-if="patientInfo.status === 0">
          <el-button type='button' @click='modelOut'>不通过</el-button>
        </el-col>
        <el-col :span='12'  v-if="patientInfo.status === 0">
          <el-button type='button' @click='modelPass'>通过</el-button>
        </el-col>
      </el-row>
      <p class="tips" v-if="patientInfo.status === 0">24小时之后自动审核通过</p>
    </div>
    <!-- 审核不通过原因弹框 -->
		<ex-select
			:noCheck='noCheck'
			@sendReason='sendReason'
			@closeChildren='closeChildren'>
		</ex-select>
  </div>
</template>

<script>
import { followUp } from 'RJZL_API/followPlan';
import { hzList } from 'RJZL_API/patientList';
import { mapState } from 'vuex';
import ExSelect from 'components/dialog/exSelect';
export default {
  data() {
    return {
      modelFollplanData: {}, // 随访详情
      collectList: [], // 指标集合
      numbers: '', // 总次数
      noCheck: false,
      ids: '',
      notPassReason: ''
    };
  },
  components: {
    ExSelect
  },
  mounted() {
    this.getView();
  },
  computed: {
    ...mapState({
      'patientInfo': state => state.user.scopeRowData
    })
  },
  methods: {
    getView() {
      followUp.detail({
        'id': this.patientInfo.id,
      }).then((res) => {
        if (res.code === 0) {
          this.modelFollplanData = res.data;
          this.numbers = res.data.orders.length;
          res.data.orders.forEach(item => {
            if (item.CollectionIndex) {
              item.CollectionIndex = item.CollectionIndex.split(',')
            }
          });
        } else {
          this.$message.error(res.message)
        }
      }).catch((error) => {
        this.$message.error(error.message)
      });
    },
    /** 不通过 */
    modelOut() {
      this.noCheck = true;
    },
    /** 通过 */
    modelPass() {
      this.handleCheck2(2, this.patientInfo.id)
    },
    sendReason (val) {
      this.notPassReason = val
      if (val != '') {
        if(val === '1') {
          this.$confirm('标记死亡后该患者的所有随访计划将终止, 确定标记该患者死亡?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.handleCheck2(1, this.patientInfo.id, val)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.handleCheck2(1, this.patientInfo.id, val)
        }
      } else {
        // this.patientInfo.id = ''
      }
    },
    closeChildren() {
      this.noCheck = false;
    },
    /**
     *审核功能
      *@function handleCheck2
      *@description 审核功能均调用这一个函数
      *@param {String} status 通过(1：不通过 2：通过)
      *@param {String} ids 患者id集合,数组转字符串
      *@param {String} notPassReason 审核不通过原因
      */
    handleCheck2(status, ids, notPassReason) {
      followUp.vet({
        'status': status,
        'ids': ids,
        'notPassReason': notPassReason,
      }).then((res)=>{
        if(res.code === 0) {
          this.$message.success(res.message)
          //vuex刷新list
          this.$store.dispatch('refresh', true)
          // 告诉子组件关闭选择不通过原因弹框
          if (this.noCheck) {
            this.noCheck = false
          }
          // 执行标记死亡的操作
          if(notPassReason === '1') {
            this.updateIsLiveFun()
          }
          // 告诉父组件关闭弹框按钮
          this.$emit('closeChildrenPlan', false)
        } else {
          this.$message.error(res.message)
        }
      }).catch((error)=>{
        this.$message.error(error.message)
      })
    },
    // 审核原因未死亡时执行标签死亡操作
    updateIsLiveFun() {
      hzList.updateIsLive({
        'hzxxId': this.patientInfo.hzxxId,
        'isDed': '1'
      }).then((res) => {
      });
    }
  },
  watch: {
    /** 监听患者id是否变化 */
    patientInfo(newV, oldV) {
      if (newV.id !== oldV.id) {
        this.getView();
      }
    }
  }
}
</script>

<style lang='scss'>
  .planZb {
    .planList {
      height: 400px;
      overflow-y: auto;
      margin-top: 16px;
      padding: 16px 20px;
      background: #f8fbfe;
      border-top: 1px solid #e4f4ff;
      border-bottom: 1px solid #e4f4ff;
      .el-row .colLabel {
        text-align: left;
        line-height: 24px;
      }
    }
    .content3 {
      .el-row {
        .el-col {
          line-height: 31px;
          font-size: 15px;
          .el-button {
            font-size: 15px;
            margin-top: 8px;
            border-radius: 15px;
          }
        }
        .el-col:nth-of-type(1) {
          text-align: right;
          .el-button {
            color: #5e5e5e;
            background: #fff;
            margin-right: 10px;
            padding: 7px 36px;
          }
        }
        .el-col:nth-of-type(2) {
          text-align: left;
          .el-button {
            background: #ff6e40;
            color: #fff;
            margin-left: 10px;
            padding: 7px 43px;
          }
        }
      }
    }
    .tips {
      font-size:12px;
      text-align: center;
      padding-bottom: 10px;
    }
  }
</style>
