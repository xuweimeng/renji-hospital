<template>
  <div class="planDg">
    <el-dialog
      title="随访方案"
      :visible.sync="planDg"
      width="525px" top="30px"
      :before-close="closeFun"
      :center = "false"
      custom-class="hzDialog">
        <!-- 患者个人信息 -->
        <!-- 患者姓名 -->
        <hz-info
        :isCare="islike"
        :GzTag="GzTag"
        @childCare="childCare"></hz-info>
        <!-- 患者随访方案 -->
        <plan-zb
        @closeChildrenPlan="closeFun"></plan-zb>
    </el-dialog>
  </div>
</template>

<script>
  import { API } from "@/serve";
  import { mapState } from 'vuex'
  import HzInfo from '../hzFile/hzInfo'
  import PlanZb from './planzb'
  export default {
    data () {
      return {
        'GzTag': '', // 特别关注标签
        'islike': '', // 是否特别关注
      }
    },
    props: [
			'planDg'
    ],
    components: {
      HzInfo,
      PlanZb
		},
    computed: {
      ...mapState({
        patientInfo: 'hzFileRows'
      })
    },
    methods: {
			/**
			 * [closeFun description]
			 * @description 关闭弹框
			 * @DateTime    2018-04-18
			 */
			closeFun () {
		  	this.$emit('closeChildrenPlan', false)
      },
      /** 请求特别关注 */
      careFun () {
        API.followUp.detail({
          'id': this.patientInfo.id,
        }).then((res)=>{
          if(res.code == 0) {
            if(res.gztag) {
              this.GzTag = res.gztag
            }else {
              this.GzTag = res.GzTag
            }
            if (res.islike) {
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
      }
    },
    watch: {
      planDg(newV, oldV) {
        if (newV) {
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

    }
  }
}
</style>
