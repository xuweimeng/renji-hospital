<template>
  <div class="hzResult">
    <!-- 选择随访次数 -->
    <el-row class="resultNumber">
      <el-col :span="4">随访结果&nbsp;:&nbsp;</el-col>
      <el-col :span="15"></el-col>
      <el-col :span="5">
        <el-select v-model="checked" placeholder="请选择" class="selectNum" @change="numberChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
     <!-- 指标详情 -->
    <el-row class="targetResult">
      <!-- 审核意见 -->
      <el-row v-show="vetRemark">
        <el-col :span="4">人工审核意见:</el-col>
        <el-col :span="20">{{vetRemark}}</el-col>
      </el-row>
        <!-- 审核意见 -->
      <el-row v-show="callRemark">
        <el-col :span="4">外呼审核意见:</el-col>
        <el-col :span="20">{{callRemark}}</el-col>
      </el-row>
      <!-- 指标详情 -->
      <el-row class="targetDetails" style="padding: 0 0 10px;">
        <div
          v-for="(item, index) in modelData"
          :key="index+2"
          style="display:inline-block;height:20px;line-height:20px;margin-bottom:10px;float:left;padding-right: 20px;">
          <span v-if="item.fieldName">{{item.fieldName}}&nbsp;:&nbsp;</span>
          <el-tag :type="item.isNum" v-if="item.fieldValue" style="height:20px;line-height: 18px;margin-top:10px;">{{item.fieldValue==''?'无':item.fieldValue}}
          </el-tag>
        </div>

        <!-- 无数据 -->
        <el-row v-if="!modelData.length" style="height: 250px;">
          <el-col :span="12" style="height: 250px;line-height:286px;text-align:right;">
            <img src="../../../assets/images/animal.png" style="margin-right:20px;" alt="">
          </el-col>
          <el-col :span="12" style="height: 250px;line-height:250px;text-align:left;">
            <span>这个病人没有随访指标哦...</span>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
    <!-- 随访问题语音 -->
    <el-row class="resultVoice">

      <el-col :span="24" class="elCol18">
        <el-collapse accordion value="1">
          <el-collapse-item name="1">
            <template slot="title">
              <el-row>
                <el-col :span="4" style="text-align:left;">
                  <div class="collapseTitle">记录详情&nbsp;:&nbsp;</div>
                </el-col>
              </el-row>
            </template>
            <!-- 是否人工外呼 -->
            <el-row>
              <el-col :span="24" v-show="isArtificialCall==1">
                <el-tag type="primary" style="margin-bottom: 10px;">人工外呼</el-tag>
              </el-col>
            </el-row>
            <el-row v-if="!modelData.length" style="padding-top:20px;"><span>这个病人没有语音记录哦...</span></el-row>
            <!--一键播放语音-->
            <!-- <el-row class="sum-voice-row" v-if="mergePathWav">
              <div class="sum-voice">
                一键播放所有语音
                <audio :src="mergePathWav" controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </el-row> -->
            <el-row class="voiceRow" v-for="item in modelData" :key="item.id" v-if="modelData.length">
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
                  <audio :src="yyHrec +item.audio" controls="controls" style="margin-top: 7px;"></audio>
                  <div class="arrows1"></div>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="answer-text-wrap">
                  <span class="answer-text">
                    {{item.asr}}
                  </span>
                </div>
              </el-col>
              <el-col :span="24" class="hzms" >( 指标：{{item.isNormal?'正常':'不正常'}} /  {{item.fieldName}} : {{item.fieldValue}} )</el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { followUp } from 'RJZL_API/followPlan'
import { Point } from 'utils/selectOptions'
  export default {
    data () {
      return {
        options: [], // select的下拉数据
        checked: null, // 已选择的num
        modelData: {}, // num对应的次数
        yyHrec: '', // 网址前缀
        targetTab: [], //指标tab
        mergePathWav:'',//一键语音合成的语音地址
        vetRemark: '', // 人工审核意见
        isArtificialCall: '', // 外呼审核意见
        callRemark: '' // 0:不是人工，1：人工
      }
    },
    computed: {
      ...mapState({
        "patientInfo": state => state.user.scopeRowData.row
      })
    },
    mounted () {
      this.selecList()
    },
    methods: {
      /** 查看第几次随访 */
      numberChange (value) {
        console.log(value)
        this.getDetails(value)
      },
      /** total随访次数 */
      selecList () {
        this.options.length = 0
        let numMax = this.patientInfo.totalNum.split('/')
        for(let i =1;i<=numMax[1];i++) {
          this.options.push(new Point(i))
        }
        this.$nextTick(function () {
          this.checked = Number(numMax[0])
          this.getDetails(this.checked)
        })

      },
      getDetails (num) {
        followUp.getVisistOrderResult({
          'taskId': this.patientInfo.taskId,
          'num': num
        }).then((res)=>{
          if (res.code == 0) {
            //判断指标类型
            res.data.forEach((item)=> {
              //指标tab
              if(item.isNum) {
                this.targetTab.push(item.fieldName)
              }
              if(item.isNormal) {
                if(item.isNum) {
                  item.isNum = ''
                }else {
                  item.isNum = 'success'
                }
              }else if(!item.isNormal) {
                item.isNum = 'danger'
              }
            })
            //模态框数据
            this.modelData = res.data
            this.yyHrec = res.AIVOICURL
            this.callRemark = res.callRemark
            this.isArtificialCall = res.isArtificialCall
            this.vetRemark = res.vetRemark

            //一键语音合成--获得visitOrderId
            // if(res.visitOrderId){
            //   this.mergeWav(res.visitOrderId)
            // }
          } else {
            this.$message.error(error.message)
          }
        }).catch((error)=>{
					this.$message.error(error.message)
          console.log(error)
        })
      },
      /** 当前选中的tab */
      handleClick1 (tab) {
        console.log(tab.label)
      },
      /**
       * 详情语音合成
       */
      // mergeWav(id){
      //   API.AdmissionNotice.mergeWav({
      //     id:id
      //   })
      //   .then(res => {
      //     if(res.code!=0){
      //       this.$message.error('语音合成失败：'+ res.message)
      //     }
      //     this.$message.error(error.message)
      //     this.mergePathWav= res.mergePath;
      //   })
      // }
    },
    watch: {
      patientInfo(newV, oldV) {
        if( newV.taskId != oldV.taskId) {
          this.selecList()
        }
      }
    }
  }
</script>

<style lang="scss">
  //随访结果
  .resultNumber {
    padding: 0 20px;
    height: 43px;
    line-height: 43px;
    margin-bottom: 5px;
    .el-col:nth-of-type(1) {
      text-align:left;
      color:#000;
      font-size: 13px;
    }
    .el-col:nth-of-type(2) {
      margin-top: 21px;
      height: 0;
      border-bottom: 1px dotted #ebebeb;
    }
    .el-col:nth-of-type(3) {
      .selectNum {
        .el-input__inner {
          border: none;
          height: 24px;
          line-height: 24px;
        }
      }
    }
  }
  .targetResult {
    padding: 0 20px;
  }
  //语音详情
  .resultVoice {
    padding: 0 20px;
    .elCol18 {
      .el-collapse {
        .el-collapse-item {
          .el-collapse-item__content .voiceRow  {
            .aiyuyin{
              .ai {
                float: left;
                width: 40px;
                height: 40px;
                text-align: center;
                border-radius: 40px;
                background: #ffb782;
                color: #fff;
                line-height: 40px;
              }
              .aiWords {
                margin-top: 10px;
                padding: 2px 0;
                float: left;
                width: 205px;
                text-align: left;
                color: #666;
                line-height: 20px;
                min-height: 40px;
                background: #f4f4f4;
                border-radius: 5px;
                padding-left: 10px;
                margin-left: 10px;
                background: #f4f4f4 ;
                position: relative;
                span{
                  font-size: 12px;
                }
                .arrows {
                  width: 5px;
                  height: 8px;
                  position: absolute;
                  left: -4px;
                  top: 10px;
                  background: url(../../../assets/images/aizc.png) left center no-repeat;
                }
              }
            }
            .hzyuyin {
              .hzhead {
                float: right;
                width: 40px;
                height: 40px;
                text-align: center;
                border-radius: 40px;
                background: #8bc4ff;
                color: #fff;
                line-height: 40px;
              }
              .hzWords {
                margin: 10px 10px 0 10px;
                float: right;
                width: 270px;
                min-height: 40px;
                background: #dfefff;
                border-radius: 5px;
                padding-left: 18px;
                position: relative;
                audio {
                  width: 90%;
                }
                .arrows1 {
                  width: 5px;
                  height: 8px;
                  position: absolute;
                  right: -4px;
                  top: 10px;
                  background: url(../../../assets/images/hzzc.png) left center no-repeat;
                }
              }
            }
            .hzms {
              text-align: right;
              color: #8bc4ff;
              padding-right: 55px;
            }
          }
        }
      }
    }
  }
  .answer-text-wrap{
    width:320px;
    float:right;
    text-align: left;
    background-color: #dfefff;
    padding:2px;
    margin: 5px 0;
    border-radius: 4px;
    .answer-text{
      display: inline-block;
      width: 100%;
      background-color: white;
      padding: 4px 7px;
      box-sizing: border-box;
      font-size: 12px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      color: #666;
    }
  }
  .sum-voice-row{
    background-color: #dfefff;
    padding:2px;
    color:#666;
    margin-bottom: 20px;
    border-radius: 4px;
    text-align: center;
    .sum-voice{
      height: 32px;
      line-height: 32px;
      margin: 7px;
    }
    audio{
      float: right;
    }
  }
</style>
