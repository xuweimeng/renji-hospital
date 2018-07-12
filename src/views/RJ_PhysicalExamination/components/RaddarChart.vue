<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';

const animationDuration = 2000;

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    dataList: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    dataList: {
      deep: true,
      handler(val) {
        this.setOption(val);
      }
    }
  },
  mounted() {
    this.initChart();
    this.__resizeHanlder = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener('resize', this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    setOption(chartData) {
      const dataArray = [];
      const legendList = [];
      chartData.forEach(element => {
        dataArray.push({
          name: element.diagnoseName,
          value: element.itemCount
        });
        legendList.push(element.diagnoseName);
      });
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: {
          text: '到院情况',
          left: 'left',
          top: 2,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Allocated Budget', 'Expected Spending', 'Actual Spending']
        },
        series: [{
          type: 'pie',
          name: '到院详情',
          symbolSize: 0,
          radius: [60, 95],
          center: ['50%', '38%'],
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: [
            {
              value: 500,
              name: 'Allocated Budget'
            },
            {
              value: 500,
              name: 'Expected Spending'
            },
            {
              value: 500,
              name: 'Actual Spending'
            }
          ],
          animationDuration: animationDuration
        }]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');

      this.chart.setOption();
    }
  }
};
</script>
