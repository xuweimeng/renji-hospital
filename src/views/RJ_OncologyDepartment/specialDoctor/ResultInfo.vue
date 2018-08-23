<style lang="scss" scoped>
/deep/.record {
  &_box {
    .el-dialog__body {
      padding-top: 0;
    }
    
    .el-dialog{
      max-width: 730px;
      min-width: 600px;
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
        margin-left: 100px;
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
        <el-dialog top="5vh" :close-on-click-modal="false" class="record_box" title="通知详情" width="55%" :visible.sync="dialogTableVisible">
            <!-- header information -->
            <div class="record_header">
                <h3 class="record_header_name">
                    {{resultData.brxm}}
                    <span class="record_header_sexAndage">
                        {{`${baseData.brxb}${baseData.brage?('/'+baseData.brage):''}`}}
                    </span>
                    <el-tag v-if="baseData.gzTag">
                        {{baseData.gzTag}}
                    </el-tag>
                </h3>
                <h4 class="record_header_param">
                  所属科室: {{resultData.department?resultData.department:"无"}}
                </h4>
                <h4 class="record_header_param">
                  手机号码: {{resultData.mobile?resultData.mobile:"无"}}
                </h4>
                <h4 class="record_header_param">
                  预约看诊时间: {{resultData.orderTime?resultData.orderTime:'无'}}
                </h4>
            </div>
            <el-tabs v-model="currentTable"  type="border-card" >
                <el-tab-pane  name="one"  label="随访结果">
                     <ul class="record_content_list">
                        <li  class="record_content_single">
                         <el-tag>
                         是否过来 ：{{resultData.fieldValue}}
                         </el-tag>
                       </li>
                        <li class="record_content_single">
                         审核意见:{{baseData.vetRemark?baseData.vetRemark:"无"}}
                       </li>
                       <li class="record_content_single" v-if="baseData.callRemark">
                         人工外呼:{{baseData.callRemark}}
                       </li>
                     </ul>
                </el-tab-pane>
                <el-tab-pane  name="two"  label="记录详情"  v-if="recordData.length">
                    <el-tag  v-if="baseData.isArtificialCall" style="margin-bottom:10px; ">
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
                            <p v-else-if="!item.audio&&baseData.callStatus&&item.isArtificialCall">此记录为人工呼叫，暂无录音</p>
                            <p v-else-if="!item.audio&&baseData.callStatus&&!item.isArtificialCall">此记录为暂无录音</p>
                            <p v-else-if="!item.audio&&!baseData.callStatus&&!item.isArtificialCall">此记录为暂无录音</p>
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

import { AdmissionNotice } from 'RJZL_API/hospitalNotice'; // 引入 api
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
      gzTag: '',
      currentTable: 'one',
      dialogTableVisible: false,
      baseData: {

      },
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
      AdmissionNotice.resultDetail({
        adminId: this.token,
        id: id
      })
        .then(res => {
          // 基础数据赋值
          res.data.gzTag = res.gztag;
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
    }
  }
};
</script>
