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
      let _this = this
      window.addEventListener('resize', function() {
        _this.medicinePieChart.resize()
      })
    },

    methods: {
      initMedicine() {
        let _this = this
        this.medicinePieChart = echarts.init(document.getElementById('medicinePie'))
        this.medicinePieChart.setOption({
          tooltip: {
            show: true,
            align:'left',
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          title: {
            text: '用药依从性',
            x: 'left',
            textStyle: {
              color: '#666',
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          legend: {
            orient: 'vertical',
            left: '70%',
            y: 'middle',
            data:['不服用','规律','间断'],
            textStyle: {
              color: '#666',
              marginTop: '10'
            }
          },
          series: [
            {
              name:'用药依从性',
              type:'pie',
              center: ['40%', '50%'],
              radius: ['40%', '60%'],
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    fontSize: '14',
                    color: 'gray'
                  },
                },

              },
              labelLine: {
                normal: {
                  show: true
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
    margin: 0 auto;
    width: 100%;
    height: 300px;
  }
</style>
