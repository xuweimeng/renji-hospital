<template>
  <div class="noInfo">
    <el-row v-if="visitTime ==''?isHide=true:isHide=false">
      <el-col :span="12" >
        <img :src="imgsrc" style="margin-right:20px;" >
      </el-col>
      <el-col :span="12">
        <span >{{spanText}}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
  export default {
    data () {
			return {
        imgsrc: require('../../assets/images/animal.png'),
        spanText: '这个病人没有就诊信息哦...'
			}
    },
    computed: {
			...mapState({
        "visitTime": state => state.user.visitTime
			})
    },
    methods: {
      isHideFun () {

      }
    },
    watch: {
      // visitTime(newV, oldV) {
      //   console.log(newV, 'tet', oldV)
      //   if(newV === '') {
      //     this.isHide = true
      //   }
      // }
		}
  }
</script>

<style lang="scss">
  .noInfo .el-row {
    height: 250px;
    .el-col {
      height: 250px;
    }
    .el-col:nth-of-type(1) {
      line-height:386px;
      text-align:right;
    }
    .el-col:nth-of-type(2) {
      line-height:350px;
      text-align:left;
    }
  }
</style>
