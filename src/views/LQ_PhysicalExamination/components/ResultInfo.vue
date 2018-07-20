<style lang="scss" scoped>
/deep/.record {
  &_box {
    .el-dialog__body {
      padding-top: 0;
    }
  }
  &_header {
    position: relative;
    &_name {
      margin: 5px 0;
      color: #409eff;
      font-size: 20px;
      font-weight: 400;
    }
    &_sexAndage {
      font-size: 12px;
      color: #666;
      margin: 0 20px;
    }
    &_param {
      margin: 10px 0;
      font-weight: 400;
      color: #f80;
      font-size: 14px;
    }
    &_cancel {
      position: absolute;
      top: 0;
      right: 30px;
    }
  }
  &_content {
    &_box{
      max-height: 300px;
      overflow-y: auto;
      border-top: 2px solid #f1f1f1;
    }
    &_list {
      padding: 0;
      margin: 0;
    }
    &_single {
      color: #409eff;
      font-size: 12px;
    }
    &_content {
      display: flex;
      flex-wrap: wrap;
      padding-top: 10px;
      margin-top: 10px;
    }
    &_param {
      width: 50%;
      color: #333;
      font-size: 12px;
      margin-top: 5px;
    }
  }
}
</style>

<template>
    <div class="record">
        <el-dialog top="5vh" :close-on-click-modal="false" class="record_box" title="通知详情" width="55%"  :visible.sync="dialogTableVisible">
            <!-- header information -->
            <div class="record_header">
                <h3 class="record_header_name">
                    {{baseData.brxm}}
                    <span class="record_header_sexAndage">
                        {{`${baseData.brxb}${baseData.brage?('/'+baseData.brage):''}`}}
                    </span>
                    <el-tag v-show="baseData.gzTag">
                        {{baseData.gzTag}}
                    </el-tag>
                </h3>
                <h4 class="record_header_param">
                  手机号码: {{baseData.phone?baseData.phone:"无"}}
                </h4>
                <h4 class="record_header_param">
                  体检套餐: {{baseData.icdName?baseData.icdName:"无"}}
                </h4>
                <h4 class="record_header_param">
                  证件号码: {{baseData.identificationCard?baseData.identificationCard:'无'}}
                </h4>
                <el-button v-if="baseData.gzTag" class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial" >取消关注</el-button>
                <el-button v-else   icon="el-icon-star-off" class="record_header_cancel"  size="mini" type="primary" @click="addSpecial" >添加关注</el-button>
            </div>
            <el-tabs v-model="currentTable"  type="border-card" >
                <el-tab-pane  name="one"  label="体检结果">
                     <ul class="record_content_list">
                       <li  class="record_content_single">
                         体检套餐:{{item.examinationData.inspectMealName}}
                       </li>
                        <li  class="record_content_single">
                         总检医生:{{item.examinationData.inspectDoctor?item.examinationData.inspectDoctor:"无"}}
                       </li>
                        <li class="record_content_single">
                         是否是VIP:{{item.examinationData.clientType}}
                       </li>
                       <li class="record_content_single">
                         体检总检结果:{{item.examinationData.inspectConclusion?item.examinationData.inspectConclusion:"无"}}
                       </li>
                       <li class="record_content_single">
                         体检健康建议:{{item.examinationData.inspectSuggest?item.examinationData.inspectSuggest:"无"}}
                       </li>
                     </ul>
                </el-tab-pane>
                <el-tab-pane  name="two"  label="记录详情">
                     <ul class="record_content_list">
                       <li  class="record_content_single">
                         体检套餐:{{item.examinationData.inspectMealName}}
                       </li>
                        <li  class="record_content_single">
                         总检医生:{{item.examinationData.inspectDoctor?item.examinationData.inspectDoctor:"无"}}
                       </li>
                        <li class="record_content_single">
                         是否是VIP:{{item.examinationData.clientType}}
                       </li>
                       <li class="record_content_single">
                         体检总检结果:{{item.examinationData.inspectConclusion?item.examinationData.inspectConclusion:"无"}}
                       </li>
                       <li class="record_content_single">
                         体检健康建议:{{item.examinationData.inspectSuggest?item.examinationData.inspectSuggest:"无"}}
                       </li>
                     </ul>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import { NoticeResult } from 'LQPE_API/NoticeResult'; // 引入 api
import { mapGetters } from 'vuex';
export default {
  props: {
    patientId: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  watch: {
    patientId: {
      handler(val) {
        this.getBaseData(val);
      }
    }
  },
  data() {
    return {
      currentTable: null,
      dialogTableVisible: false,
      baseData: {},
      baseUrl: '',
      timeList: [
        {
          // 体检数据
          examinationData: {}
        }
      ],
      nameMap: {
        projectName: '项目名称',
        inspectDate: '项目时间',
        projectConclusion: '项目小结',
        completeStatus: '完成状态',
        inspectDepartment: '体检科室',
        inspectDoctor: '体检医生',
        finishValue: '结果值',
        upValue: '上限值',
        downValue: '下限值'
      }
    };
  },
  mounted() {},
  methods: {
    /**
     * @function 获取基础数据
     * @param  {type} id {description}
     * @return {type} {description}
     */
    getBaseData(id) {
      NoticeResult.getPatientRecord({
        adminId: this.token,
        id: id
      })
        .then(res => {
          //      基础数据赋值
          this.baseData = res.data;
          this.baseData.isCare = !!this.baseData.gzTag;
        })
        .then(() => {
        //   this.getTimeList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * @function 获取就诊时间段
     * @return {type} {description}
     */
    getTimeList() {
      Home.clientInspectDate({
        patientId: this.patientId,
        adminId: this.token
      })
        .then(res => {
          res.data.forEach(element => {
            element.examinationData = {
              inspectProjectsVoList: []
            };
          });
          this.timeList = res.data;
          this.currentTable = this.timeList[0].clientDate + '0';
          this.timeList.forEach((item, index) => {
            this.getInfoData(item.clientDate, item.clientId, index);
          });
        })
        .catch(error => {
          console.log(error);
          this.timeList = [];
        });
    },
    /**
     * @function 获取具体数据
     * @param  {type} time {description}
     * @return {type} {description}
     */
    getInfoData(time, id, index) {
      Home.clientTotalInspect({
        patientId: this.patientId, //
        date: time,
        clientId: id,
        adminId: this.token
      })
        .then(res => {
          this.timeList[index].examinationData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
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
          Home.updateGz({
            diagnoseType: 3,
            adminId: this.token,
            patientId: this.patientId,
            operateType: 0 // (操作类型 1:关注 0：取消关注) （必填）
          })
            .then(res => {
              this.$emit('refresh');
              this.baseData.gzTag = '';
              // this.dialogTableVisible = false;
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
        Home.updateGz({
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
};
</script>