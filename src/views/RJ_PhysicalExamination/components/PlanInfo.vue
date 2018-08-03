<style lang="scss" scoped>
/deep/.record {
  &_box {
    .el-dialog__body {
      padding-top: 0;
    }
  }
  &_header {
    position: relative;
    &_name {
      margin: 5px 0;
      color: #409eff;
      font-size: 20px;
      font-weight: 400;
    }
    &_sexAndage {
      font-size: 12px;
      color: #666;
      margin: 0 20px;
    }
    &_param {
      margin: 10px 0;
      font-weight: 400;
      color: #f80;
      font-size: 14px;
    }
    &_cancel {
      position: absolute;
      top: 0;
      right: 30px;
    }
  }
  &_content {
    border-top: 5px solid #dadada;
    margin-top: 15px;
    padding-top: 5px;
    >h4{
      font-weight: 400;
      font-size: 14px;
      margin: 5px 0;
      color: #f80;
    }
    &_step{
      margin-top: 15px;
      p{
        margin: 5px 0;
        color: #666;
      }
    }
  }
}
</style>

<template>
    <div class="record">
        <el-dialog top="5vh" :close-on-click-modal="false" class="record_box" title="通知详情" width="55%"  :visible.sync="dialogTableVisible">
            <!-- header information -->
            <div class="record_header">
                <h3 class="record_header_name">
                    {{baseData.brxm}}
                    <span class="record_header_sexAndage">
                        {{baseData.znjqrHzxx.csny}}
                    </span>
                    <el-tag v-if="baseData.gzTag">
                        {{baseData.gzTag}}
                    </el-tag>
                </h3>
                <h4 class="record_header_param">
                  手机号码: {{baseData.phone?baseData.phone:"无"}}
                </h4>
                <h4 class="record_header_param">
                  体检套餐: {{baseData.icdName?baseData.icdName:"无"}}
                </h4>
                <h4 class="record_header_param">
                  证件号码: {{baseData.identificationCard?baseData.identificationCard:'无'}}
                </h4>
                <h4 class="record_header_param">
                  预约时间: {{baseData.orderTime?baseData.orderTime:"无"}}
                </h4>
                <el-button v-if="baseData.gzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
                <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
            </div>
            <div class="record_content">
              <h4>通知方案：{{baseData.schemeName}}</h4>
              <h4>通知次数：总共{{baseData.totalNum}}次</h4>
              <el-steps class="record_content_step" v-if="ordersList.length>0" direction="vertical" :active="ordersList.length">
                <el-step v-for="(item,index) in ordersList" :key="item.id" :title="`第${index+1}次通知`">
                  <div slot="description">
                    <p>开始通知时间:{{item.dateEnd}}</p>
                    <el-tag type="primary">
                      {{item.CollectionIndex}}
                    </el-tag>
                  </div>
                </el-step>
              </el-steps>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { NoticePlan } from 'LQPE_API/NoticePlan'; // 引入 api
import { mapGetters } from 'vuex';
export default {
  props: {
    patientId: {
      type: String
    },
    hzxxId:{
      type: String
    },
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {
    patientId: {
      handler(val) {
        this.getBaseData(val);
      }
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      baseData: {
        znjqrHzxx: {

        }
      },
      ordersList: []
    };
  },
  mounted() {},
  methods: {
    /**
     * @function 获取基础数据
     * @param  {type} id {description}
     * @return {type} {description}
     */
    getBaseData(id) {
      NoticePlan.planInfo({
        adminId: this.token,
        id: id
      })
        .then(res => {
          // 基础数据赋值
          this.baseData = res.data;
          this.ordersList =
            this.baseData.orders.length > 0
              ? this.baseData.orders
              : [];
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * @function 取消关心
     * @return {type} {description}
     */
    cancelSpecial() {
      this.$msgbox({
        title: '消息',
        message: '确定取消关心吗',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done();
        }
      })
        .then(action => {
          // 取消关注
          NoticePlan.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.hzxxId,
            operateType: 0 // (操作类型 1:关注 0：取消关注) （必填）
          })
            .then(res => {
              this.baseData.gzTag = '';
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * @function 添加关注
     * @return {type} {description}
     */
    addSpecial() {
      this.$prompt('请填写关注标签（不超过5个字符）', '添加关注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '不得超过5个字'
      })
        .then(({ value }) => {
          if (value.trim().length > 5 || value.trim().length === 0) {
            this.$message({
              type: 'error',
              message: '格式不对，不能为空，不能超过5个字符'
            });
            return false;
          }
          NoticePlan.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.hzxxId,
            operateTag: value,
            operateType: 1 // (操作类型 1:关注 0：取消关注) （必填）
          })
            .then(res => {
              this.$set(this.baseData, 'gzTag', value);
              this.$message({
                type: 'success',
                message: '成功添加关注'
              });
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    }
  }
};
</script>
