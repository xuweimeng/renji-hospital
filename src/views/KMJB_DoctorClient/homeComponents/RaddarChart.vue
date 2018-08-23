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
      type: Array,
      default: []
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
      const legendList = [];
      chartData.forEach(element => {
        legendList.push(element.name);
      });
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        title: {
          text: '用药依从性',
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
        series: [{
          type: 'pie',
          name: '用药依从性',
          symbolSize: 0,
          radius: [60, 85],
          center: ['50%', '45%'],
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: chartData,
          animationDuration: animationDuration
        }]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');

      this.chart.setOption({});
    }
  }
};
</script>
