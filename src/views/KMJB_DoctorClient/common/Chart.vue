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
      default: '700px'
    },
    height: {
      type: String,
      default: '250px'
    },
    name: {
      type: String,
      default: ''
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener('resize', this.__resizeHanlder);
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder);
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder);

    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val);
      }
    }
  },
  methods: {
    setOptions(chartData) {
      let dateArray = [],
        expectedData = [],
        elseData = [];
      let legend = {
        data: []
      };
      let series = [
        {
          name: '血压',
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: 'actual',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: [],
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
      ];
      // 判断是否是血压类型
      if (this.name.includes('血压')) {
        chartData.forEach(element => {
          dateArray.push(element.dateAdd);
          const itemArray = element.fieldValue.split('/');
          expectedData.push(itemArray[0] - 0);
          elseData.push(itemArray[1] - 0);
        });
        legend = {
          data: ['低压', '高压']
        };
        series[0].name = '低压';
        series[1].name = '高压';
        series[0].data = expectedData;
        series[1].data = elseData;
      } else {
        chartData.forEach(element => {
          dateArray.push(element.dateAdd);
          expectedData.push(element.fieldValue - 0);
        });
        legend = {
          data: [this.name]
        };
        series[0].name = this.name;
        series[0].data = expectedData;
        series = [series[0]];
      }
      this.chart.setOption({
        xAxis: {
          data: dateArray,
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0
          }
        },
        calculable: true,
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }
        ],
        legend,
        series
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    }
  }
};
</script>
