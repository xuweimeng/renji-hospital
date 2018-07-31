// import {API} from '@/serve'
import { mixinAPI } from 'HNDC_API/mixin_dialog'
import { CommonAPI } from 'HNDC_API/common'
const mixin = {
  mounted() {
    this.getUserId();
  },
  methods: {
    /**
     * 从sessionStorage获取医生id
     * @function getUserId
     * @param {String} userId 获取医生id
     */
    getUserId() {
      this.userId = this.$store.state.user.token//用户名
    },
    /**
     * 获取弹框患者个人信息(刷新特别关注的标签)
     * @function getPatientInfo
     * @param {String} adminId 医生id
     * @param {String} visitOrderId visitOrderId
     * @param {String} patientId 患者id
     */
    async getPatientInfo(userId=this.userId,patientId=this.patientId,visitOrderId=this.visitOrderId) {
      this.patientRecord = '';
      // visitOrderId 和 patientId必须传一个
      let search_param={
        adminId: userId,
        patientId: patientId,
        visitOrderId:visitOrderId?visitOrderId:undefined
      }
      return await CommonAPI.getPatientRecord(search_param);
    },
    /**
     *特别关心
     *@function handleislike
     *@description 增加/取消特别关注
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
              attrs: {src: 'static/images/animal.png'},
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
          }
        }).then(action => {
          //取消关注
          mixinAPI.updateGz({
            'adminId': this.userId, //医生ID
            'patientId': this.patientId,//患者的id （必填）
            'operateType': 0,//(操作类型 1:关注 0：取消关注) （必填）
            'operateTag':'' //关注的标签
          }).then((res)=>{
            if(res.code == 0) {
              this.isCare = false
              this.patientRecord.GzTag = '';
              // 刷新列表数据？
              // let param_name = `param_${typeMap[this.tabActive]}`;
              // this.getList(this[param_name]);
              this.$emit('refreshData');
            }
          }).catch((error)=>{
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
            mixinAPI.updateGz({
              'adminId': this.userId, //医生ID
              'patientId': this.patientId,//患者的id （必填）
              'operateType': 1,//(操作类型 1:关注 0：取消关注) （必填）
              'operateTag': value //关注的标签
            }).then((res)=>{
              if(res.code == 0) {
                this.isCare = true;
                this.patientRecord.GzTag = value;
                // 刷新列表数据？
                // let param_name = `param_${typeMap[this.tabActive]}`;
                // this.getList(this[param_name]);
                this.$emit('refreshData');
                this.$message({
                  type: 'success',
                  message: '关注成功!'
                });
              }
            }).catch((error)=>{
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
    /**
     * @function 取消关心
     * @return {type} {description}
     */
    cancelSpecial() {
      this.$msgbox({
        title: '消息',
        message: '确定取消关心吗',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done();
        }
      })
        .then(action => {
          // 取消关注
          mixinAPI.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.patientId,
            operateType: 0 // (操作类型 1:关注 0：取消关注) （必填）
          })
            .then(res => {
              this.$emit('refresh');
              this.baseData.gzTag = '';
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    /**
     * @function 添加关注
     * @return {type} {description}
     */
    addSpecial() {
      this.$prompt('请填写关注标签（不超过5个字符）', '添加关注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '不得超过5个字'
      }).then(({ value }) => {
        if (value.trim().length > 5 || value.trim().length === 0) {
          this.$message({
            type: 'error',
            message: '格式不对，不能为空，不能超过5个字符'
          });
          return false;
        }
        mixinAPI.updateGz({
          diagnoseType: 3,
          adminId: this.token,
          patientId: this.patientId,
          operateTag: value,
          operateType: 1 // (操作类型 1:关注 0：取消关注) （必填）
        }).then(res => {
          this.baseData.gzTag = value;
          this.$message({
            type: 'success',
            message: '成功添加关注'
          });
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {

      });
    }
  }
}
export default mixin;
