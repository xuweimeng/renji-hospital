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
  &_opinion{
    border-top: 3px solid #eee;
    padding: 15px 0;
    >span{
      font-size: 14px;
      color: #409eff;
      font-weight: 700;
    }
    button{
      margin-left: 20px;
    }
    button.active{
      background-color: #b3e19d;
      border-color: #b3e19d;
    }
  }
  &_table {
    .el-tabs__item {
      height: auto;
    }
    &_name {
      margin: 0;
      text-align: center;
      line-height: 20px;
      padding: 5px 0;
      box-sizing: border-box;
      font-size: 13px;
      > span {
        display: block;
      }
    }
  }
  &_content {
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
    }
    &_single {
      color: #409eff;
      font-size: 12px;
      width: 50%;
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
  }
}
</style>

<template>
  <div class="sffaDailog sfDialog">
    <!-- 随访记录 -->
    <el-dialog title="随访记录"
        :visible.sync="dialogVisible"
        width="900px"
        top="30px"
        :center = "false"
        custom-class="sffaDailog"
        v-loading="fullscreenLoading">
      <div class="content" slot>
        <!-- 个人信息 -->
        <div class="record_header">
            <h3 class="record_header_name">
                {{baseData.brxm}}
                <span class="record_header_sexAndage">
                    {{baseData.brxb}}/{{baseData.brage}}
                </span>
                <el-tag v-show="baseData.GzTag">
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
        <!--  处理意见 -->
        <div class="record_opinion">
          <span>处理意见:</span>
          <el-button size="small" type="primary" round  :disabled="isResolved === true || tabActive==1" :class="[{active: resolvedState === 2}]" @click="resolveBTN">暂不处理</el-button>
          <el-button size="small" type="primary" round  :disabled="isResolved === true || tabActive==1" :class="[{active: resolvedState === 0}]" @click="resolveBTN">病情稳定</el-button>
          <el-button size="small" type="primary" round  :disabled="isResolved === true || tabActive==1" :class="[{active: resolvedState === 1}]"  @click="resolveBTN">通知就诊</el-button>
        </div>

        <el-tabs v-model="currentTable"  type="border-card" @tab-click="numberChange" v-show="selectOptions.length > 0">
            <el-tab-pane v-for="(item,index) in selectOptions" :key="index" :name="item.value+''"  :label="`第${index+1}次随访`">
                 <ul class="record_content_list">
                       <li v-for="(ite, index) in modelData" :key="index+2" class="record_content_single">
                            {{ite.fieldName}}：
                            <el-tag :type="ite.isNum">
                            {{ite.fieldValue==''?'无':ite.fieldValue}}
                            </el-tag>
                       </li>

                  </ul>
                  <h4 class="record_check_name" >AI审核意见</h4>
                  <p class="record_check_text" >{{checkAdvice || '暂无意见'}}</p>
                  <h4 class="record_check_name"  v-if="baseData.isArtificialCall == 1">人工外呼意见</h4>
                  <p class="record_check_text"  v-if="baseData.isArtificialCall == 1">{{baseData.callRemark || '暂无人工外呼意见'}}</p>
            </el-tab-pane>
        </el-tabs>
        <!-- 随访结果 -->
        <el-row class="resultNumber" v-if="false">
          <el-col :span="4" class="elCol5">随访结果&nbsp;:&nbsp;</el-col>
          <el-col :span="16" class="elCol6"><div></div></el-col>
          <el-col :span="4" class="elCol7">
            <el-select v-model="sfNumberSelected" placeholder="请选择" @change="numberChange">
              <el-option v-for="(item,index) in selectOptions" :key="index+1" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="targetResult" v-if="false">
          <!-- 指标详情 -->
          <el-row class="targetDetails">
            <div
              v-for="(item, index) in modelData"
              :key="index+2"
              style="display:inline-block;height:20px;line-height:20px;margin-bottom:10px;float:left;padding-right: 20px;">
              <span v-if="item.fieldName">{{item.fieldName}}&nbsp;:&nbsp;</span>
              <el-tag :type="item.isNum" v-if="item.fieldValue" style="height:20px;line-height: 18px;margin-top:10px;">{{item.fieldValue==''?'无':item.fieldValue}}
              </el-tag>
            </div>

            <el-row v-if="!modelData.length" style="height: 190px;">
              <el-col :span="12" style="height: 190px;line-height:286px;text-align:right;">
                <img src="../../../assets/HN_DoctorClient/images/animal.png" style="margin-right:20px;" alt="">
              </el-col>
              <el-col :span="12" style="height: 190px;line-height:250px;text-align:left;">
                <span>这个病人没有随访指标哦...</span>
              </el-col>
            </el-row>
          </el-row>
          <!-- 指标tab -->
          <el-row class="targetEcharts" style="background:#f9f9f9;">
            <el-col :span="24">
              <el-tabs v-model="activeName1" @tab-click="handleClick" v-if="targetTab.length">
                <el-tab-pane v-for="(item, index) in targetTab" :name="'a'+index" :label="item" :key="index+2">
                  <div :id="'a'+index" style="width:485px;height:200px;">
                    <!-- 无数据的时候不渲染echart -->
                    <el-row style="height: 200px;" v-if="showAnimal">
                      <el-col :span="12" style="height: 250px;line-height:203px;text-align:right;">
                        <img src="../../../assets/HN_DoctorClient/images/animal.png" style="margin-right:20px;">
                      </el-col>
                      <el-col :span="12" style="height: 250px;line-height:160px;text-align:left;">
                        <span>这个病人没有随访指标哦...</span>
                      </el-col>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-row>
        <!-- 随访问题语音 -->
        <el-row class="resultVoice">
          <el-col :span="24" class="elCol18">
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <el-row>
                    <el-col :span="4" style="text-align:left;">
                      <div class="collapseTitle">记录详情&nbsp;:&nbsp;</div>
                    </el-col>
                  </el-row>
                </template>
                <el-row v-if="!modelData.length" style="padding-top:20px;"><span>这个病人没有语音记录哦...</span></el-row>
                <el-row class="voiceRow" v-for="item,index in modelData" :key="item.id" v-if="modelData.length">
                  <el-tag type="info" v-if="baseData.isArtificialCall == 1 && index === 0" style="float: left;margin-bottom: 10px;">人工外呼</el-tag>
                  <el-col :span="24" class="aiyuyin">
                    <div class="ai">AI</div>
                    <div class="aiWords">
                      <span>{{item.question}}</span>
                      <div class="arrows"></div>
                    </div>
                  </el-col>
                  <el-col :span="24" class="hzyuyin">
                    <div class="hzhead">患者</div>
                    <div class="hzWords">
                      <audio :src="yyHrec +item.audio" controls="controls" style="margin-top: 7px;" v-if="item.audio"></audio>
                      <div v-if="!item.audio" class="audio_null_text">此记录为人工外呼，暂无录音</div>
                      <div class="arrows1"></div>
                    </div>
                  </el-col>
                  <el-col :span="24" class="hzms" >( 指标：{{item.isNormal?'正常':'不正常'}} /  {{item.fieldName}} : {{item.fieldValue}} )</el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
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
import { FollowRecord } from 'HNDC_API/common/followRecord';
import echarts from 'echarts';
import { Point } from '@/assets/HN_DoctorClient/js/selectOptions';
import mixin from '@/assets/HN_DoctorClient/js/mixin';
export default {
  data() {
    return {
      currentTable: '',
      dialogVisible: false,
      fullscreenLoading: false, // 加载随访记录弹框时的全屏加载动画
      baseData: {}, // 患者基本信息
      selectOptions: [], // 随访记录弹框 随访结果的第几次选择信息
      sfNumberSelected: '', // 选中第几次
      disabledBtn: 'disabledBtn', // 处理意见 按钮的类名？
      activeName1: 'a0', // 指标折线图选中下标
      modelData: [], // 随访记录 的语音详情信息
      targetTab: [], // 指标tab
      tabLabel: '', // 指标选中label
      xChart: [], // 指标折线图 参数
      yChart: [],
      yyHrec: '', // 语音地址前缀
      showAnimal: false, // 是否显示指标的图表
      adviceCheckDialog: false, // 选择处理意见后的确认弹框是否显示
      btnState: '', // 当前处理意见类型
      checkAdvice: '', // 审核意见
      isResolved: '', // 是否可以点击 处理意见 的三个选项按钮
      resolvedState: '' // 处理意见 的三个选项按钮的选中num依次2,0,1
    };
  },
  props: ['visitOrderId', 'patientId', 'taskId', 'sfNumber', 'tabActive'],
  // 含getPatientInfo,handleislike两个方法
  mixins: [mixin],
  methods: {
    /**
     * 切换随访记录弹框的显示
     * @function toggleShowModal
     */
    toggleShowModal() {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        this.$nextTick(() => {
          this.getWayResult(this.sfNumber);
          this.sfNumberSelected = this.sfNumber;
          this.currentTable = this.sfNumber + '';
          this.getPatientInfo().then(res => {
            this.baseData = res.data;
          });
        });
      }
    },
    /**
     *查看第几次随访
     *@function numberChange
     * @param {String} value val
     */
    // numberChange(value) {
    //   this.targetTab = []; // 清空数据
    //   this.getWayResult(value);
    // },
    numberChange(tab, event) {
      this.getWayResult(tab.name);
    },
    /**
     * 获取model随访结果
     * @function getWayResult
     * @param {String} num 第几次随访
     * @param {String} taskId 随访taskid
     */
    getWayResult(num) {
      this.fullscreenLoading = true;
      this.selectOptions = [];
      this.targetTab = [];
      this.modelData = [];
      FollowRecord.getVisistOrderResult({
        num: num,
        taskId: this.taskId
      })
        .then(res => {
          if (res.code === 0) {
            // 判断指标类型
            res.data.forEach(item => {
              // 指标tab
              if (item.isNum) {
                this.targetTab.push(item.fieldName);
              }
              if (item.isNormal) {
                if (item.isNum) {
                  item.isNum = '';
                } else {
                  item.isNum = 'success';
                }
              } else if (!item.isNormal) {
                item.isNum = 'danger';
              }
            });
            // 模态框数据
            this.modelData = res.data;
            this.yyHrec = res.AIVOICURL;
            this.fullscreenLoading = false;
            // 随访进度
            for (let i = 1; i <= res.count; i++) {
              this.selectOptions.push(new Point(i));
            }
            if (res.visitOrderId) {
              this.getDiseaseInfo(res.visitOrderId);
            }
            this.showAnimal = false; // 生肖隐藏
            this.activeName1 = 'a0';
            if (this.targetTab.length) {
              // 如果有长度，就请求
              this.drawChart(this.targetTab[0], 0);
            }
          }
        })
        .catch(error => {
          console.log(error);
          // this.fullscreenLoading = false
        });
    },
    /**
     * 查询处理意见接口
     * @function getDiseaseInfo
     * @param {String} visitOrderId visitOrderId
     */
    getDiseaseInfo(value) {
      FollowRecord.getDiseaseInfo({
        visitOrderId: value
      })
        .then(res => {
          if (res.code === 0) {
            if (res.data) {
              // 新增审核意见
              this.checkAdvice = res.data.vetRemark;
              // 是否处理0:病情稳定 1:通知就诊  2:暂不处理  10表示未处理
              this.resolvedState = res.data.diseaseInfo;
              if (
                res.data.diseaseInfo === 1 ||
                res.data.diseaseInfo === 2 ||
                res.data.diseaseInfo === 0
              ) {
                this.isResolved = true;
              } else {
                this.isResolved = false;
              }
            } else {
              this.resolvedState = '';
              this.isResolved = false;
            }
          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    /**
     * 处理意见按钮
     * @function resolveBTN
     * @param {event} ev 获取点击的按钮的内容
     */
    resolveBTN(ev) {
      this.adviceCheckDialog = true;
      if (ev.target.innerText === '暂不处理') {
        this.btnState = 2;
      }
      if (ev.target.innerText === '病情稳定') {
        this.btnState = 0;
      }
      if (ev.target.innerText === '通知就诊') {
        this.btnState = 1;
      }
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
     *@param {String} visitOrderId visitOrderId
     *@param {String} diseaseInfo diseaseInfo
     */
    clyj(btnState) {
      FollowRecord.updateDiseaseInfo({
        visitOrderId: this.visitOrderId,
        diseaseInfo: btnState
      })
        .then(res => {
          this.adviceCheckDialog = false;
          if (res.code === 0) {
            // this.wayDialoge = false
            // this.getList(this.param_unhandled);
            // this.getList(this.param_handled);
            this.dialogVisible = false;
            this.resolvedState = btnState;
            // 刷新列表数据
            this.$emit('refreshData');
          }
        })
        .catch(error => {
          console.log(error);
          // this.adviceCheckDialog = false
        });
    },
    /**
     *指标折线图tab切换
     *@function handleClick
     *@param {object} tab tab切换栏
     */
    handleClick(tab) {
      this.tabLabel = tab.label; // 指标
      this.drawChart(tab.label, tab.index);
    },
    /**
     *折线图
     *@function drawChart
     *@param {String} label 指标名称
     *@param {String} number 第几次随访
     */
    drawChart(label, number) {
      // 清空折线数据
      this.xChart = [];
      this.yChart = [];
      // 获取模态框指标信息
      FollowRecord.getChartData({
        hzxxId: this.patientId,
        fieldName: label
      })
        .then(res => {
          res.data.forEach(item => {
            this.xChart.push(item.dateAdd);
            this.yChart.push(item.fieldValue);
          });
          if (!this.yChart.length) {
            this.showAnimal = true;
          }
          const data1 = this.xChart;
          let data2 = [];
          const data3 = [];
          const data4 = [];
          const arrYchart = [];
          // 判断点击的是否是血压
          if (label.includes('血压')) {
            this.yChart.forEach(item => {
              arrYchart.push(item.split('/'));
            });

            arrYchart.forEach(item => {
              if (Number(item[0]) > Number(item[1])) {
                data3.push(item[0]);
                data4.push(item[1]);
              } else {
                data3.push(item[1]);
                data4.push(item[0]);
              }
            });
          }
          data2 = this.yChart;

          // 指定图表的配置项和数据
          const option1 = {
            backgroundColor: '#f9f9f9',
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: '12%',
              left: '10%',
              right: '8%',
              bottom: '12%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: data1
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: label,
                type: 'line',
                data: data2,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: 'rgba(255, 98, 66, .6)'
                      },
                      {
                        offset: 1,
                        color: 'rgba(255, 98, 66, .2)'
                      }
                    ])
                  }
                }
              }
            ]
          };
          const option2 = {
            backgroundColor: '#f9f9f9',
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: '12%',
              left: '10%',
              right: '8%',
              bottom: '12%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: data1
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: label,
                type: 'line',
                data: data3,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                }
                // markLine: {
                //   data: [
                //     [
                //       {name: '高压', xAxis: data1[0], yAxis: 140},
                //       {name: '高压', xAxis: data1[data1.length], yAxis: 140},
                //     ],

                //   ]
                // },
              },
              {
                name: label,
                type: 'line',
                data: data4,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                }
                // markLine: {
                //   data: [
                //     [
                //       {name: '低压', xAxis: data1[0], yAxis: 85},
                //       {name: '低压', xAxis: data1[data1.length], yAxis: 85},
                //     ],

                //   ]
                // },
              }
            ]
          };
          let idCon = 'a' + number;

          if (label.includes('血压')) {
            if (data3.length) {
              idCon = echarts.init(document.getElementById(idCon));
              idCon.setOption(option2);
            }
          } else if (data2.length > 0) {
            idCon = echarts.init(document.getElementById(idCon));
            idCon.setOption(option1);
          } else {
            this.showAnimal = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>


