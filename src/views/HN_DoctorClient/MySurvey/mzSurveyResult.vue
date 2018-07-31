<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input  placeholder="请输入患者姓名"  v-model.trim="searchParam.brxm"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input  placeholder="请输入患者电话"  v-model.trim="searchParam.mobile"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >科室</label>
        <el-cascader
          popper-class="searchSelect"
          :options="departMentList"
          v-model="deparmentId"
          @change="getDepartchange"
          filterable
          clearable
        >
        </el-cascader>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >通话状态</label>
        <el-select clearable v-model="searchParam.backStatus" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="呼叫失败" value="1"></el-option>
          <el-option label="正常通话" value="2"></el-option>
          <el-option label="通话中" value="3"></el-option>
          <el-option label="关停机" value="4"></el-option>
          <el-option label="无人接听" value="5"></el-option>
          <el-option label="空号" value="6"></el-option>
          <el-option label="号码有误" value="7"></el-option>
        </el-select>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">就诊时间</label>
        <el-date-picker
          v-model="time_disease"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
          @change="diseaseTime" >
        </el-date-picker>
      </li>
      <li class="common_search_single common_search_single_time">
        <label class="radio-label">计划执行时间</label>
        <el-date-picker
          v-model="time_plan"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptionsShortcuts"
          @change="planTime">
        </el-date-picker>
      </li>
      <li class="common_search_single">
        <el-button type="primary" icon="el-icon-search" @click="searchDataBtn" :loading="mzLoading">查询</el-button>
      </li>
    </ul>
    <!-- 满意度 -->
    <div class="el-alert el-alert--success el-alert__title">
      <span style="white-space: pre;">满意 {{tableType.Okay}}   一般 {{tableType.General}}    不满意 {{tableType.NOkay}}               </span>
      <el-button type="primary" plain @click="outputExcel">导出报表</el-button>
    </div>
    <!-- table -->
    <el-table :data="mzResultData" border highlight-current-row v-loading="mzLoading">
      <el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="medGpName" label="科室" align="center"></el-table-column>
      <el-table-column prop="backStatusStr" label="通话状态" align="center"></el-table-column>
      <el-table-column prop="orderTime" label="就诊时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dateBegin" label="任务执行时间" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="technical" label="医生技术水平" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="service" label="医生服务态度" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="environmental" label="医院环境设施、后勤服务" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="medicalEthics" label="医院“廉洁行医，医德医风”" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="medicalExpense" label="医疗费用总体评价" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="evaluate" label="就诊总体评价" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="详情" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click.stop="detailBtn(scope)"
            class="operationBtn">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination  @current-change="pageChange" :current-page.sync="searchParam.pager" :page-size="searchParam.limit" layout="total,prev, pager, next, jumper"
                      :total="total" v-if="total">
      </el-pagination>
    </div>
    <!-- 详情 -->
    <el-dialog top="5vh" class="result_info" title="调查计划" :visible.sync="surveyResultDialog" center>
        <h3>
           {{infoData.brxm}}
          <span>
           {{infoData.brxb}}  / {{infoData.brage}}
          </span>
        </h3>
        <ul class="result_info_base">
          <li>联系电话：{{infoData.mobile}}</li>
          <li>医疗组/科室：{{infoData.medGpName||infoData.medGpName}}</li>
          <li>出院时间/就诊时间：{{infoData.diagnoseTime}}</li>
          <li>随访方案 : {{infoData.schemeName}} </li>
        </ul>
        <h4>结果详情</h4>
          <ul class="result_info_result">
            <li>您对医生的技术水平的评价是
              <span>{{infoData.orderResult.technical}}</span>
            </li>
            <li>您对医生的服务态度的评价是
              <span>{{infoData.orderResult.service}}</span>
            </li>
            <li>您对医院“廉洁行医，医德医风”的评价是
              <span>{{infoData.orderResult.medicalEthics}}</span>
            </li>
             <li>您对医院提供的环境设施、后勤服务的评价是
              <span>{{infoData.orderResult.environmental}}</span>
            </li>
            <li>您对医疗费用的总体评价是
              <span>{{infoData.orderResult.medicalExpense}}</span>
            </li>
            <li>您此次就诊的总体评价为
              <span>{{infoData.orderResult.evaluate}}</span>
            </li>
          </ul>
        <h4>记录详情</h4>
        <ul class="result_info_recode">
            <template v-for="item,index in infoData.orderReplyQuestions"   >
              <li  class="isAi">
               <span>
                  AI
               </span>
               <p>{{item.question}}</p>
            </li>
            <li >
               <span>
                 患者
               </span>
               <audio :src="voiceUrl+item.audio" controls>
               </audio>
            </li>
            </template>
        </ul>
    </el-dialog>
    <!-- <survey-result :surveyResultDialog="surveyResultDialog" @planClose="planClose"></survey-result> -->
  </div>
</template>
<script>
  import { MySurvey } from 'HNDC_API/MySurvey';
  export default {
    data() {
      return {
        infoData: {
          brxm: '',
          brxb: '',
          brage: '',
          medGpName: '',
          departmentName: '',
          schemeName: '',
          orderResult: {},
          orderReplyQuestions: []
        },
        voiceUrl: '',
        adminId: this.$store.state.user.token,
        activeType: '7', // 住院:6,门诊：7
        mzResultData: [
          {
            name: ''
          }
        ], // 表格数据
        mzLoading: false, // 门诊loading
        searchParam: {
          backStatus: '', // 通话状态
          adminId: this.$store.state.user.token,
          pager: 1,
          limit: 10,
          activeType: '7',
          brxm: '',
          mobile: '',
          deparmentId: '',
          VisitStartTimeBegin: '', // 计划执行时间开始时间
          VisitStartTimeEnd: '', // 计划执行时间结束时间
          dateAddBegin: '', // 就诊(出院)开始时间
          dateAddEnd: '', // 就诊（出院）结束时间
          medGpId: '' // 医疗组ID
        },
        tableType: {
          Okay: 0,
          General: 0,
          NOkay: 0
        },
        deparmentId: [],
        departMentList: [] /* 科室 */,
        groupList: [] /* 医疗组 */,
        time_plan: [], // 计划执行时间
        time_disease: [], // 就诊时间
        total: 0, // 总条数
        surveyResultDialog: false, // 详情弹框
        pickerOptionsShortcuts:  // 时间日期选择器的快捷方式数据
          {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date(new Date().setHours(23, 59, 59, 59));
                const start = new Date(new Date().setHours(0, 0, 0, 0));
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
          },
      };
    },
    mounted() {
      this.searchData();
      this.getDepartMentList();
      this.getGroupList();
    },
    methods: {
      /**
       * @description 科室变化
       * @function {function name}
       * @return {type} {description}
       */
      getDepartchange(data) {
        this.searchParam.medGpId = data[data.length - 1];
      },
      /**
       * @description 获取科室组
       * @function getDepartMentList
       * @return {type} {description}
       */
      getDepartMentList() {
        MySurvey.getDepart().then(res => {
          this.departMentList = this.dataFormat(res.data);
        });
      },
      /**
       * @description 获取医疗组
       * @function getGroupList
       * @return {type} {description}
       */
      getGroupList() {
        MySurvey.getGroup().then(res => {
          this.groupList = res.data;
        });
      },
      /**
       * @description 科室格式化
       * @function dataFormat
       * @param  {type} data {description}
       * @return {type} {description}
       */
      dataFormat(data) {
        const arrList = [];
        /**
         * 等级分组
         */
        for (const item of data) {
          item.expand = true;
          item.label = item.name;
          item.value = item.id;
          if (!arrList[item.level]) {
            arrList[item.level] = [];
          }
          arrList[item.level].push(item);
        }
        const appendChild = (child, parent) => {
          for (const item of child) {
            for (const ite of parent) {
              if (item.parentId == ite.id) {
                if (!ite.children) {
                  ite.children = [];
                }
                ite.children.push(item);
              }
            }
          }
        };
        for (let i = arrList.length - 1; i > 0; i--) {
          appendChild(arrList[i], arrList[i - 1]);
        }
        return arrList[0];
      },
      /**
       * @description 就诊时间改变触发函数
       * @function diseaseTime
       * @param  {array} date 返回的时间值数组
       */
      diseaseTime(date) {
        if (date) {
          this.searchParam.dateAddBegin = date[0];
          this.searchParam.dateAddEnd = date[1];
        } else {
          this.searchParam.dateAddBegin = '';
          this.searchParam.dateAddEnd = '';
        }
      },
      /**
       * @description 计划执行时间改变触发函数
       * @function planTime
       * @param  {array} date 返回的时间值数组
       */
      planTime(date) {
        if (date) {
          this.searchParam.VisitStartTimeBegin = date[0];
          this.searchParam.VisitStartTimeEnd = date[1];
        } else {
          this.searchParam.VisitStartTimeBegin = '';
          this.searchParam.VisitStartTimeEnd = '';
        }
      },
      /**
       * @function {function name}
       * @return {type} {description}
       */
      searchData() {
        this.mzLoading = true;
        MySurvey
          .queryResultMYDList(this.searchParam)
          .then(res => {
            this.mzLoading = false;
            if (res.code === 0) {
              const dataForam = [];
              for (let item of res.data) {
                item = {
                  ...item.orderResult,
                  ...item
                };
                item.medicalEthics =
                  item.medicalEthics === 0
                    ? '满意'
                    : item.medicalEthics === 1
                      ? '不满意'
                      : item.medicalEthics === 2 ? '一般' : '';
                item.environmental =
                  item.environmental === 0
                    ? '满意'
                    : item.environmental === 1
                      ? '不满意'
                      : item.environmental === 2 ? '一般' : '';
                item.technical =
                  item.technical === 0
                    ? '满意'
                    : item.technical === 1
                      ? '不满意'
                      : item.technical === 2 ? '一般' : '';
                item.service =
                  item.service === 0
                    ? '满意'
                    : item.service === 1
                      ? '不满意'
                      : item.service === 2 ? '一般' : '';
                item.evaluate =
                  item.evaluate === 0
                    ? '满意'
                    : item.evaluate === 1
                      ? '不满意'
                      : item.evaluate === 2 ? '一般' : '';
                item.medicalExpense =
                  item.medicalExpense === 0
                    ? '满意'
                    : item.medicalExpense === 1
                      ? '不满意'
                      : item.medicalExpense === 2 ? '一般' : '';
                dataForam.push(item);
              }
              this.mzResultData = dataForam;
              this.tableType = {
                Okay: res.Okay,
                NOkay: res.NOkay,
                General: res.General
              };
              this.total = res.total;
            }
          })
          .catch(error => {
            this.mzLoading = false;
            this.$message.error(error.message);
          });
      },
      /**
       * @function searchDataBtn
       * @description 查询按钮方法
       */
      searchDataBtn() {
        this.searchParam.pager = 1;
        this.searchData();
      },
      /** 分页 */
      pageChange(page) {
        this.searchParam.pager = page;
        this.searchData();
      },
      /** 监听子组件搜索数据 */
      /** 详情 */
      detailBtn(scope) {
        MySurvey
          .resultDetail({
            id: scope.row.id
          })
          .then(res => {
            this.infoData = res.data;
            this.infoData.orderResult = {
              technical: scope.row.technical,
              service: scope.row.service,
              medicalEthics: scope.row.medicalEthics,
              environmental: scope.row.environmental,
              medicalExpense: scope.row.medicalExpense,
              evaluate: scope.row.evaluate
            };
            this.infoData.diagnoseTime = scope.row.orderTime;
            this.infoData.departmentName = scope.row.departmentName;
            this.voiceUrl = res.AIVOICURL;
          });
        this.surveyResultDialog = true;
        // this.$store.dispatch("rowData", scope.row);
      },
      /** 详情关闭 */
      planClose(val) {
        this.surveyResultDialog = val;
      },
      /** 导出Excel */
      outputExcel() {
        MySurvey.getLink(this.searchParam);
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import '../../../styles/HN_DoctorClient/surveyResult.scss';
  .pagination-container{
    padding: 15px;
    margin-top: 0;
    background-color: white;
  }
  .common_search{
    padding-top: 15px;
  }
</style>
