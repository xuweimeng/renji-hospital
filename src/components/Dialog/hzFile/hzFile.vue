<template>
  <!-- 就诊档案 -->
	<el-dialog
		title="就诊档案"
		:visible.sync="hzDialog"
		width="650px"
		:before-close="closeFun"
		:center = "false"
		custom-class="hzDialog">
		<!-- 患者姓名 -->
		<hz-info
    :isCare="islike"
    :GzTag="GzTag"
    @childCare="childCare"></hz-info>
		<!-- 就诊时间 -->
		<visit-times></visit-times>
		<!-- 出院小结 -->
		<leave-text></leave-text>
	</el-dialog>
</template>

<script>
import { hzList } from "RJZL_API/patientList";
import HzInfo from 'components/Dialog/hzFile/hzInfo'
import VisitTimes from './visitTimes'
import LeaveText from './leaveText'
import { mapState } from 'vuex'
	export default {
    name: 'hzFile',
		data () {
			return {
        'GzTag': '', // 特别关注标签
        'islike': '', // 是否特别关注
			}
		},
		props: [
			'hzDialog'
		],
		components: {
			HzInfo,
			VisitTimes,
			LeaveText
		},
    computed: {
      ...mapState({
        "patientInfo": state => state.user.scopeRowData.row
      })
    },
		methods: {
			/**
			 * [closeFun description]
			 * @description 关闭弹框
			 * @DateTime    2018-04-18
			 */
			closeFun () {
		  	this.$emit('closeChildren', false)
      },
      /** 请求特别关注 */
      careFun () {
        hzList.getPatientRecord({
          'adminId': sessionStorage.getItem('userId'),
          'patientId': this.patientInfo.hzxxId,
        }).then((res)=>{
          if(res.code == 0) {
            this.GzTag = res.data.GzTag
            if (res.data.islike) {
              this.islike = true
            } else {
              this.islike = false
            }
          }
        }).catch((error)=>{
        	console.log(error)
        })
      },
      /** 获取子组件传递的更改的值 */
      childCare (val) {
        this.islike = val.isCare
        this.GzTag = val.GzTag
        if(!val.islike) {
          this.$emit('closeChildren', false)
        }
      }
    },
    watch: {
      hzDialog(newV, oldV) {
        if(newV) {
          this.careFun()
        }
      }
    }
	}
</script>

<style lang="scss">
.hzDialog{
  .el-dialog__header {
    text-align: left;
    border-bottom: 1px solid #ececec;
    .el-dialog__title {
      font-size: 14px;
      color: #666;
    }
  }
  .el-dialog__body {
    padding: 0;
    .content{
       padding-top: 20px;
      //就诊时间
      .resolveBtn {
        border-top: 1px solid #e4f4ff;
        border-bottom: 1px solid #e4f4ff;
        padding: 2px 10px;
        margin: 18px 0 0;

        .el-col {
          .swiper-container {
            color: #767978;
            .swiper-wrapper {
              width: 90%;
              margin: 0 auto;
              .swiper-slide {
                text-align: center;
                margin-right: 15px!important;
              }
            }
            .swiper-button-next {
              background-image:none!important;
            }
            .swiper-button-prev {
              background-image:none!important;
            }
          }
        }
      }
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
    }
  }
}
</style>