<template>
  <div class="diseasePie" id="diseasePie">
  </div>
</template>
<script>
import echarts from 'echarts';
export default {
  name: 'DiseasePie',
  props: [
    'dataDisease',
    'total'
  ],
  mounted() {
    const _this = this;
    window.addEventListener('resize', function() {
      _this.diseaseChart.resize()
    });
  },
  methods: {
    initDiseasePie() {
      const _this = this;
      this.diseaseChart = echarts.init(document.getElementById('diseasePie'))
      const data_name = [];
      for (var n in _this.dataDisease) {
        _this.dataDisease[n]['name'] =
        _this.dataDisease[n]['name'] + '  ' +
        _this.dataDisease[n]['percent'] + '%' + '  ' +
        _this.dataDisease[n]['value'] + '人';
        data_name.push(_this.dataDisease[n]['name']);
      }
      this.diseaseChart.setOption({
        color: ['#fc8c70', '#f9bd48', '#fd6388', '#69acff', '#e9e9e9'],
        tooltip: {
          show: true,
          position: 'center',
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        grid: {
          top: '5%',
          left: '1%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        title: {
          text: '疾病分布情况',
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
          data: data_name,
          textStyle: {
            color: '#666',
            fontWeight: 'normal'
          }
        },
        series: [
          {
            name: '疾病分布情况',
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['40%', '60%'],
            label: {
              normal: {
                show: true,
                position: 'middle',
                textStyle: {
                  fontSize: '14',
                  color: 'gray'
                },
                formatter: function(value) {
                  const getName = value.name.split(' ');
                  return getName[0];
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: this.dataDisease
          }
        ]
      });
    }
  },
  watch: {
    dataDisease(newV, oldV) {
      if (newV) {
        this.initDiseasePie();
      }
    }
  }
}
</script>
<style lang="scss">
  .diseasePie {
    margin: 0 auto;
    width: 100%;
    height: 300px;
  }
</style>
