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
      &_cancel {
        position: absolute;
        top: 0;
        right: 30px;
      }
    }
    &_opinion {
      border-top: 3px solid #eee;
      padding-top: 15px;
      > span {
        font-size: 14px;
        color: #409eff;
        font-weight: 700;
      }
      button {
        margin-left: 20px;
      }
    }
    &_content {
      &_table {
        margin-top: 25px;
      }
      &_name {
        font-size: 16px;
        color: #409eff;
        margin-bottom: 5px;
        font-weight: 400;
        margin-top: 0;
      }
      &_link {
        display: inline-block;
        color: #666;
        margin: 0 0 0 40px;
        vertical-align: bottom;
        cursor: pointer;
        font-weight: 400;
        line-height: 18px;
        padding: 0 5px;
        background: #409eff;
        color: #fff;
        border-radius: 3px;
      }
      &_msg {
        font-size: 16px;
        color: #409eff;
        margin-bottom: 5px;
        font-weight: 400;
        margin-top: 10px;
      }
      &_box {
        max-height: 300px;
        overflow-y: auto;
        border-top: 2px solid #f1f1f1;
      }
      &_list {
        padding: 0;
        margin: 0;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        border-bottom: 1px solid #dadada;
        padding-bottom: 15px;
      }
      &_single {
        color: #409eff;
        font-size: 12px;
        width: 25%;
        margin-bottom: 5px;
        color: #f80;
      }
      &_text {
        color: #555;
      }
      &_content {
        display: flex;
        flex-wrap: wrap;
        padding-top: 10px;
        margin-top: 10px;
        padding-left: 0;
        > h6 {
          width: 100%;
          margin: 5px;
          color: #409eff;
        }
      }
      &_step {
        margin-top: 15px;
      }
      &_param {
        width: 50%;
        color: #333;
        font-size: 12px;
        margin-top: 5px;
      }
      &_audio {
        max-height: 350px;
        overflow-y: auto;
        border: none;
        padding-bottom: 30px;
      }
      &_AI {
        display: flex;
        align-items: center;
        width: 60%;
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
          flex-shrink: 0;
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
        > div {
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
          margin-bottom: 0;
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
    &_check {
      &_name {
        margin: 5px 0;
        color: #409eff;
        font-weight: 400;
        font-size: 14px;
      }
      &_text {
        font-size: 12px;
        margin: 5px 0;
        padding: 5px 10px;
        background-color: #f1f1f1;
        border-radius: 3px;
      }
    }
  }
</style>

<template>
  <div >
    <!-- 随访记录 -->
    <el-dialog title="随访记录"
               class="record_dialog"
               :visible.sync="dialogVisible"
               width="900px"
               top="30px"
               :center = "false"
               v-loading="fullscreenLoading">
      <div class="content" slot>
        <!-- 个人信息 -->
        <div class="record_header">
          <h3 class="record_header_name">
            {{baseData.brxm}}
            <span class="record_header_sexAndage">
                    {{baseData.brxb}}/{{baseData.brage}}
                </span>
            <el-tag v-if="baseData.GzTag">
              {{baseData.GzTag}}
            </el-tag>
          </h3>
          <h4 class="record_header_param">
            <!--出生年月: {{baseData.patientBithday}}-->
            疾病诊断: {{baseData.icdName}}
          </h4>
          <h4 class="record_header_param">
            手机号码: {{baseData.mobile}}
          </h4>
          <h4 class="record_header_param">
            <!--联系地址: {{baseData.patientAddress}}-->
            随访方案: {{baseData.schemeName}}
          </h4>
          <el-button v-if="baseData.GzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
          <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
        </div>
        <div class="record_opinion">
          <span>处理意见:</span>
          <el-button size="small" type="primary" round
                     :disabled="(selectOptions[currentTable-1] && selectOptions[currentTable-1].isResolved === true) || tabActive==1"
                     :icon="(selectOptions[currentTable-1] && selectOptions[currentTable-1].resolvedState === 2)?'el-icon-check':''"
                     @click="submission">暂不处理</el-button>
          <el-button size="small" type="primary" round
                     :disabled="(selectOptions[currentTable-1] && selectOptions[currentTable-1].isResolved === true) || tabActive==1"
                     :icon="(selectOptions[currentTable-1] && selectOptions[currentTable-1].resolvedState === 0)?'el-icon-check':''"
                     @click="submission">病情稳定</el-button>
          <el-button size="small" type="primary" round
                     :disabled="(selectOptions[currentTable-1] && selectOptions[currentTable-1].isResolved === true) || tabActive==1"
                     :icon="(selectOptions[currentTable-1] && selectOptions[currentTable-1].resolvedState === 1)?'el-icon-check':''"
                     @click="submission">通知就诊</el-button>
        </div>

        <el-tabs @tab-click="currentPartientInfo" v-model="currentTable" v-if="selectOptions.length" type="border-card" class="record_content_table">
          <el-tab-pane v-for="(item,index) in selectOptions" :key="index" :name="item.value+''"  :label="`第${index+1}次随访`">
            <el-tabs tab-position="right" style="height: 400px;">
              <el-tab-pane label="随访结果">
                <el-alert
                  v-if="!item.modelData.length"
                  title="暂无相关数据"
                  type="warning"
                  show-icon>
                </el-alert>
                <ul class="record_content_list">
                  <li v-for="(ite,index) in item.modelData" :key="index+2" class="record_content_single">
                    {{ite.fieldName}}：
                    <el-tag :type="ite.resultType">
                      {{ite.fieldValue==''?'无':ite.fieldValue}}
                    </el-tag>
                  </li>
                </ul>
                <h4 class="record_check_name" >AI审核意见:</h4>
                <p class="record_check_text" >{{item.vetRemark || '暂无意见'}}</p>
                <h4 class="record_check_name"  v-if="item.isArtificialCall == 1">人工外呼意见:</h4>
                <p class="record_check_text"  v-if="item.isArtificialCall == 1">{{item.callRemark || '暂无人工外呼意见'}}</p>
              </el-tab-pane>
              <!-- 循环遍历出所有的随访相关图标 -->
              <el-tab-pane label="指标图表" v-if="item.targetTab.length">
                <el-tabs v-model="item.targetClick" @tab-click="targetClick" >
                  <el-tab-pane  v-for="ite in item.targetTab" :name="ite.name" :label="ite.name" :key="ite.name">
                    <line-chart :name="ite.name" v-if="ite.dataList.length>0" :chart-data="ite.dataList"></line-chart>
                  </el-tab-pane>
                </el-tabs>
              </el-tab-pane>
              <el-tab-pane label="随访详情">
                <el-alert
                  v-if="!item.modelData.length"
                  title="暂无相关数据"
                  type="warning"
                  show-icon>
                </el-alert>
                <el-tag  v-if="item.isArtificialCall">
                  人工外呼
                </el-tag>
                <ul class="record_content_list record_content_audio">
                  <template v-for="ite in item.modelData" >
                    <li :key="ite.id+'0'" class="record_content_single record_content_AI">
                      <span>AI</span>
                      <p>{{ite.question}}</p>
                    </li>
                    <li :key="ite.id+'1'" class="record_content_single record_content_patient">
                      <span>客户</span>
                      <audio v-if="ite.audio" :src="baseUrl+ite.audio"  controls="controls" ></audio>
                      <p v-else-if="item.isArtificialCall == 1">此记录为人工呼叫，暂无录音</p>
                      <p v-else>此记录暂无录音</p>
                      <div>
                        指标：<el-tag v-if="ite.isNormal" type="primary">正常</el-tag>
                        <el-tag v-else type="error">不正常</el-tag>
                        / {{ite.fieldName}} : {{ite.fieldValue}}
                      </div>
                    </li>
                  </template>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>


      </div>
    </el-dialog>
    <!-- 处理意见 -->
    <el-dialog
      title="处理意见确认"
      :visible.sync="adviceCheckDialog"
      width="500px"
      custom-class="adviceModel">
      <span v-if="btnState!=''&&btnState=='2'">
        您选择的是"暂不处理"，您确认不需要给患者({{baseData.brxm}})任何提醒?
      </span>
      <span v-if="btnState!='2'">
        您选择的是{{btnState==0?'"病情稳定"':btnState==1?'"通知就诊"':''}}，患者将收到以下信息:
      </span>
      <br><br>
      <span v-if="btnState=='0'">
      【{{baseData.brxm}},您好！根据您这次的随访结果，请务必遵从医嘱用药，并定期来医院门诊复诊。】
      </span>
      <span v-if="btnState=='1'" style="margin-top: 20px;">
      【{{baseData.brxm}},您好！根据您这次的随访结果，建议您及时来医院门诊复诊。】
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adviceCheckDialog = false; btnState = ''">选错了</el-button>
        <el-button type="primary" @click="clyjBtn">{{btnState=='2'?'不需要':'确定'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  /**
   * 随访记录
   * @module followRecord
   */
  import { FollowRecord } from 'KMJB_API/common/followRecord';
  import mixin from '@/assets/KMJB_DoctorClient/js/mixin';
  import LineChart from './Chart';
  export default {
    components: {
      LineChart
    },
    data() {
      return {
        currentTable: '1', // 当前选中的次数
        baseData: {}, // 患者基本信息
        dialogVisible: false,
        fullscreenLoading: false, // 加载随访记录弹框时的全屏加载动画
        selectOptions: [
          {
            modelData: [],
            targetTab: [
              {
                name: null,
                dataList: []
              }
            ]
          }
        ], // 随访记录弹框 随访结果的第几次选择信息
        baseUrl: '', // 语音地址前缀
        adviceCheckDialog: false, // 选择处理意见后的确认弹框是否显示
        btnState: '', // 当前处理意见类型
        isResolved: '', // 是否可以点击 处理意见 的三个选项按钮
        resolvedState: '' // 处理意见 的三个选项按钮的选中num依次2,0,1
      };
    },
    props: {
      patientId: {
        type: String,
        default: null
      },
      tabActive: {
        type: String,
        default: '1'
      },
      taskId: {
        type: String,
        default: null
      },
      sfNumber: {
        type: String,
        default: null
      }
    },
    // 含getPatientInfo,handleislike两个方法
    mixins: [mixin],
    methods: {
      /**
       * 切换弹框的显示
       * @function toggleShowModal
       */
      toggleShowModal() {
        this.dialogVisible = !this.dialogVisible;
        if (this.dialogVisible) {
          this.$nextTick(() => {
            this.getPatientInfo().then(res => {
              this.baseData = res.data;
              // 重新请求情况下清空选项数据集合
              this.selectOptions = [];
              this.getResultInfo(this.sfNumber);
              this.currentTable = this.sfNumber + '';
            });
          });
        }
      },
      /**
       *@function 点击table标签查看第几次随访
       * @param {String} value
       */
      currentPartientInfo(value) {
        this.targetTab = [];
        const num = value.name;
        if (!this.selectOptions[num - 1] || !this.selectOptions[num - 1].alreadyHave) {
          this.getResultInfo(num);
        }
      },
      /**
       * @function 获取table对象的随访结果
       * @param {String} num 第几次随访
       * @param {String} taskId 随访taskid
       */
      getResultInfo(num) {
        this.fullscreenLoading = true;
        // 再次请求情况下
        this.targetTab = [];
        FollowRecord.getVisistOrderResult({
          num: num,
          taskId: this.taskId
        })
          .then(res => {
            if (!res.count) {
              this.fullscreenLoading = false;
              return false;
            }
            // 随访次数拼接
            if (!this.selectOptions.length) {
              for (let i = 1; i <= res.count; i++) {
                this.selectOptions.push({
                  value: i,
                  label: '第' + i + '次',
                  targetTab: [],
                  targetClick: null,
                  modelData: []
                });
              }
            }
            // 详情数据赋值
            this.selectOptions[num - 1].modelData = this.dataFormTarget(res.data);
            // 标记是否拿过该次的数据,tab切换时判断使用
            this.selectOptions[num - 1].alreadyHave = true;
            // target图表赋值
            if (this.targetTab.length) {
              this.selectOptions[num - 1].targetTab = this.targetTab;
              this.selectOptions[num - 1].targetClick = this.targetTab[0].name;
              this.targetClick({
                label: this.targetTab[0].name
              });
            }
            this.baseUrl = res.AIVOICURL;
            this.fullscreenLoading = false;
            this.selectOptions[num - 1].visitOrderId = res.visitOrderId;
            this.getSchemeName(num);
            const diseaseInfo = res.diseaseInfo;
            this.selectOptions[num - 1].resolvedState = diseaseInfo;
            if (diseaseInfo === undefined || diseaseInfo === -1) {
              this.selectOptions[num - 1].isResolved = false;
            } else {
              this.selectOptions[num - 1].isResolved = true;
            }
          })
          .catch(error => {
            this.fullscreenLoading = false;
            console.log(error);
          });
      },
      /**
       * @function 图表table点击
       * @return {type} {description}
       */
      targetClick(val) {
        FollowRecord.getChartData({
          hzxxId: this.patientId,
          fieldName: val.label
        }).then(res => {
          for (const item of this.selectOptions) {
            for (const ite of item.targetTab) {
              if (ite.name = val.label) {
                ite.dataList = res.data;
                return false;
              }
            }
          }
        }).catch(err => {
          console.log(err);
        });
      },
      /**
       * @function 对指标类型进行格式化处理
       * @param  {type} data {description}
       * @return {type} {description}
       */
      dataFormTarget(data) {
        data.forEach(item => {
          // 查看当前指标是否为数值类型
          if (item.isNum) {
            this.targetTab.push(
              {
                name: item.fieldName,
                dataList: []
              }
            );
          }
          if (item.isNormal) {
            if (item.resultType) {
              item.resultType = '';
            } else {
              item.resultType = 'success';
            }
          } else if (!item.isNormal) {
            item.resultType = 'danger';
          }
        });
        return data;
      },
      /**
       * 查询 处理意见、是否人工审核、随访方案 接口
       * @function getSchemeName
       */
      getSchemeName(num) {
        const visitOrderId = this.selectOptions[num - 1].visitOrderId;
        FollowRecord.getDiseaseInfo({ visitOrderId }).then(res => {
          this.baseData.schemeName = res.data.schemeName;
          // AI意见vetRemark,处理意见diseaseInfo,是否人工isArtificialCall,人工意见callRemark--都在res中
          this.selectOptions[num - 1].vetRemark = res.data.vetRemark;
          this.selectOptions[num - 1].isArtificialCall = res.data.isArtificialCall;
          this.selectOptions[num - 1].callRemark = res.data.callRemark;
        });
      },
      /**
       * @function 处理意见按钮
       * @param {event} ev 获取点击的按钮的内容
       */
      submission(ev) {
        this.adviceCheckDialog = true;
        const innerText = ev.target.innerText;
        this.btnState =
          innerText === '暂不处理' ? 2 : innerText === '病情稳定' ? 0 : 1;
      },
      /**
       *处理意见询问
       *@function clyjBtn
       */
      clyjBtn() {
        this.clyj(this.btnState);
      },
      /**
       *处理意见
       *@function clyj
       *@param {String} visitOrderId perVisitOrderId
       *@param {String} diseaseInfo diseaseInfo
       */
      clyj(btnState) {
        // console.log(this.selectOptions);
        const visitOrderId = this.selectOptions[this.currentTable - 1] ? this.selectOptions[this.currentTable - 1].visitOrderId : '';
        if (!visitOrderId) {
          this.$message.error('记录id为空！');
          return false;
        }
        // console.log(visitOrderId);
        // return false;
        FollowRecord.updateDiseaseInfo({
          visitOrderId: visitOrderId,
          diseaseInfo: btnState
        })
          .then(res => {
            this.adviceCheckDialog = false;
            this.dialogVisible = false;
            this.resolvedState = btnState;
            // 刷新列表数据
            this.$emit('refreshData');
          })
          .catch(error => {
            console.log(error);
          });
      }

    }
  };
</script>
