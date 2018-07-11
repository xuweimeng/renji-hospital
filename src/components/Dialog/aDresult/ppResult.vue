<template>
  <div class="resultDg">
    <el-dialog
      title="随访记录"
      :visible.sync="resultDg"
      width="850px"
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
      <hz-result
      :isData="isData"
      :AIVOICURL="AIVOICURL"
      :mergePathWav="mergePathWav"></hz-result>
    </el-dialog>
  </div>
</template>

<script>
  import { API } from "@/serve"
  import { mapState } from 'vuex'
  import HzInfo from '../hzFile/hzInfo'
  import HzResult from '@/components/dialog/aDresult/pphzResult'
  export default {
    data () {
      return {
        'GzTag': '', // 特别关注标签
        'islike': '', // 是否特别关注
        'isData': {}, // res.data
        'AIVOICURL': '', // 语音前缀
        'mergePathWav':''//一键语音合成地址
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
      careFun (id) {
        this.islike = false
        this.GzTag = ''
        // this.AIVOICURL = ''
        API.AdmissionNotice.resultDetail({
          'adminId':sessionStorage.getItem('userId'),
          'id': id,
        }).then((res)=>{
          if(res.code === 0) {
            this.GzTag = res.gztag
            if (res.islike) {
              this.islike = true
            } else {
              this.islike = false
            }
            this.isData = res.data
            this.AIVOICURL = res.AIVOICURL
            // 有语音记录，再拉取一键合成语音的数据
            if(res.data.orderReplyQuestions.length>0){
              // this.mergeWav(id)
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
      },
      /**
       * 详情语音合成
       */
      mergeWav(id){
        API.AdmissionNotice.mergeWav({
          id:id
        })
          .then(res => {
            if(res.code!=0){
              this.$message.error('语音合成失败：'+ res.message)
            }
            this.mergePathWav= res.mergePath;
          })
      }
    },
    watch: {
      scope(newV, oldV) {
        if(newV.id) {
          this.careFun(newV.id)
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
