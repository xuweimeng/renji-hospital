<template>
  <div class="dashboard-editor-container">

    <panel-group
      :name="panelGroupData.name"
      :total="panelGroupData.total"
      :yesterdayNotice="panelGroupData.yesterdayNotice"
      :Informed="panelGroupData.Informed"
      :waiting="panelGroupData.waiting"
      :logInTime="panelGroupData.logInTime"
    ></panel-group>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:15px;">
      <div class="Index_header">
        <h3 class="Index_header_title">
          通知数量统计
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
          客户总体情况分析
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

    <el-row style="background:#fff;padding:16px;margin-bottom:15px;">
      <div class="Index_header">
        <h3 class="Index_header_title">
          特别关心
        </h3>
      </div>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span: 24}" >
        <transaction-table @getInfo="getRecord" :list="specialCare.dataList"></transaction-table>
      </el-col>
    </el-row>
    <record ref="record" @refresh="getSpecialCare" :patientId="specialCareId"></record>
  </div>
</template>

<script>
import { Home } from 'LQPE_API/Home'; // 引入 api
import { mapGetters } from 'vuex';

// 顶部数据展示集合
import PanelGroup from './components/PanelGroup';
import LineChart from './components/LineChart';
// 雷达图
import RaddarChart from './components/RaddarChart';
import PieChart from './components/PieChart';
import TransactionTable from './components/TransactionTable';
import Record from './components/Record';

export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    TransactionTable,
    Record
  },
  created() {
    this.getPanelGroupData();
    this.getNumberOfNotifications();
    this.getOverallSituation();
    this.getSpecialCare();
  },
  computed: {
    ...mapGetters(['token'])
  },
  data() {
    return {
      // 顶部列表数据
      panelGroupData: {
        name: '管理员',
        total: 0, // 总客户数量
        yesterdayNotice: 0, // 昨日通知客户数量
        Informed: 0, // 已通知数量
        waiting: '', // 等待时间
        logInTime: '' // 上次登录时间
      },
      // 特别关心
      specialCare: {
        limit: 999,
        pager: 1,
        total: 0,
        dataList: []
      },
      specialCareShow: true,
      specialCareId: '',
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
    /**
     * @function 获取顶部基础信息
     * @return {type} {description}
     */
    getPanelGroupData() {
      Home.getNoticed({
        adminId: this.token
      })
        .then(res => {
          this.panelGroupData = {
            name: res.data.realname,
            total: res.data.noticedPersonSum,
            yesterdayNotice: res.data.noticedCount,
            Informed: res.data.noticedPersonCount,
            waiting: res.data.laterHours + '',
            logInTime: res.data.lastVisitDate
          };
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * @function 获取特别关心数据
     * @return {type} {description}
     */
    getSpecialCare() {
      Home.specialClient({
        limit: this.specialCare.limit,
        page: this.specialCare.pager,
        adminId: this.token
      }).then(res => {
        this.specialCare.dataList = res.data;
        this.specialCare.total = res.total;
      });
    },
    /**
     * @function 随访/通知数量统计
     * @return {type} {description}
     */
    getNumberOfNotifications() {
      Home.noticedCountDate({
        type: this.numberOfNotifications.type
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
      Home.clientDistribute({
        dateType: type
      })
        .then(res => {
          this.overallSituation.packageDistribution = res.resultList;
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
      Home.arriveHospital({
        dateType: type
      })
        .then(res => {
          this.overallSituation.arrivalSituation = [{
            name: '前来',
            value: res.data.arrive
          }, {
            name: '不来',
            value: res.data.noArrive
          }, {
            name: '改约',
            value: res.data.nextArrive
          }];
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * @function 获取档案
     * @return {type} {description}
     */
    getRecord(item) {
      this.specialCareId = item.row.hzxxId;
      this.$refs.record.dialogTableVisible = true;
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
