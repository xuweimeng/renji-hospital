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
    &_cancel{
      position: absolute;
      top: 0;
      right: 30px;
    }
  }
  &_content {
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
      border-top: 2px solid #f1f1f1;
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
        <el-dialog :close-on-click-modal="false" class="record_box" title="体检档案" width="55%"  :visible.sync="dialogTableVisible">
            <!-- header information -->
            <div class="record_header">
                <h3 class="record_header_name">
                    {{baseData.name}}
                    <span class="record_header_sexAndage">
                        {{baseData.sex}}/{{baseData.birthday}}
                    </span>
                    <el-tag>
                        {{baseData.gzTag}}
                    </el-tag>
                </h3>
                <h4 class="record_header_param">
                  手机号码: {{baseData.phone?baseData.phone:"无"}}
                </h4>
                <h4 class="record_header_param">
                  证件号码: {{baseData.identificationCard?baseData.identificationCard:'无'}}
                </h4>
                <el-button class="record_header_cancel" size="mini" type="primary" @click="cancelSpecial(baseData)" >取消关注</el-button>
            </div>
            <el-tabs type="border-card" v-if="timeList[0]">
                <el-tab-pane @tab-click="getInfoData(item.clientDate,item.clientId,index)" v-for="(item,index) in timeList" :key="index" :label="item.clientDate">
                     <ul class="record_content_list">
                       <li class="record_content_single">
                         体检套餐:{{item.examinationData.inspectMealName}}
                       </li>
                        <li class="record_content_single">
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
                      <ul class="record_content_content" v-if="item.examinationData.inspectProjectsVoList[0]" v-for="(ite,inde) in item.examinationData.inspectProjectsVoList" :key="inde">
                        <li class="record_content_param" v-for="(it,ind) in Object.keys(ite)" :key="ind">
                          <el-tag type="warning">
                            {{nameMap[it]}}
                          </el-tag>
                          {{ite[it]}}
                        </li>
                      </ul>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import { Home } from 'RJPE_API/Home'; // 引入 api
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
      dialogTableVisible: false,
      baseData: {},
      timeList: [
        {
          // 体检数据
          examinationData: {}
        }
      ],
      nameMap: {
        projectName: '项目名称',
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
      Home.clientInformation({
        adminId: this.token,
        patientId: id
      })
        .then(res => {
          //      基础数据赋值
          this.baseData = res.data;
          this.baseData.isCare = !!this.baseData.gzTag;
        })
        .then(() => {
          this.getTimeList();
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
          this.getInfoData(res.data[0].clientDate, res.data[0].clientId, 0);
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
     * @function {function name}
     * @return {type} {description}
     */
    cancelSpecial(id) {
      this.$msgbox({
        title: '消息',
        message: '确定取消关心吗',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done();
        }
      }).then(action => {
        // 取消关注
        Home.updateGz({
          diagnoseType: 3,
          adminId: this.token,
          patientId: this.patientId,
          operateType: 0 // (操作类型 1:关注 0：取消关注) （必填）
        })
          .then(res => {
            this.$emit('refresh');
            this.dialogTableVisible = false;
          })
          .catch(error => {
            console.log(error);
          });
      }).catch(err => {
        console.log(err);
      });
    }
  }
};
</script>