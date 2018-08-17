<template>
  <div class="followCount" id="followCount"></div>
</template>
<script>
import echarts from 'echarts'
  export default {
    name: 'FollowCount',
    props: [
      'dataX',
      'dataY'
    ],
    data () {
      return {
        chart: null
      }
    },
    mounted() {
      let _this = this
      this.$nextTick( function () {
        window.addEventListener('resize', function() {
          _this.chart.resize()
        })
      })
    },
    methods: {
      initChart () {
        this.chart = echarts.init(document.getElementById('followCount'))
        this.chart.setOption({
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                backgroundColor: '#333'
              }
            },
            formatter: function(params) {
              return params.seriesName + ':' + params.value
            },
            textStyle: {
              align: 'right'
            }
          },
          grid: {
            top: '10%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          xAxis: {
            data: this.dataX,
            axisLine: {
              lineStyle: {
                color: '#a1a1a1'
              }
            },
          },
          yAxis: {
            splitLine: {show: false},
            axisLine: {
              lineStyle: {
                color: '#a1a1a1'
              }
            }
          },
          series: [
            {
              name: '随访人数',
              type: 'line',
              smooth: true,
              showAllSymbol: true,
              symbol: 'circle',
              symbolSize: 4,
              itemStyle:{
                normal:{
                  color: "#07d5d8" //图标颜色
                }
              },
              data: this.dataY,
              lineStyle: {
                normal: {
                  width: 1,
                  color: 'rgba(8,213,216,.5)'
                }
              },
            },
            {
              name: '随访人数',
              type: 'bar',
              barWidth: 6,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: new echarts.graphic.LinearGradient(
                    0, 0, 0.5, 1,
                    [
                      {offset: 0, color: '#8283da'},
                      {offset: 0.5, color: '#47aad9'},
                      {offset: 1, color: '#07d5d8'}
                    ]
                  )
                }
              },
              data: this.dataY
            }
          ]
        })
      }
    },
    watch: {
      dataX(newV, oldV) {
        if(newV) {
          this.$nextTick( function() {
            this.initChart()
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .followCount {
    width: 100%;
    height: 100%;
  }
</style>
