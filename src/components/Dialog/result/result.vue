<template>
  <div class="resultDg">
    <el-dialog
      title="随访记录"
      :visible.sync="resultDg"
      width="850" top="30px"
      :before-close="closeFun"
      :center = "false"
      custom-class="hzDialog">
      <!-- 患者个人信息 -->
     <!-- 患者姓名 -->
      <hz-info
      :isCare="islike"
      :GzTag="GzTag"
      @childCare="childCare"></hz-info>
      <!-- 患者指标随访结果 -->
      <hz-result></hz-result>
    </el-dialog>
  </div>
</template>

<script>
  import { API } from "@/serve"
  import { mapState } from 'vuex'
  import HzInfo from '../hzFile/hzInfo'
  import HzResult from '@/components/dialog/result/hzResult'
  export default {
    data () {
      return {
        'GzTag': '', // 特别关注标签
        'islike': '', // 是否特别关注
      }
    },
    props: [
			'resultDg'
    ],
    components: {
      HzInfo,
      HzResult
		},
    computed: {
      ...mapState({
        scope: 'hzFileRows'
      })
    },
    mounted () {
      this.careFun()
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
        API.hzList.getPatientRecord({
          'adminId': sessionStorage.getItem('userId'),
          'patientId': this.scope.id,
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
