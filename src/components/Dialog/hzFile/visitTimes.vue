<template>
	<!--  就诊时间 -->
  <el-row class="resolveBtn">
    <el-col :span="24" style="text-align:left;color:#000;">
      <swiper :options="swiperOption" class="swiperTime" ref="swiper">
        <swiper-slide
        v-for="(item, index) in swiperDate"
        :key="index"
        @click.native="sliderClick(item,index)"
        :class="{'activeSlider': selectNumber === index}">
	       {{item.diagnosetime}}
	      </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev">
          <i class="el-icon-arrow-left" :style="{marginTop:12+'px', fontSize:20+'px', color:'#ff6800'}"></i>
        </div>
        <div class="swiper-button-next" slot="button-next">
          <i class="el-icon-arrow-right" :style="{marginTop:12+'px', fontSize:20+'px',  color:'#ff6800', marginLeft:5+'px' }"></i>
        </div>
      </swiper>
    </el-col>
  </el-row>
</template>

<script>
import { hzList } from 'RJZL_API/patientList';
import { mapState } from 'vuex';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
export default {
  data() {
    return {
      swiperOption: { // swiper
        slidesPerView: 4,
        spaceBetween: 30,
        slidesPerGroup: 4,
        loop: false,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      swiperDate: [], // 患者就诊档案时间
      selectNumber: 0 // 当前选中的就诊时间
    };
  },
  components: {
    swiper,
    swiperSlide
  },
  mounted() {
    this.getVisitTime();
  },
  computed: {
    ...mapState({
      'patientInfo': state => state.user.scopeRowData.row
    })
  },
  methods: {
    getVisitTime() {
      hzList.getRecordDate({
        'patientId': this.patientInfo.hzxxId
      }).then((res) => {
        if (res.code === 0) {
          res.data.forEach((item, index) => {
            item === null ? res.data.splice(index, 1) : item;
          });
          this.swiperDate = res.data;
          if (res.data.length > 0) {
            this.$store.dispatch('getVisitTime', res.data[0].diagnosetime);
          } else {
            this.$store.dispatch('getVisitTime', '');
          }
        }
      });
    },
    /** 选择时间 */
    sliderClick(item, index) {
      this.selectNumber = index;
      this.$store.dispatch('getVisitTime', item.diagnosetime);
    }
  },
  watch: {
    patientInfo(newV, oldV) {
      if (newV.hzxxId !== oldV.hzxxId) {
        this.getVisitTime();
      }
    }
  }
};
</script>

<style lang="scss">
	//就诊时间
  .resolveBtn {
    border-top: 1px solid #e4f4ff;
    border-bottom: 1px solid #e4f4ff;
    padding: 2px 10px;
    margin: 18px 0 0;
    .el-col {
      .swiper-container {
        color: #767978;
        .swiper-wrapper {
          width: 90%;
          margin: 0 auto;
          .swiper-slide {
						padding: 15px 0;
            text-align: center;
            margin-right: 15px!important;
          }
        }
        .swiper-button-next {
          background-image:none!important;
        }
        .swiper-button-prev {
          background-image:none!important;
        }
      }
    }
  }
  //dialog随访日期颜色
	.activeSlider {
	  color: #ff602d;
		font-size: 15px;
	}
</style>