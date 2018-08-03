// import {API} from '@/serve'
import { mixinAPI } from 'HNDC_API/mixin_dialog'
import { CommonAPI } from 'HNDC_API/common'
import { mapGetters } from 'vuex';
const mixin = {
  computed: {
    ...mapGetters({
      userId: 'token',
      token: 'token',
    })
  },
  methods: {
    /**
     * 获取弹框患者个人信息(刷新特别关注的标签)
     * @function getPatientInfo
     * @param {String} adminId 医生id
     * @param {String} visitOrderId visitOrderId
     * @param {String} patientId 患者id
     */
    async getPatientInfo(userId=this.userId,patientId=this.patientId,visitOrderId=this.visitOrderId) {
      this.baseData = '';
      // visitOrderId 和 patientId必须传一个
      let search_param={
        adminId: userId,
        patientId: patientId,
        visitOrderId:visitOrderId?visitOrderId:undefined
      }
      return await CommonAPI.getPatientRecord(search_param);
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
              this.$emit('refreshData');
              this.baseData.GzTag = '';
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
          this.$emit('refreshData');
          this.baseData.GzTag = value;
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
