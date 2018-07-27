<template>
  <div class="diseasePie" id="diseasePie">
  </div>
</template>
<script>
import echarts from 'echarts'
  export default {
    name: 'DiseasePie',
    props: [
      'dataDisease',
      'total'
    ],
    methods: {
      initDiseasePie() {
        let _this = this
        this.diseaseChart = echarts.init(document.getElementById('diseasePie'))
        this.diseaseChart.setOption({
          tooltip: {
            show: false,
            position: 'center',
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          grid: {
            top: '5%',
            left: '1%',
            right: '5%',
            bottom: '5%',
            containLabel: true
          },
          series: [
            {
              name:'疾病分布情况',
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
                    return _this.total
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
              data:this.dataDisease
            }
          ]
        })
      }
    },
    watch: {
      dataDisease(newV, oldV) {
        if(newV) {
          this.initDiseasePie()
        }
      }
    }
  }
</script>
<style lang="scss">
  .diseasePie {
    width: 168px;
    height: 155px;
    float: left;
  }
</style>
