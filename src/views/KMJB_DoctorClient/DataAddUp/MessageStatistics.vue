<template>
  <div class="app-container">
    <!-- 搜索 -->
    <ul class="common_search">
      <li :class="['common_search_single', { common_search_single_time:showSelect===true }]">
        <label class="radio-label">时间</label>
        <el-select v-model="sameYear" placeholder="请选择" @change="selectYear" class="selectTime">
          <el-option
            v-for="item in yearList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="sameMonth" placeholder="请选择" @change="selectMonth"  v-show="showSelect" class="selectTime">
          <el-option
            v-for="item in monthList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
    </ul>
    <!-- tab切换 -->
    <el-tabs type="border-card" @tab-click="handleClick" >
      <!-- 全部患者 -->
      <el-tab-pane :label="`日期`">
        <el-table
          :data="data1"
          show-summary
          border highlight-current-row
          max-height="528"
          v-loading="loading">
          <el-table-column label="序号" width="120" align="center" type="index"></el-table-column>
          <el-table-column prop="sendTime" label="发送时间" width="204" align="center">
          </el-table-column>
          <el-table-column prop="sendMsgCount" label="发送总条数" align="center">
          </el-table-column>
          <el-table-column prop="free" label="费用合计" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 特别关心 -->
      <el-tab-pane :label="`月份`">
        <el-table
          :data="data1"
          show-summary
          border highlight-current-row
          max-height="528"
          v-loading="loading">
          <el-table-column label="序号" width="120" align="center" type="index">
          </el-table-column>
          <el-table-column prop="sendTime" label="发送时间" width="204" align="center">
          </el-table-column>
          <el-table-column prop="sendMsgCount" label="发送总条数" align="center">
          </el-table-column>
          <el-table-column prop="free" label="费用合计" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /**
   * 短信统计
   * @module patientList
   */
  import { DataAddUp } from 'KMJB_API/DataAddUp';
  import PointA from './formatYear';
  export default {
    data() {
      return {
        yearList: [], // 年份集合
        sameMonth: '', // 当前月份
        sameYear: '', // 当前年份
        data1: [], // 数据
        loading: true,
        showSelect: true, // 是否显示月份select
        tabName: '1', // 当前选中的tab 1:日期。2：yue
        monthList: [// 月份集合
          {
            value: '1',
            label: '1月'
          },
          {
            value: '2',
            label: '2月'
          },
          {
            value: '3',
            label: '3月'
          },
          {
            value: '4',
            label: '4月'
          },
          {
            value: '5',
            label: '5月'
          },
          {
            value: '6',
            label: '6月'
          },
          {
            value: '7',
            label: '7月'
          },
          {
            value: '8',
            label: '8月'
          },
          {
            value: '9',
            label: '9月'
          },
          {
            value: '10',
            label: '10月'
          },
          {
            value: '11',
            label: '11月'
          },
          {
            value: '12',
            label: '12月'
          }
        ],
        totalNumber: {
          pagenum: '',
          noIntentionStrip: 0, // 无意向发送条数
          intentionStrip: 0, // 有意向发送条数
          totalStrip: 0, // 发送总条数
          totalCost: 0 // 费用合计
        },
        userId: '' // 医生id sessionStorage中
      };
    },
    mounted() {
      this.getTime();
    },
    methods: {
      /**
       * 获取当前的年份和月份
       */
      getTime() {
        // 获取当前年月
        const date = new Date();
        const years = date.getFullYear();
        const months = date.getMonth() + 1;
        this.sameYear = years;
        this.sameMonth = String(months);
        const p1 = new PointA(years, years);
        const arr = [];
        arr.push(p1);
        this.yearList = arr;
        this.getList(this.tabName, this.sameYear, this.sameMonth);
      },
      /**
       * 获取短信统计列表
       * @function getList
       * @param {String} type 1:按日汇总 2:按月汇总
       * @param {String} year 需要汇总的年
       * @param {String} month month
       */
      getList(type, year, month) {
        DataAddUp.selectByTime({
          type: type,
          year: year == '-1' ? '' : year,
          month: month
        }).then((res) => {
          this.loading = false;
          // 处理年月日和费用
          if (this.tabName == 1) {
            res.data.smsCallMonitorVOs.forEach((item, index) => {
              item.index = index;
              item.sendTime = item.sendTime.slice(0, 4) + '-' + item.sendTime.slice(4, 6) + '-' + item.sendTime.slice(6, 8);
              item.free = item.free / 100;
            });
          } else {
            res.data.smsCallMonitorVOs.forEach((item, index) => {
              item.index = index;
              item.sendTime = item.sendTime.slice(0, 4) + '-' + item.sendTime.slice(4, 6);
              item.free = item.free / 100;
            });
          }
          this.data1 = res.data.smsCallMonitorVOs;
          // 总计
          this.totalNumber.totalStrip = res.data.sendMsgCount;
          this.totalNumber.noIntentionStrip = res.data.hasnotSendreasonCount;
          this.totalNumber.intentionStrip = res.data.hasSendreasonCount;
          this.totalNumber.totalCost = res.data.free / 100;
          // 获取年份

          res.data.years.forEach((item, index) => {
            this.yearList[index] = new PointA(item, item);
          });

          // 当前年份和月份
          if (this.sameYear != '-1') {
            this.sameYear = res.data.sendTime.slice(0, 4);
          }
          this.sameMonth = String(Number(res.data.sendTime.slice(4, 6)));
        }).catch((error) => {
          console.log(error);
        });
      },

      /**
       *列表上方的tab切换--不改变page
       *@function handleClick
       *@param {object} tab tab信息
       *@param {event} event 点击事件
       */
      handleClick(tab, event) {
        this.loading = true;
        const evt = Number(tab.index) + 1;
        // 当从月份切到日期时，重新给月份赋值
        const date = new Date();
        const months = date.getMonth() + 1;
        this.sameMonth = String(months);
        if (evt == 2) {

        } else {
          for (let index = 0; index < this.yearList.length; index++) {
            if (this.yearList[index].label == '全部') {
              this.yearList.splice(index, 1);
              index--;
            }
          }
          this.sameYear = this.yearList[0].value;
        }
        this.selectChange(Number(tab.index) + 1);
      },

      /**
       * 年份选择的时候产看当前年份统计
       * @function selectYear
       */
      selectYear(val) {
        this.sameYear = val;
        this.selectChange(this.tabName);
      },
      /**
       * 月份选择的时候产看当前年份统计
       * @function selectYear
       */
      selectMonth(val) {
        // this.sameMonth = val;
        this.selectChange(this.tabName);
      },
      /**
       * 请求统计的function
       * @function selectChange
       */
      selectChange(evt) {
        if (evt == '1') {
          this.showSelect = true;
          this.tabName = 1;
          this.getList(this.tabName, this.sameYear, this.sameMonth);
        } else {
          this.showSelect = false;
          this.tabName = 2;
          // 当日期切到月份时
          this.getList(this.tabName, this.sameYear);
        }
      }
    }

  };
</script>
