<template>
  <div class="medicinePie" id="medicinePie"></div>
</template>
<script>
import echarts from 'echarts'
  export default {
    name: 'MedicinePie',
    data () {
      return {
        defaultArr: [
          {
            icon: 'circle',
            name: '规律',
            selected: false,
            percent: 0,
            value: 0,
            itemStyle: {
              normal: {
                color: '#69acff'
              }
            }
          },
          {
            icon: 'circle',
            name: '间断',
            selected: false,
            percent: 0,
            value: 0,
            itemStyle: {
              normal: {
                color: '#ffbd3d'
              }
            }
          },
          {
            icon: 'circle',
            name: '不服用',
            selected: false,
            percent: 0,
            value: 0,
            itemStyle: {
              normal: {
                color: '#fc8c70'
              }
            }
          }
        ],
        defaultTotal: 0
      }
    },
    props: {
      dataMedicine: {
        type: Array,
        default: []
      },
      total2: {
        type: Number,
        default: 0
      }
    },
    mounted () {
      this.$nextTick(function() {
        this.defaultArr = this.dataMedicine
        this.defaultTotal = this.total2
         this.initMedicine()
      })
    },

    methods: {
      initMedicine() {
        let _this = this
        this.medicinePieChart = echarts.init(document.getElementById('medicinePie'))
        this.medicinePieChart.setOption({
          tooltip: {
            show: false,
            align:'left',
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
            {
              name:'用药依从性',
              type:'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter:function() {
                    return _this.defaultTotal
                  },
                  textStyle: {
                    fontSize: '14',
                    color: 'gray'
                  },
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '12',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:this.defaultArr
            }
          ]
        })
    }
    },
    watch: {
      dataMedicine(newV, oldV) {
        if(newV) {
          this.defaultArr = this.dataMedicine
          this.defaultTotal = this.total2
          this.defaultArr.forEach( item => {
            item.percent === undefined?item.percent = 0:item.percent
            item.value === undefined?item.value = 0:item.value
          })
          this.$nextTick( function() {
            this.initMedicine()
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .medicinePie {
    width: 168px;
    height: 158px;
    float: left;
  }
</style>
