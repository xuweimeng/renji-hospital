<template>
  <div class="hzResult">
    <!-- 指标详情 -->
    <el-row class="targetResult">
      <el-col :span="24" class="fileName">
        <span>是否本人&nbsp;:&nbsp;</span>
        <el-tag>
          {{isData.isMySelf=='0'?'否':isData.isMySelf=='1'?'是':'暂未采集到结果'}}
        </el-tag>
        <span>是否过来入院&nbsp;:&nbsp;</span>
        <el-tag>
          {{ isData.isCome==0?"不来":isData.isCome==1?"来":isData.isCome==2?'改约':'暂未采集到结果' }}
        </el-tag>
      </el-col>
    </el-row>
    <!-- 外呼处理意见 -->
    <el-row class="suggestions">
      <el-col :span="24">
        人工审核意见： <el-tag>{{isData.vetRemark?isData.vetRemark: '暂无意见'}}</el-tag>
        </el-col>
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
            <!-- 有数据的时候 -->
            <!--一键播放语音-->
            <el-row class="sum-voice-row" v-if="mergePathWav">
              <div class="sum-voice">
                一键播放所有语音
                <!--todo src替换,此row的v-if判断-->
                <audio :src="mergePathWav" controls="controls">
                  Your browser does not support the audio element.
                </audio>
              </div>
            </el-row>
            <!-- 是否人工外呼 -->
            <el-row>
              <el-col :span="24" v-show="isData.isArtificialCall==1">
                <el-tag type="primary" style="margin-bottom: 10px;">人工外呼</el-tag>
              </el-col>
            </el-row>
            <!-- 语音列表 -->
            <el-row class="voiceRow"
              v-if="isData.orderReplyQuestions.length"
              v-for="item in isData.orderReplyQuestions"
              :key="item.id">
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
                  <audio :src="AIVOICURL +item.audio" controls="controls" style="margin-top: 7px;"></audio>
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
            </el-row>
            <!-- 没数据的时候 -->
            <el-row
              v-if="showTipes"
              style="padding-top:20px;">
              <span>这个病人没有语音记录哦...</span>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showTipes: false // 是否有语音
      }
    },
    props: [
      'isData',
      'AIVOICURL',
      'mergePathWav'
    ],
    watch: {
      /** 监听是否有语音 */
      isData(newV, oldV) {
        if (newV.orderReplyQuestions.length>0) {
          this.showTipes = false
        } else {
          this.showTipes = true
        }
      }
    }
  }
</script>

<style lang="scss">
  //  是否本人
  .targetResult {
    margin-top: 10px;
    padding: 0 20px;
    border-top: 1px solid #eee;
    .fileName{
      padding: 20px 0;
      margin-bottom:10px;
      height:30px;
      line-height:30px;
      span {
        float: left;
      }
      .el-tag {
        float: left;
        margin-right: 20px;
      }
    }
  }
  .suggestions {
    padding-left: 20px;
    line-height: 50px;
    height: 50px;
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
                width: 290px;
                min-height: 40px;
                background: #dfefff;
                border-radius: 5px;
                padding-left: 10px;
                position: relative;
                audio {
                  width: 96%;
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
    width:340px;
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
  .tagCome {
    height:20px;
    line-height: 18px;
    margin-top:10px;
  }
</style>
