<template>
	<div class="sfPlan">
		<el-row class="personInfo">
      <el-col :span="12" class="elCol1">
      	<span class="personName careColor" v-if="patientInfo">
          {{patientInfo.brxm?patientInfo.brxm:patientInfo.patientName?patientInfo.patientName:''}}
        </span>
      	<span class="personSex careColor" v-if="patientInfo">
          {{patientInfo.brxb?patientInfo.brxb:patientInfo.patientSex?patientInfo.patientSex:''}} /
          {{patientInfo.age?patientInfo.age:patientInfo.patientAge?patientInfo.patientAge:''}}
        </span>
      	<span class="personXg">{{GzTag?GzTag:patientInfo.gzTag}}</span></el-col>
      <el-col :span="12" class="elCol2">
        <el-button type="text"
        	@click="handleislike"
        	:class="{ careColor: isCare}">
          <i class="iconfont"
          :class="{ careColor: isCare}"
          :style="{marginRight:5+'px', fontSize:12+'px'}">&#xe604;</i>
          {{isCare?'取消关心':'特别关心'}}
        </el-button>
      </el-col>
    </el-row>
    <el-row class="personResult">
      <el-col :span="12" class="elCol3"><span class="elCol3Span1">疾病名称&nbsp;:&nbsp;</span><span class="elCol3Span2">{{patientInfo.icdName}}</span></el-col>
      <el-col :span="12" class="elCol3"></el-col>
    </el-row>
    <el-row class="personResult">
      <el-col :span="12" class="elCol3"><span class="elCol3Span1">手机号码&nbsp;:&nbsp;</span><span class="elCol3Span2">{{patientInfo.mobile}}</span></el-col>
      <el-col :span="12" class="elCol3"></el-col>
    </el-row>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { commonUrl } from 'RJZL_API/commonUrl'
	export default {
		data () {
			return {}
    },
    props: [
      'isCare',
      'GzTag'
    ],
		computed: {
			...mapState({
				"patientInfo": state => state.user.scopeRowData.row
			})
		},
		methods: {
			/**
       * [handleislike description]
       * @description
       */
			handleislike() {
        if(this.isCare) {
          //取消关注
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('div', {
              style:'text-align:center'
            }, [
            h('img', {
                attrs: {src: require('../../../../static/images/animal.png')},
                style:'width: 60px;height:52px;margin:0 auto;'
              },null),
              h('p', null, '确定取消关心吗?'),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'careMsgBox',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle',
            beforeClose: (action, instance, done) => {
              done();
              this.patientInfo.GzTag = ''
            }
          }).then(action => {
            //取消关注
            commonUrl.updateGz({
              'adminId': sessionStorage.getItem('userId'), //医生ID
              'patientId': this.patientInfo.hzxxId,//患者的id （必填）
              'operateType': 0,//(操作类型 1:关注 0：取消关注) （必填）
              'operateTag':'', //关注的标签
              'diagnoseType': '4'
            }).then((res)=>{
              if(res.code == 0) {
                let pp = {
                  isCare: false,
                  GzTag: ''
                }
                this.$emit('childCare', pp)
              }
            }).catch((error)=>{
              console.log(error)
            })
          }).catch(()=>{

          });
        }else {
          //增加关注
          this.$prompt('  ','添加标签', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入标签',
            customClass: 'careMsgBoxAdd',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle',
          }).then(({ value }) => {
            if(!value) {
              this.$message.error('标签不能为空!');
            }else if(value.toString().length<6){
              commonUrl.updateGz({
                'adminId': sessionStorage.getItem('userId'), //医生ID
                'patientId': this.patientInfo.hzxxId,//患者的id （必填）
                'operateType': 1,//(操作类型 1:关注 0：取消关注) （必填）
                'operateTag': value, //关注的标签
                'diagnoseType': '4'
              }).then((res)=>{
                if(res.code == 0) {
                  let pp = {
                  isCare: true,
                  GzTag: value
                }
                this.$emit('childCare', pp)
                this.$message.success('关注成功!')
                }
              }).catch((error)=>{
                console.log(error)
              })
            }else{
              this.$message.error('标签长度不能大于5!')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
		}
	}
</script>

<style lang="scss">
  .personInfo {
    padding: 10px 20px;
    line-height: 27px;
    height: 27px;
    margin-bottom: 8px;
    .elCol1 {
      line-height: 27px;
      height: 27px;
      text-align: left;
      .personName {
        font-size: 19px;
      }
      .personSex {
        font-size: 12px;
        margin-left: 12px;
      }
      .personXg {
        font-size: 12px;
        color: #c0c0c0;
        margin-left: 12px;
      }
    }
    .elCol2 {
      line-height: 27px;
      height: 27px;
      text-align: right;
      .el-button {
        padding: 5px 7px;
        color: #777;
        background: #fdfdfd;
        border: 1px solid #ffe6de;
      }
    }
  }
  .personResult {
    padding: 0 20px;
    .elCol3 {
      font-size: 13px;
      text-align: left;
      .elCol3Span1 {
        color: #777;
      }
      .elCol3Span2 {
        color: #333;
      }
    }
    .elCol4 {
      text-align: right;
    }
  }
	//特别关注
	.careColor {
	  color: #ff7b58;
	}
</style>