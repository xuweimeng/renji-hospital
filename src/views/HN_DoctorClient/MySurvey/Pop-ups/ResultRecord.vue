<style lang="scss" scoped>
/deep/.record {
  &_dialog {
    .el-dialog__body {
      padding-top: 10px;
      border-top: 1px solid #dadada;
    }
  }
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
      margin-bottom: 15px;
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
      font-size: 13px;
      line-height: 20px;
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
      color:#666;
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
        <el-dialog width="900px" top="5vh" class="record_dialog" title="记录详情" :visible.sync="recordVisible" >
            <div class="record_header">
                <h3 class="record_header_name">
                    {{baseData.brxm}}
                    <span class="record_header_sexAndage">
                        {{baseData.brxb}}/{{baseData.brage}}
                    </span>
                </h3>
                <h4 class="record_header_param">
                    联系电话: {{baseData.mobile}}
                </h4>
                <h4 class="record_header_param">
                    医疗组/科室: {{baseData.departmentName||baseData.medGpName}}
                </h4>
                <h4 class="record_header_param">
                    出院时间/就诊时间: {{baseData.diagnoseTime}}
                </h4>
                <h4 class="record_header_param">
                    随访方案: {{baseData.schemeName}}
                </h4>
            </div>
           
            <el-tabs v-model="currentTable"  type="border-card" >
                <el-tab-pane  name="one"  label="体检结果">
                     <ul class="record_content_list">
                       <li  class="record_content_single">
                            您对医生的技术水平的评价是
                            <el-tag>
                            {{baseData.orderResult.technical}}
                            </el-tag>
                       </li>
                        <li  class="record_content_single">
                            您对医生的服务态度的评价是：
                            <el-tag>
                            {{baseData.orderResult.service}}
                            </el-tag>
                       </li>
                        <li class="record_content_single">
                            您对医院“廉洁行医，医德医风”的评价是：
                            <el-tag>
                            {{baseData.orderResult.medicalEthics}}
                            </el-tag>
                       </li>
                       <li class="record_content_single">
                            您对医院提供的环境设施、后勤服务的评价是：
                            <el-tag>
                            {{baseData.orderResult.environmental}}
                            </el-tag>
                       </li>
                       <li class="record_content_single">
                            您对医疗费用的总体评价是：
                            <el-tag>
                            {{baseData.orderResult.medicalExpense}}
                            </el-tag>
                       </li>
                       <li class="record_content_single">
                            您此次就诊的总体评价为：
                            <el-tag>
                            {{baseData.orderResult.evaluate}}
                            </el-tag>
                       </li>
                     </ul>
                </el-tab-pane>
                <el-tab-pane  name="two"  label="记录详情"  v-if="baseData.orderReplyQuestions.length">
                    <el-tag  v-if="baseData.isArtificialCall">
                        人工外呼
                    </el-tag>
                     <ul class="record_content_list record_content_audio">
                       <template v-for="(item) in baseData.orderReplyQuestions" >
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
export default {
  data() {
    return {
        recordVisible:false, 
        currentTable: 'one'
    };
  },
  props: {
    baseData: {
      type: Object,
      default: () => {
        return {
            orderResult:{},
            orderReplyQuestions:[],
        };
      }
    },
    baseUrl: {
      type: String,
      default: '',
    }
  }
};
</script>

