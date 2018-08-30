<template>
	<div class="sfPlan">
    <!-- 姓名 -->
		<el-row class="personInfo">
      <el-col :span="12" class="name">
      	<span class="personName careColor" v-if="patientInfo">
          {{patientInfo.brxm?patientInfo.brxm:patientInfo.patientName?patientInfo.patientName:''}}
        </span>
      	<span class="personSex careColor" v-show="patientInfo.from&&patientInfo.from!='tymn'">
          {{patientInfo.brxb?patientInfo.brxb:patientInfo.patientSex?patientInfo.patientSex:''}} /
          {{patientInfo.age?patientInfo.age:patientInfo.patientAge?patientInfo.patientAge:''}}
        </span>
      	<span class="personXg">{{getCareStatus.GzTag}}</span>
      </el-col>
      <el-col :span="12" class="care">
        <el-button type="text"
        	@click="handleislike"
        	:class="{ careColor: getCareStatus.isCare}"
          v-show="patientInfo.from!='tymn'">
          <i class="iconfont"
          :class="{ careColor: getCareStatus.isCare}"
          :style="{marginRight:5+'px', fontSize:12+'px'}"
          >&#xe604;</i>
          {{getCareStatus.isCare?'取消关心':'特别关心'}}
        </el-button>
      </el-col>
    </el-row>
    <!-- 疾病名称 -->
    <el-row class="personResult" v-show="patientInfo.from!='tymn'">
      <el-col :span="12">
        <span>疾病名称&nbsp;:&nbsp;</span>
        <span>{{patientInfo.icdName}}</span>
      </el-col>
    </el-row>
     <!-- 所属科室 -->
    <el-row class="personResult" v-show="patientInfo.from=='tymn'">
      <el-col :span="12">
        <span>所属科室&nbsp;:&nbsp;</span>
        <span>{{patientInfo.department}}</span>
      </el-col>
    </el-row>
    <!-- 手机号码 -->
    <el-row class="personResult">
      <el-col :span="12">
        <span>联系电话&nbsp;:&nbsp;</span>
        <span>{{patientInfo.mobile}}</span>
      </el-col>
    </el-row>
    <!-- 预约看诊时间 -->
    <el-row class="personResult">
      <el-col :span="12">
        <span>预约看诊时间&nbsp;:&nbsp;</span>
        <span>{{patientInfo.orderTime}}</span>
      </el-col>
    </el-row>
    <!-- AI通知时间 -->
    <el-row class="personResult" v-show="patientInfo.from=='tymn'">
      <el-col :span="12">
        <span>AI通知时间&nbsp;:&nbsp;</span>
        <span>{{patientInfo.visitStartTime}}</span>
      </el-col>
    </el-row>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { commonUrl } from 'RJZL_API/commonUrl';
export default {
  name: 'hzInfo',
  computed: {
    ...mapState({
      'patientInfo': state => state.user.scopeRowData.row,
      'getCareStatus': state => state.user.getCareStatus
    })
  },
  methods: {
    /**
     * [handleislike description]
     * @description
     */
    handleislike() {
      if (this.getCareStatus.isCare) {
        // 取消关注
        const h = this.$createElement;
        this.$msgbox({
          title: '消息',
          message: h('div', {
            style: 'text-align:center'
          }, [
            h('img', {
              attrs: { src: require('../../../../static/images/animal.png')},
              style: 'width: 60px;height:52px;margin:0 auto;'
            }, null),
            h('p', null, '确定取消关心吗?')
          ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'careMsgBox',
          cancelButtonClass: 'cancelButtonStyle',
          confirmButtonClass: 'confirmButtonStyle',
          beforeClose: (action, instance, done) => {
            done();
            // this.patientInfo.GzTag = ''
          }
        }).then(action => {
          // 取消关注
          commonUrl.updateGz({
            'adminId': sessionStorage.getItem('userId'), // 医生ID
            'patientId': this.patientInfo.hzxxId, // 患者的id （必填）
            'operateType': 0, // (操作类型 1:关注 0：取消关注) （必填）
            'operateTag': '', // 关注的标签
            'diagnoseType': '4'
          }).then((res) => {
            if (res.code === 0) {
              const pp = {
                isCare: false,
                GzTag: '',
                refresh: true
              };
              this.$store.dispatch('getCareStatus', pp);
            }
          }).catch((error) => {
            console.log(error);
          });
        }).catch(() => {

        });
      } else {
        // 增加关注
        this.$prompt('  ', '添加标签', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入标签',
          customClass: 'careMsgBoxAdd',
          cancelButtonClass: 'cancelButtonStyle',
          confirmButtonClass: 'confirmButtonStyle'
        }).then(({ value }) => {
          if (!value) {
            this.$message.error('标签不能为空!');
          } else if (value.toString().length < 6) {
            commonUrl.updateGz({
              'adminId': sessionStorage.getItem('userId'), // 医生ID
              'patientId': this.patientInfo.hzxxId, // 患者的id （必填）
              'operateType': 1, // (操作类型 1:关注 0：取消关注) （必填）
              'operateTag': value, // 关注的标签
              'diagnoseType': '4'
            }).then((res) => {
              if (res.code === 0) {
                const addCare = {
                  isCare: true,
                  GzTag: value,
                  refresh: true
                };
                console.log('test', addCare)
                this.$store.dispatch('getCareStatus', addCare);
                this.$message.success('关注成功!');
              }
            }).catch((error) => {
              console.log(error);
            });
          } else {
            this.$message.error('标签长度不能大于5!');
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      }
    }
  }
};
</script>

<style lang="scss">
  .personInfo {
    padding: 10px 20px;
    line-height: 27px;
    height: 27px;
    margin-bottom: 8px;
    .name {
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
    .care {
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
  // 姓名-手机号
  .personResult {
    padding: 0 20px;
    font-size: 13px;
    text-align: left;
    line-height: 20px;
    color: #333;
  }
	//特别关注
	.careColor {
	  color: #ff7b58;
	}
</style>