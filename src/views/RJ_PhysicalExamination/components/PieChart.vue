<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';

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
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOption(this.dataList);
    },
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
          text: '套餐分布情况',
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
          data: legendList
        },
        calculable: true,
        series: [
          {
            name: '套餐分布详情',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: dataArray,
            animationEasing: 'cubicInOut',
            animationDuration: 2000
          }
        ]
      });
    }
  }
};
</script>
