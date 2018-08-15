<template>
  <div class="dashboard-editor-container">

    <panel-group
      :info="panelGroupData"
    ></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:15px;">
      <div class="Index_header">
        <h3 class="Index_header_title">
          随访数量统计
        </h3>
        <el-radio-group v-model="numberOfNotifications.type" @change="getNumberOfNotifications">
          <el-radio :label="1">近7天</el-radio>
          <el-radio :label="2">近30天</el-radio>
        </el-radio-group>
      </div>
      <line-chart :chart-data="numberOfNotifications.dataList"></line-chart>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:15px;" >
      <div class="Index_header">
        <h3 class="Index_header_title">
          患者总体情况分析
        </h3>
        <el-radio-group v-model="overallSituation.type" @change="getOverallSituation">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">近7天</el-radio>
          <el-radio :label="2">近30天</el-radio>
          <el-radio :label="3">3个月</el-radio>
          <el-radio :label="4">6个月</el-radio>
          <el-radio :label="5">一年</el-radio>
        </el-radio-group>
      </div>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <raddar-chart :dataList="overallSituation.arrivalSituation"></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart :dataList="overallSituation.packageDistribution"></pie-chart>
        </div>
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:15px;" >
        <transaction-table :token="token"></transaction-table>
    </el-row>

  </div>
</template>

<script>
  /**
   * 首页
   * @module Homepage
   */
  import { Homepage } from 'KMJB_API/Homepage';

  import { mapGetters } from 'vuex';

  // 顶部数据展示集合
  import PanelGroup from '../homeComponents/PanelGroup';
  import LineChart from '../homeComponents/LineChart';
  // 雷达图
  import RaddarChart from '../homeComponents/RaddarChart';
  import PieChart from '../homeComponents/PieChart';
  import TransactionTable from '../homeComponents/TransactionTable';

  // const lineChartData = {
  //   newVisitis: {
  //     expectedData: [100, 120, 161, 134, 105, 160, 165],
  //     actualData: [120, 82, 91, 154, 162, 140, 145]
  //   },
  //   messages: {
  //     expectedData: [200, 192, 120, 144, 160, 130, 140],
  //     actualData: [180, 160, 151, 106, 145, 150, 130]
  //   },
  //   purchases: {
  //     expectedData: [80, 100, 121, 104, 105, 90, 100],
  //     actualData: [120, 90, 100, 138, 142, 130, 130]
  //   },
  //   shoppings: {
  //     expectedData: [130, 140, 141, 142, 145, 150, 160],
  //     actualData: [120, 82, 91, 154, 162, 140, 130]
  //   }
  // };

  export default {
    name: 'dashboard-admin',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      TransactionTable
    },
    mounted() {
      this.getPanelGroupData();
      this.getNumberOfNotifications();
      this.getOverallSituation();
    },
    computed: {
      ...mapGetters(['token']) // userId
    },
    data() {
      return {
        // lineChartData: lineChartData.newVisitis,
        // 顶部列表数据
        panelGroupData: {
          realname: '管理员',
          needClCount: 0, // 随访记录待处理条数
          needShCount: 0, // 随访计划待处理条数
          hadVisitCount: 0, // 已随访
          hadVisitPeopleCount: 0, // 患者总数
          waiting: '' // 等待时间
        },
        // 随访/通知数量统计
        numberOfNotifications: {
          dataList: [],
          type: 2 // 1:近7天  2:近30天
        },
        // 总体情况
        overallSituation: {
          type: 0, // 0全部 1近7天 2近30天 3:3个月 46个月 5一年
          packageDistribution: [],
          arrivalSituation: []
        }
      };
    },
    methods: {
      // handleSetLineChartData(type) {
      //   this.lineChartData = lineChartData[type];
      // },
      /**
       * @function 获取顶部基础信息
       * @return {type} {description}
       */
      getPanelGroupData() {
        Homepage.adminInfo(
          {
            adminId: this.token
          }
        ).then(res => {
          // console.log(res);
          this.panelGroupData = res.data;
          // this.panelGroupData.waiting = res.data.laterHours || '0';
        })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 随访/通知数量统计
       * @return {type} {description}
       */
      getNumberOfNotifications() {
        Homepage
          .visitCountInfo({
            adminId: this.token,
            dateType: this.numberOfNotifications.type
          })
          .then(res => {
            this.numberOfNotifications.dataList = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 总体情况
       * @return {type} {description}
       */
      getOverallSituation() {
        this.getPackageDistribution(this.overallSituation.type);
        this.getArrivalSituation(this.overallSituation.type);
      },
      /**
       * @function 套餐分布情况
       * @return {type} {description}
       */
      getPackageDistribution(type) {
        Homepage
          .diagnoseInfo({
            adminId: this.token,
            dateType: type
          })
          .then(res => {
            this.overallSituation.packageDistribution = res.data;
          })
          .catch(error => {
            console.log(error);
          });
      },
      /**
       * @function 到院情况
       * @return {type} {description}
       */
      getArrivalSituation(type) {
        Homepage
          .getUseEatInfo({
            adminId: this.token,
            dateType: type
          })
          .then(res => {
            this.overallSituation.arrivalSituation = [{
              name: '规律',
              value: res.data[0].itemCount
            }, {
              name: '间断',
              value: res.data[1].itemCount
            }, {
              name: '不服用',
              value: res.data[2].itemCount
            }];
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 15px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
  .Index{
    &_header{
      border-bottom: 1px solid #f1f1f1;
      box-sizing: border-box;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      padding-bottom: 15px;
      &_title{
        margin: 0;
        font-size: 16px;
        color: #555;
      }
    }
  }
</style>
