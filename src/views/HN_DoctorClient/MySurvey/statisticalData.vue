<template>
  <div class="zySurveyPlan">
    <!-- 搜索 -->
    <el-row class="addUp-search">
      <el-col :span="24">
        <el-form>
          <el-form-item label="季度">
            <el-select v-model="zyYearQuarters" placeholder="请选择" popper-class="searchSelect" v-show="activeName==6">
              <el-option
                v-for="item in zyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="mzYearQuarters" placeholder="请选择" popper-class="searchSelect" v-show="activeName==7">
              <el-option
                v-for="item in mzOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="button" @click="searchBtn">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="button" @click="exportBtn">导出报表</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- table -->
    <!-- tab切换 -->
    <el-row class="rsTabs">
      <el-col :span="24">
        <el-tabs type="border-card" v-model="activeName">
          <!-- 住院满意度调查 -->
          <el-tab-pane label="住院满意度调查" name="6">
            <el-table :data="zyTableData"
                      style="width: 1130px"
                      class="rsTable"
                      v-loading="Loading"
            >
              <el-table-column prop="name" label="医疗组" align="center"></el-table-column>
              <el-table-column prop="percent" label="住院满意度"  align="center"></el-table-column>
              <el-table-column prop="nice" label="满意" align="center"></el-table-column>
              <el-table-column prop="normal" label="一般" align="center"></el-table-column>
              <el-table-column prop="bad" label="不满意" align="center"></el-table-column>
            </el-table>

            <el-row class="tablePagination" v-show="zyTotal">
              <el-col :span="12" :offset="12">
                <el-pagination
                  @current-change="handleCurrentChangeZY"
                  :current-page.sync="zyPage"
                  :page-size="limit"
                  layout="total,prev, pager, next, jumper"
                  :total="zyTotal">
                </el-pagination>
              </el-col>
            </el-row>

          </el-tab-pane>
          <!-- 门诊满意度调查 -->
          <el-tab-pane label="门诊满意度调查" name="7">
            <el-table :data="mzTableData"
                      style="width: 1130px"
                      class="rsTable"
                      v-loading="Loading"
            >
              <el-table-column prop="name" label="科室" align="center"></el-table-column>
              <el-table-column prop="percent" label="门诊满意度"  align="center"></el-table-column>
              <el-table-column prop="nice" label="满意" align="center"></el-table-column>
              <el-table-column prop="normal" label="一般" align="center"></el-table-column>
              <el-table-column prop="bad" label="不满意" align="center"></el-table-column>
            </el-table>
            <el-row class="tablePagination" v-show="mzTotal">
              <el-col :span="12" :offset="12">
                <el-pagination
                  @current-change="handleCurrentChangeMZ"
                  :current-page.sync="mzPage"
                  :page-size="limit"
                  layout="total,prev, pager, next, jumper"
                  :total="mzTotal">
                </el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { MySurvey } from '@/api/HN_DoctorClient/MySurvey';
  export default {
    name: 'AddUp',
    data() {
      return {
        activeName: '6', // tab默认选择第几个
        zyYearQuarters: '', // 年份
        mzYearQuarters: '',
        Loading: false,
        zyTableData: [],
        mzTableData: [],
        zyPage: 1, // 当前页
        mzPage: 1,
        zyOptions: [],
        mzOptions: [],
        limit: 10,
        zyTotal: 0,
        mzTotal: 0
      };
    },
    mounted() {
      this.getSelectTime();
    },
    watch: {
      activeName() {
        if (!this.mzYearQuarters && this.mzTotal === 0) {
          this.getSelectTime();
        }
      }
    },
    methods: {
      searchBtn() {
        if (this.activeName === '6') {
          this.zyPage = 1;
        } else {
          this.mzPage = 1;
        }
        this.getTableData();
      },
      /** 导出报表*/
      exportBtn() {
        const yearQuarters = this.activeName === '6' ? this.zyYearQuarters : this.mzYearQuarters;
        const year = yearQuarters.split('_')[0];
        const quarter = yearQuarters.split('_')[1];
        MySurvey.calculationResultExport({
          activeType: this.activeName, // 类型(6:住院满意度,7：门诊满意度)
          year: year, // 年份（如：2018）
          quarter: quarter // 季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）
        });
      },
      handleCurrentChangeZY(val) {
        this.zyPage = val;
        this.getTableData();
      },
      handleCurrentChangeMZ(val) {
        this.mzPage = val;
        this.getTableData();
      },
      /**
       * 满意度 医生端 统计数据-表格数据
       */
      getTableData() {
        const yearQuarters = this.activeName === '6' ? this.zyYearQuarters : this.mzYearQuarters;
        if (!yearQuarters) {
          this.$message.error('请选择季度!');
          return false;
        }
        const year = yearQuarters.split('_')[0];
        const quarter = yearQuarters.split('_')[1];
        const pager = this.activeName === '6' ? this.zyPage : this.mzPage;
        this.Loading = true;
        MySurvey.calculationResult({
          pager: pager,
          limit: this.limit,
          activeType: this.activeName, // 类型(6:住院满意度,7：门诊满意度)
          year: year, // 年份（如：2018）
          quarter: quarter // 季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）
        }).then(res => {
          this.Loading = false;
          if (this.activeName === '6') {
            this.zyTableData = res.data;
            this.zyTotal = res.total;
          } else {
            this.mzTableData = res.data;
            this.mzTotal = res.total;
          }
        });
      },
      /**
       * 统计数据 查询添加初始化--select的数据获取
       */
      getSelectTime() {
        MySurvey.satisfactionTime({
          activeType: this.activeName // 类型(6:住院满意度,7：门诊满意度)
        }).then(res => {
          const options = [];
          const quarter_map = ['0', '第一季度(1-3月)', '第二季度(4-6月)', '第三季度(7-9月)', '第四季度(10-12月)'];
          if (!res.data) {
            return false;
          }
          for (const item of res.data) {
            const per_ops = {};
            per_ops.label = item.years + '年' + quarter_map[item.quarters];
            per_ops.value = item.years + '_' + item.quarters;
            options.push(per_ops);
          }
          if (this.activeName === '6') {
            this.zyOptions = options;
            this.zyYearQuarters = options[0].value;
            this.getTableData();
          } else {
            this.mzOptions = options;
            this.mzYearQuarters = options[0].value;
            this.getTableData();
          }
        }).catch(reason => {
          console.log(reason);
        });
      }
    }
  };
</script>
<style lang="scss">
  .zySurveyPlan {
    .el-tabs {
      box-shadow: none;
      border-left: none;
      border-right: none;
      border-bottom: none;
      .el-tabs__header {
        margin-bottom: 0;
        .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav{
          .el-tabs__active-bar {
            width: 125px!important;
            background-color: #fbfbfb!important;
          }
          .el-tabs__item {
            height: 45px;
            line-height: 45px;
            padding: 0 30px;
            color: #666;
          }
          .el-tabs__item:hover {
            color: #fe865c!important;
          }
          .is-active {
            color: #fe865c!important;
          }
        }
      }
      .el-tabs__content {
        padding: 0 15px;
      }
    }
  }
  .addUp-search {
    height: 52px;
    margin-bottom: 10px;
    background: #fff;
    .el-form {
      height: 52px;
      padding-left: 25px;
      //性别
      .el-form-item:nth-of-type(1){
        margin-bottom: 0;
        float: left;
        height: 26px;
        width: 300px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          text-align: left;
          .el-input {
            .el-input__inner {
              width: 220px;
              border-radius: 12px;
              height: 26px;
              text-align: center;
            }
          }
        }
      }
      //搜索
      .el-form-item:nth-of-type(2){
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-button {
            height: 26px;
            line-height: 0;
            margin: 13px 13px 0 0;
            font-size: 14px;
            background: #fff9f7;
            border-color: #fdd3c4;
            color: #ff6e40;
          }
        }
      }
      .el-form-item:nth-of-type(3){
        margin-bottom: 0;
        float: left;
        height: 26px;
        .el-form-item__label {
          height: 26px;
          line-height: 52px;
          color: #333;
          font-size: 13px;
          padding-right: 10px;
        }
        .el-form-item__content{
          height: 26px;
          line-height: 52px;
          .el-button {
            height: 26px;
            line-height: 0;
            margin: 13px 13px 0 0;
            font-size: 14px;
            background: #ecf5ff;
            border-color: #b3d8ff;
            color: #409eff;
          }
        }
      }
    }
  }

  .tablePagination{
    margin-top:11px;
  }
</style>

