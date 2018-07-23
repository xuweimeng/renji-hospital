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
    &_box {
      max-height: 300px;
      overflow-y: auto;
      border-top: 2px solid #f1f1f1;
    }
    &_list {
      padding: 0;
      margin: 0;
    }
    &_single {
      color: #666;
      font-size: 12px;
      margin-bottom: 10px;
    }
    &_content {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      margin-top: 10px;
    }
    &_audio{
      max-height: 600px; 
      overflow-y: auto;
    }
    &_param {
      width: 50%;
      color: #333;
      font-size: 12px;
      margin-top: 5px;
    }
    &_AI {
      display: flex;
      align-items: center;
      > span {
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 15px;
        color: #fff;
        border-radius: 50%;
        background-color: #f80;
        max-width: 60%;
      }
      > p {
        border-radius: 5px;
        background-color: #f3f3f3;
        margin-left: 15px;
        box-sizing: border-box;
        padding: 8px 15px;
        color: #333;
        position: relative;
        &::after {
          content: "";
          display: block;
          position: absolute;
          left: -15px;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          width: 0;
          border: 8px solid transparent;
          border-right-color: #f3f3f3;
        }
      }
    }
    &_patient {
      box-sizing: border-box;
      width: 100%;
      padding-left: 40%;
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      align-items: center;
      > span {
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 15px;
        color: #fff;
        border-radius: 50%;
        background-color: #409eff;
        max-width: 60%;
        margin-left: 15px;
      }
      >div{
        box-sizing: border-box;
        margin-right: 55px;
        margin-top: 10px;
        background-color: #f1f1f1;
        border-radius: 5px;
        padding: 5px 10px;
      }
      > p {
        border-radius: 5px;
        background-color: #ffd6d6;
        box-sizing: border-box;
        padding: 8px 15px;
        color: #333;
        position: relative;
        &::after {
          content: "";
          display: block;
          position: absolute;
          right: -15px;
          top: 50%;
          transform: translateY(-50%);
          height: 0;
          width: 0;
          border: 8px solid transparent;
          border-left-color: #ffd6d6;
        }
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
                        {{`${baseData.brxb}${baseData.brage?('/'+baseData.brage):''}`}}
                    </span>
                    <el-tag v-show="baseData.gzTag">
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
                <el-button v-if="baseData.gzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
                <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
            </div>
            <el-tabs v-model="currentTable"  type="border-card" >
                <el-tab-pane  name="one"  label="体检结果">
                     <ul class="record_content_list">
                       <li  class="record_content_single">
                         <el-tag>
                         是否本人 ：{{resultData.isMySelfDge}}
                         </el-tag>
                       </li>
                        <li  class="record_content_single">
                         <el-tag>
                         是否到场 ：{{resultData.isComeDge}}
                         </el-tag>
                       </li>
                        <li class="record_content_single">
                         审核意见:{{baseData.vetRemark}}
                       </li>
                       <li class="record_content_single">
                         人工外呼:{{baseData.callRemark}}
                       </li>
                     </ul>
                </el-tab-pane>
                <el-tab-pane  name="two"  label="记录详情"  v-if="recordData.length">
                    <el-tag  v-if="baseData.isArtificialCall">
                        人工外呼
                    </el-tag>
                     <ul class="record_content_list record_content_audio">
                       <template v-for="(item) in recordData" >
                          <li :key="item.id+'0'" class="record_content_single record_content_AI">
                            <span>AI</span>
                            <p>{{item.question}}</p>
                          </li>
                          <li :key="item.id+'1'" class="record_content_single record_content_patient">
                            <span>客户</span>
                            <audio v-if="item.audio" :src="baseUrl+item.audio"  controls="controls" ></audio>
                            <p v-else>此记录为人工呼叫，暂无录音</p>
                            <div>
                              指标：<el-tag v-if="item.isNormal" type="primary">正常</el-tag><el-tag v-else type="error">不正常</el-tag>
                              / {{item.fieldName}} : {{item.fieldValue}}
                            </div>
                          </li>
                       </template>
                     </ul>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import { NoticeResult } from 'LQPE_API/NoticeResult'; // 引入 api
import { mapGetters } from 'vuex';
export default {
  props: {
    patientId: {
      type: String
    },
    resultData: {
      type: Object,
      default: () => {
        return {};
      }
    }
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
      currentTable: 'one',
      dialogTableVisible: false,
      baseData: {},
      baseUrl: '',
      recordData: []
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
      this.currentTable = 'one';
      NoticeResult.getPatientRecord({
        adminId: this.token,
        id: id
      })
        .then(res => {
          // 基础数据赋值
          this.baseData = res.data;
          this.baseData.isCare = !!this.baseData.gzTag;
          this.baseUrl = res.AIVOICURL;
          this.recordData =
            this.baseData.orderReplyQuestions.length > 0
              ? this.baseData.orderReplyQuestions
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
          NoticeResult.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.patientId,
            operateType: 0 // (操作类型 1:关注 0：取消关注) （必填）
          })
            .then(res => {
              this.$emit('refresh');
              this.baseData.gzTag = '';
              // this.dialogTableVisible = false;
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
          NoticeResult.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.patientId,
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