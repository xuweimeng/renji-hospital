<template>
	<div class="leaveText">
		<el-row class="visitRecords">
      <!-- 住院 -->
      <el-row v-for="(item,index) in leaveData" :key="index" v-if="leaveData.length">
        <el-row class="bed">
          <el-col :span="12">
            <span style="font-size:20px;color:#333;">住院</span>
          </el-col>
          <el-col :span="12"></el-col>
        </el-row>
        <el-row class="bedInfo" >
          <el-col :span="12">
            <span class="colorLight">入院时间 &nbsp;:&nbsp;</span>
            <span class="colorLight1">{{item.intime}}</span>
          </el-col>
          <el-col :span="12">
            <span class="colorLight">出院时间 &nbsp;:&nbsp;</span>
            <span class="colorLight1">{{item.outtime}}</span>
          </el-col>
          <el-col :span="12">
            <span>科室 &nbsp;:&nbsp;</span>
            <span>肿瘤科</span>
          </el-col>
          <el-col :span="12">
            <span class="colorLight">主治医生 &nbsp;:&nbsp;</span>
            <span class="colorLight1">{{item.mainDoctor}}</span>
          </el-col>
        </el-row>
        <el-row style="padding: 0 36px;text-align:left;">
          <el-col :span="24" style="border-bottom: 1px solid #d8f1ff;color:#333;text-indent:10px;font-size: 14px;margin-top:20px;">
            出院小结
          </el-col>
        </el-row>
        <el-row class="leaveHospital">
          <el-collapse v-model="leaveHospital" accordion>
            <el-collapse-item :title="`详情${(index+1)}`" :name="index+1">
              <el-col :span="5" class="color666">
                诊断&nbsp;:&nbsp;
              </el-col>
              <el-col :span="19" class="text-left">
                {{item.diagnose}}
              </el-col>
              <el-col :span="5" class="color666">
                治疗方案&nbsp;:&nbsp;
              </el-col>
              <el-col :span="19" class="text-left">
                {{item.treatmentPlan}}
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </el-row>
      <!-- 无信息的时候 -->
      <no-info :isHide="isHide"></no-info>
    </el-row>

	</div>
</template>

<script>
import { mapState } from 'vuex'
import { hzList } from "RJZL_API/patientList";
import NoInfo from '@/components/dialog/noInfo'
	export default {
		data () {
			return {
				leaveData: [],
        leaveHospital: ['1'],
        isHide: false
			}
    },
    components: {
      NoInfo
    },
		computed: {
			...mapState({
        "patientInfo": state => state.user.scopeRowData.row,
        "visitTime": state => state.user.visitTime
			})
    },
		methods: {
			/**
       *请求当前时间的患者信息
       *@function currentPartientInfo
       *@param {object} item 患者信息
       */
      currentPartientInfo() {
        this.leaveData = {}
        hzList.getRecordByDate({
          'adminId': sessionStorage.getItem('userId'),
          'patientId': this.patientInfo.hzxxId,
          'date': this.visitTime
        }).then((res)=>{
          if(res.code === 0) {
            this.leaveData = res.data
            if(res.data.length>0) {
              this.isHide = false
            } else {
              this.isHide = true
            }
          }
        }).catch((error)=>{
          console.log(error)
        })
      },
		},
		watch: {
      visitTime(newV, oldV) {
        console.log('newV='+newV, 'oldV='+oldV)
        // if(newV) {
          this.currentPartientInfo()
        // }
      },
			patientInfo(newV, oldV) {
        console.log(newV.hzxxId,'text', oldV.hzxxId)
        if( oldV.hzxxId != newV.hzxxId) {
          this.currentPartientInfo()
        }

      },

		}
	}
</script>

<style lang="scss">
  //就诊信息
  .visitRecords {
    background: #f9fcfe;
    height: 358px;
    padding-bottom: 20px;
    overflow-y: auto;
    .bed {
      margin: 30px 0 16px 0;
      line-height: 20px;
      .el-col {
        text-align:left;
        padding-left:45px;
      }
    }
    .bedInfo {
      .el-col {
        line-height: 28px;
        font-size: 12px;
        padding-left:45px;
        text-align:left;
        .colorLight {
          color: #666;
        }
        .colorLight1 {
          color: #333;
        }
      }
    }
    //出院小结
    .leaveHospital {
      padding: 0 46px;
        .el-collapse {
          border-top: 0;
          .el-collapse-item {
            .el-collapse-item__header {
              height: 30px;
              line-height: 30px;
              text-align: left;
              background: #f9fcfe;
              .el-collapse-item__arrow {
                line-height: 30px;
              }
            }
          }
        }
    }
    }
    [v-cloak] {
      display: none;
    }
</style>