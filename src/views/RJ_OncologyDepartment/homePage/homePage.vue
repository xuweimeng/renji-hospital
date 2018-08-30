<template>
  <div class="homePage">
    <el-row class="header-wrap">
      <el-col :span="7" class="public-style noticeNum">
        <div class="notice-picture">
          <img :src="getAdminInfo.aipicTureUrl">
        </div>
        <div class="notice-content-one">
          <p class="text-center">您好，{{getAdminInfo.realname}}医生,{{getAdminInfo.AiName}}已等候您{{laterhours?laterhours:'0'}}小时了。</p>
          <p class="text-center">上次登录时间:{{dateLoginlc?dateLoginlc:"无"}}</p>
        </div>
      </el-col>
      <el-col :span="5" style="margin-left: 2.56%" class="public-style noticeNum-two" @click.native="routerToFollowupPlanReview">
        <div class="notice-picture notice-font blue-color">
          <i class="el-icon-message"></i>
        </div>
        <div class="notice-content">
          <p class="text-center">出院随访待审核</p>
          <p class="text-center blue-font">{{getAdminInfo.needShCount}}</p>
        </div>
      </el-col>
      <el-col :span="5" style="margin-left: 2.56%" class="public-style noticeNum-two" @click.native="routerToFollowupResults">
        <div class="notice-picture notice-font green-color">
          <i class="el-icon-edit"></i>
        </div>
        <div class="notice-content">
          <p class="text-center">已随访人数</p>
          <p class="text-center green-font">{{getAdminInfo.hadVisitPeopleCount}}</p>
        </div>
      </el-col>
      <el-col :span="5" style="margin-left: 2.56%" class="public-style noticeNum-two plpl" @click.native="routerToHzList">
        <div class="notice-picture notice-font origin-color">
          <i class="el-icon-bell"></i>
        </div>
        <div class="notice-content">
          <p class="text-center">患者总数</p>
          <p class="text-center origin-font">{{getAdminInfo.hadVisitCount}}</p>
        </div>
      </el-col>
    </el-row>
    <!-- section -->
    <el-row style="margin-bottom: 20px; background: #fff;font-family: 'Arial'">
      <!-- 出院简报 -->
      <div class="showTopPage">
        <el-card shadow="hover" class="boxCard">
          <div class="showTopPage-title">
            <span>出院随访简报</span>
          </div>
          <div class="showTopPage-day">
            日期:<span class="show-number">{{showTopPageData.today}}</span>
            应随访人数:<span class="show-number">{{showTotal}}
            </span>人(单位: 人)
          </div>
          <div class="showTopPage-content">
            <el-collapse v-model="openCollapse" accordion>
              <el-collapse-item name="1">
                <template slot="title">
                  <i class="el-icon-bell showPageIcon"></i>成功通知
                </template>
                <div>
                  <span
                    class="paddingleft20"
                    v-for="item in showTopPageData.data "
                    :key="item.statisticsName"
                    v-if="item.parentStatisticsName==='已接通'">
                    {{item.statisticsName}}
                    <span v-show="item.statisticsName">:</span>
                    <el-tag type="primary" size="mini">{{item.statisticsValue}}</el-tag>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <i class="el-icon-phone showPageIcon"></i>未接通
                </template>
                <div>
                  <span
                    class="paddingleft20"
                    v-for="item in showTopPageData.data"
                    :key="item.statisticsName"
                    v-if="item.parentStatisticsName==='未接通'">
                    {{item.statisticsName}}
                    <span v-show="item.statisticsName">:</span>
                    <el-tag type="primary" size="mini">{{item.statisticsValue}}</el-tag>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <i class="el-icon-edit-outline showPageIcon"></i>满意度
                </template>
                <div>
                  <span
                    class="paddingleft20"
                    v-for="item in showTopPageData.data "
                    :key="item.statisticsName"
                    v-if="item.parentStatisticsName==='满意度-已评价' || item.parentStatisticsName==='满意度-未评价'">
                    {{item.statisticsName}}
                    <span v-show="item.statisticsName">:</span>
                    <el-tag type="primary" size="mini">{{item.statisticsValue}}</el-tag>
                  </span>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i class="el-icon-phone-outline showPageIcon"></i>今日重拨人数
                </template>
                <div>
                  <span
                    class="paddingleft20"
                    v-for="item in showTopPageData.data"
                    :key="item.statisticsName"
                    v-if="item.parentStatisticsName==='今日重播人数'">
                    {{item.statisticsName}}
                    <span v-show="item.statisticsName">:</span>
                    <el-tag type="primary" size="mini">{{item.statisticsValue}}</el-tag>
                  </span>
                  <span class="paddingleft20">
                    异常指标
                    <span v-show="showTopPageData.abnormal">:</span>
                    <el-tag type="primary" size="mini">{{showTopPageData.abnormal}}</el-tag>
                  </span>
                </div>
              </el-collapse-item>
            </el-collapse>

          </div>
        </el-card>
      </div>
      <!-- 随访数量统计 -->
      <div class="QuantitTatistics">
        <el-card shadow="hover" class="boxCard">
          <div class="visitedRowRight" ref="homeEchart1">
            <div class="echartTitle">
              <div class="circle"> <div class="yuan"></div></div>
              <div class="circleTitle" style="float:left; font-weight: bold;color: #666;text-align: left;margin-left: 15px;line-height: 40px;height: 40px;">随访数量统计</div>
              <div class="circleharts" style="padding-top: 10px;border-bottom: 1px solid #ebeef5;">
                <!-- <form action="http://192.168.1.218:8082/export/statistics/chart" method="POST" ref="form1" id="form1"> -->
                <form :action="exportChart.chartUrl" method="POST" ref="form1" id="form1">
                  <input name="departmentName" v-model="departmentName"  type="hidden" />
                  <input name="jsonData1" v-model="params"  type="hidden" />
                  <input name="jsonData2" v-model="params1"  type="hidden" />
                  <el-button type="primary" class="outputExcel" @click="outputBase" v-loading.fullscreen.lock="fullscreenLoading">导出数据</el-button>
                </form>
                <el-radio-group v-model="selectRadio" @change="radioChange" style="float: right;margin-right: 50px;">
                  <el-radio :label="1">近7天</el-radio>
                  <el-radio :label="2">近30天</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="followTj">
              <!-- 随访数量统计条形图 -->
              <follow-count :dataX="switchX" :dataY="switchY"></follow-count>
            </div>
          </div>
        </el-card>
      </div>
    </el-row>
     <!-- 客户总体情况分析 -->
    <el-row class="homePage-fotter">
      <el-col :span="24">
        <el-row class="bottomContent">
          <el-row class="home-title">
            <el-col :span="10" class="home-title-col">患者总体情况分析</el-col>
            <el-col :span="14" class="home-title-time">
              <el-radio-group v-model="hzfxTabActive" @change="tabTimeSelect">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">近7天</el-radio>
                <el-radio :label="2">近30天</el-radio>
                <el-radio :label="3">3个月</el-radio>
                <el-radio :label="4">6个月</el-radio>
                <el-radio :label="5">一年</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <div class="sft">
            <!-- 用药依从性 -->
            <div class="sft2" ref="sft2">
              <medicine-pie :dataMedicine="medicineData" :total2="totalbt2"></medicine-pie>
            </div>
            <!-- 疾病分布情况 -->
            <div class="sft1" ref="sft1">
              <disease-pie :dataDisease="diagnoseInfoData" :total="totalbt1"></disease-pie>
            </div>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <!-- 特别关心 -->
    <el-row class="careTable">
      <el-row class="home-title">
        <el-col :span="10" class="home-title-col">特别关注</el-col>
        <el-col :span="14" class="home-title-time"></el-col>
      </el-row>
      <el-col :span="24" class="common-table" style="min-width: 415px;">
        <el-table
          border
          :data="SpecialtableData"
          v-loading="syhz"
          v-if="SpecialtableData.length">
          <el-table-column label="姓名" prop="patientName" align="center" ></el-table-column>
          <el-table-column label="特别关注" align="center">
            <template slot-scope="scope">
              <el-tag size="mini">{{scope.row.gzTag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="patientSex" label="性别" align="center" ></el-table-column>
          <el-table-column prop="patientAge" label="年龄" align="center" ></el-table-column>
          <el-table-column prop="icdName" label="疾病名称" align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="address" label="档案" align="center"  >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click.native="wayButton(scope)">档案</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row class="homepagefy" v-if="SpecialtableData.length">
          <el-col :span="24" class="text-right" style="margin-top:24px;">
            <el-pagination
              @current-change="homeCurrentPage"
              :current-page.sync="currentPagehome"
              :page-size="10"
              layout="total,prev, pager, next"
              :total="totalPagehome">
            </el-pagination>
          </el-col>
        </el-row>

      </el-col>
      <!-- 无数据的时候 -->
      <el-row v-show="sfyd">
        <el-col :span="16" :offset="8">
          <img src="../../../assets/images/syyd.jpg" class="fl-left" alt="特别关注">
          <div class="nullWords fl-left">
            <p class="p1"></p>
            <p class="p2">添加重要患者关注<br>实时跟踪病情康复</p>
          </div>
        </el-col>
        <el-col :span="12" :offset="12">
          <el-button @click.native="routerToHzList" type="primary">立即前往</el-button>
        </el-col>
      </el-row>
    </el-row>
    <!-- 生肖头像弹框 -->
    <el-dialog width="522px" :show-close="false" :visible.sync="innerVisible" custom-class="bdzoo">
      <el-row class="regModel1">
        <el-col :span="24" class="stepTwo">请选择一个形象作为您的AI虚拟医生助手吧!</el-col>
        <el-col :span="24" class="zooSelect">
          <ul class="zooIcon">
            <li v-for="(item,index) in imgList"  @click="selectIcon(item ,index)" :key="index">
              <div class="imgzoo fn-rel" :key="item.key">
                <img :src="item.value" alt="">
                <i class="el-icon-success fn-abs" :class="{'colorShow': index === cwtx}"></i>
                <p>{{item.remark}}</p>
              </div>
            </li>
          </ul>
        </el-col>
        <el-col :span="24" class="stepfinish">
          <el-button
            type="primary"
            :style="{padding: '6px 12px',marginTop: '12px'}" @click="finBtn">
            完成
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 患者档案 -->
		<hz-file ref="hzFileRef" />
  </div>
</template>
<script>
  import { commonUrl } from 'RJZL_API/commonUrl';
  import { rjPage, exportChart } from 'RJZL_API/rjPage';
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import HzFile from '@/components/Dialog/hzFile/hzFile';
  import { Point } from '@/utils/selectOptions';
  import html2canvas from 'html2canvas';
  import { setTimeout } from 'timers';
  import FollowCount from './echarts/followCount';
  import DiseasePie from './echarts/diseasePie';
  import MedicinePie from './echarts/medicinePie';
  import Cookies from 'js-cookie';
  import { mapState } from 'vuex';
  export default {
    name: 'Homepage',
    data() {
      return {
        exportChart: exportChart, // 导出图表
        userId: Cookies.get('userId'), // 医生id
        laterhours: Cookies.get('laterhourslc'), // 距上次登录
        dateLoginlc: Cookies.get('dateLoginlc'), // 上次登录时间
        // 医生个人信息
        getAdminInfo: {
          aipicTureUrl: '', // 头像url
          realname: '', // 医生姓名
          AiName: '', // 头像名字
          needClCount: '', // 随访结果待处理
          hadVisitCount: '', // 已随访
          hadVisitPeopleCount: '', // 患者数
          needShCount: '', // 随访方案待处理
        },
        // 随访数量统计
        selectRadio: 1, // 随访数量(7天,30天)
        switchX: [], // x轴
        switchY: [], // y轴
        // 绑定头像
        innerVisible: false, // 绑定头像
        cwtx: null, // 选中的宠物index
        imgList: [], // 12生肖头像列表
        // 患者总体情况分析
        hzfxTabActive: 0, // 患者分析(近7天/30天/半年)
        diagnoseInfoData: [], // 疾病分布情况
        medicineData: [], // 用药依从性data
        totalbt1: 0, // 随访疾病分类总人数
        totalbt2: 0, // 用药依从性总人数
        SpecialtableData: [],
        currentPagehome: 1, // 分页
        totalPagehome: null, // table总条数
        currenthref: '', // 12生肖地址前缀
        taskId: '', // 获取病人的taskId
        syhz: false, // 特别关心loading
        sfyd: false,
        base64Url1: '', // 随访数量统计
        base64Url2: '', // 疾病分布
        base64Url3: '', // 用药依从性统计
        radioType: '1', // 随访数量统计1:7天，2:30天
        tabName: '1', // 客户总体分析的type时间选择遵循tab.name
        fullscreenLoading: false,
        params: '', // jsonData1
        params1: '', // jsonData2
        // departmentCode: '1', // 肿瘤1，体检2
        departmentName: sessionStorage.getItem('departmentName'),
        showTopPageData: [], // 出院随访简报
        openCollapse: '1', // 出院随访简报默认打开成功通知
        showTotal: null // 出院随访简报应随访人数
      };
    },
    components: {
      swiper,
      swiperSlide,
      HzFile,
      FollowCount,
      DiseasePie,
      MedicinePie
    },
    computed: {
      ...mapState({
        'getCareStatus': state => state.user.getCareStatus
      })
    },
    mounted() {
      this.getNoticedDate(); // 显示医生信息记录次数
      this.SpecialCare(1); // 特别关心
      this.visitCountInfo(1); // 随访数量统计
      this.diagnoseInfo(0); // 疾病分布分布情况
      this.getUseEatInfo(0);// 用药依从性
      this.showTopPage(); //  首页出院随访简报
    },
    methods: {
      /**
      * 获取十二生肖
      * @function findAiPictureList
      * @param {String} adminId 医生id
      * @param {String} fromsys 医生端
      */
      findAiPictureList(userId) {
        commonUrl.findAiPictureList({
          'adminId': sessionStorage.getItem('userId'),
          'fromsys': 'web'
        }).then((res) => {
          // 12生肖地址前缀
          var url = location.href;
          var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
          var result = url.match(reg);
          this.currenthref = result[0] + '/';
          res.data.SysConfigLsit.forEach((item) => {
            item.value = this.currenthref + item.value;
          });
          this.imgList = res.data.SysConfigLsit;
        }).catch((error) => {
          console.log(error);
        });
      },
      /** 获取医生信息 */
      getNoticedDate() {
        rjPage.adminInfo({
          'adminId': this.userId
        }).then((res) => {
          if (res.code === 0) {
            if (res.data.aipicTureUrl !== '') {
              const url = location.href;
              const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
              const result = url.match(reg);
              this.currenthref = result[0];
              res.data.aipicTureUrl = this.currenthref + '/' + res.data.aipicTureUrl;
            } else {
              this.innerVisible = true;
              this.findAiPictureList();
            }
            this.getAdminInfo = res.data;
          } else {
            this.$message.error(res.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
      * 选择用户头像 */
      selectIcon(item, index) {
        this.cwtx = index;
        this.selectKey = item.key;
      },
      /** 绑定宠物头像 */
      finBtn() {
        if (this.selectKey) {
          this.innerVisible = false;
          commonUrl.bindAiPicture({
            'adminId': this.userId,
            'aiPictureCode': this.selectKey
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.message);
              this.getNoticedDate();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error('请选择头像!');
        }
      },
      /**
      * 疾病分布情况
      * @function diagnoseInfo
      * @param {String} adminId 医生id
      * @param {String} dateType type
      */
      diagnoseInfo(type) {
        this.diagnoseInfoData.length = 0;
        rjPage.diagnoseInfo({
          'adminId': sessionStorage.getItem('userId'),
          'dateType': type
        }).then((res) => {
          if (res.code === 0) {
            const trueArray = [true, false, false, false, false];
            res.data.forEach((item, index) => {
              item.value = item.itemCount;
              item.name = item.diagnoseName;
              item.selected = trueArray[index];
              item.icon = 'circle';
            });
            //总人数
            if(res.data[0].Count) {
              this.totalbt1 = res.data[0].Count
            }else {
              this.totalbt1 = null
            }
            this.diagnoseInfoData = res.data
          }else {
            this.$message.error(res.message);
          }
        })
      },
      /**
      * 用药依从性
      * @function getUseEatInfo
      * @param {String} adminId 医生id
      * @param {String} dateType type
      */
      getUseEatInfo(type) {
        rjPage.getUseEatInfo({
          'adminId': sessionStorage.getItem('userId'),
          'dateType': type,
        }).then((res)=>{
          if(res.code == 0) {
            const trueArray = [true, false, false];

            res.data.forEach((item, index) => {
              item.value = item.itemCount;
              item.name = item.diagnoseName;
              item.selected = trueArray[index];
              item.icon = 'circle';
            })
            this.medicineData = res.data
          }
        });
      },
      /**
      * 监听随访统计开关
      * @function radioChange
      * @param {String} value 监听随访统计开关
      */
      radioChange(value) {
        this.radioType = value
        this.visitCountInfo(value)
      },
      /**
      * 监听患者总体情况分析
      * @function tabTimeSelect
      * @param {object} tab tab切换
      */
      tabTimeSelect(value) {
        this.totalbt1 = 0
        this.totalbt2 = 0
        this.tabName = value
        this.diagnoseInfo(value)
        this.getUseEatInfo(value)
      },
    /**
      * 随访数量统计
      * @function visitCountInfo
      * @param {String} adminId 医生id
      * @param {String} dateType value
      */
      visitCountInfo(value) {
        rjPage.visitCountInfo({
          'adminId': sessionStorage.getItem('userId'),
          'dateType': value
        }).then((res)=>{
          if(res.code == 0) {
            this.switchX=[]
            this.switchY=[]
            res.data.forEach((item)=> {
              let a = item.diagnoseName.slice(0,4)
              let b = item.diagnoseName.slice(4,6)
              let c = item.diagnoseName.slice(6,8)
              item.diagnoseName = a +'-'+b+'-'+c
              this.switchX.push(item.diagnoseName)
              this.switchY.push(item.itemCount)
            })
          }
        }).catch((error)=>{
          console.log(error)
        })
      },
      /** 路由跳转-出院随访结果 */
      routerToFollowupResults() {
        this.$router.push({path: '/dischargeFollowupPlanReview/dischargeFollowupResults'})
      },
      /** 路由跳转-患者列表 */
      routerToHzList() {
        this.$router.push({path: '/hzList'})
      },
      /** 路由跳转-出院随访计划审核 */
      routerToFollowupPlanReview() {
        this.$router.push({path: '/dischargeFollowupPlanReview/dischargeFollowupPlanReview'})
      },

     /** 特别关心 */
      SpecialCare(val) {
        rjPage.getMyPatient({
          'limit': 10,
          'pager': val,
          'adminId': sessionStorage.getItem('userId'),
          'gz': '1'
        }).then((res)=>{
          this.syhz = false
            this.SpecialtableData = res.data;
            this.totalPagehome = res.count;
            if(res.data.length<1){
              this.sfyd = true
            }
        }).catch((error)=>{
          this.syhz = false
        })
      },
      /*
      *分页
      */
      homeCurrentPage(val) {
        this.page = val;
        this.SpecialCare(val)
      },
      /*
      *获取记录信息
      */
      wayButton(scope) {
        this.$refs.hzFileRef.hzDialog = true;
        this.$store.dispatch('getScopeRowData', scope);
        this.$store.dispatch('getCareStatus', scope.row.hzxxId);
      },
      /*
      *已处理
      */
      outputBase () {
        let _this = this
        // 全屏loading
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        html2canvas(this.$refs.sft1).then(function(canvas) {
          var pp = new Image()
          pp.src = canvas.toDataURL('image/jpeg')
          _this.$nextTick(function () {
            this.base64Url1 = pp.src
          })

        });
        html2canvas(this.$refs.sft2).then(function(canvas) {
          var pp2 = new Image()
          pp2.src = canvas.toDataURL('image/jpeg')
          _this.$nextTick(function () {
            this.base64Url2 = pp2.src
          })

        });
        html2canvas(this.$refs.homeEchart1).then(function(canvas) {
          // document.body.appendChild(canvas);
          var pp2 = new Image()
          pp2.src = canvas.toDataURL('image/jpeg')
          _this.$nextTick(function () {
            this.base64Url3 = pp2.src
          })
        });

        setTimeout(() => {
          loading.close();
          if(this.base64Url1 != '' && this.base64Url2 != '' && this.base64Url3 != '') {
            this.outputFun ()
          }
        }, 2000);
      },
      outputFun () {
        let params ={
          "type": this.radioType,
          "base64Image": this.base64Url3,
          "count1": this.getAdminInfo.hadVisitPeopleCount,
          "count2": this.getAdminInfo.hadVisitCount,
        }
        let params1 =
        {
          "type": this.tabName,
          "base64Image1": this.base64Url1,
          "base64Image2": this.base64Url2,
          "count1": this.totalbt1,
          "count2": this.totalbt2
        }
        this.params = JSON.stringify(params)
        this.params1 = JSON.stringify(params1)
        console.log(this.$refs.form1)
        let _this = this
        setTimeout(function() {
          _this.$refs.form1.submit()
        },1000)
      },
      /**
       * 首页出院随访简报
       */
      showTopPage () {
        rjPage.showTopPage({
          'adminId': sessionStorage.getItem('userId'),
          'activeType': '0'
        }).then((res)=>{
          if(res.code === 0) {
            let getPhone, notGetPhone
            res.data.data.forEach( item => {
              if(item.parentStatisticsName === '已接通') {
                return getPhone = item.parentStatisticsValue
              }
              if(item.parentStatisticsName === '未接通') {
                return notGetPhone = item.parentStatisticsValue
              }
            })
            this.showTopPageData = res.data
            this.showTotal = getPhone + notGetPhone
          }
        })
      }
    },
    watch: {
      getCareStatus(newV, oldV){
        if (newV.refresh!=oldV.refresh) {
          this.$refs.hzFileRef.hzDialog = false;
          this.SpecialCare(this.currentPagehome)
        }
      }
    }
  };
</script>
<style lang="scss">
  @import '~styles/mixin.scss';
  @import '~styles/reset.scss';
  @import '~styles/base.scss';
  @import './homePage.scss';
  @import '~styles/search';
 /** 顶部 **/
.header-wrap {
  padding-bottom: 25px;
  // 每个长方形
  .public-style{
    float: left;
    box-shadow:0 0 10px #e1e1e1;
    border-radius: 4px;
    background: #fff;
    //左侧正方形
    .notice-font {
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        color: white;
        font-size: 40px;
      }
    }
    // 右侧字体
    .notice-content {
      overflow: hidden;
      p:nth-child(1){
        margin-top: 20px;
        font-size: 15px;
        margin-bottom: 10px;
      }
      p:nth-child(2){
        font-weight: bold;
        color: #2d8cf0;
      }
    }
  }

}
/** 特别关心 **/
.careTable {
  margin: 20px 0 30px 0;
  padding: 16px;
  background-color: #fff;
  .home-title {
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 10px;
    color: #555;
    .home-title-col {
      font-weight: bold;
      color: #666;
      line-height: 24px;
    }
  }
  //引导图片
  .nullWords {
    margin-left: 63px;
    float: left;
    .p1 {
      width: 10px;
      height: 4px;
      background: #69acff;
      margin:112px 0 5px;
    }
    .p2 {
      width: 111px;
      line-height: 23px;
      font-size: 13px;
    }
  }
}
/** 随访数量统计 **/
.QuantitTatistics{
  float: right;
  background: white;
  border-radius: 4px;
  height: 372px;
  min-width: 415px;
  width: 49%
}
/** 出院简报 **/
.showTopPage {
  margin-bottom: 10px;
  float: left;
  background: #fff;
  width: 49%;
  height: 372px;
  min-width: 415px;
  .showTopPage-title {
    width: 100%;
    text-indent: 15px;
    line-height: 40px;
    height: 40px;
    font-weight: bold;
    border-bottom: 1px solid rgb(235, 238, 245);
    color: #666;
  }
  .showTopPage-day {
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    font-size: 15px;
  }
  .showTopPage-content {
    padding: 15px;
    padding-top: 0;
    color: rgba(0,0,0,.65);
    font-size: 15px;
  }
}
/** 出院随访简报icon */
.showPageIcon {
  padding-right: 5px;
  font-size: 14px;
  font-weight: bold;
}
.show-number {
  padding: 0 5px;
}
.paddingleft20 {
  padding-left: 20px;
}
/**/
.circleharts{
  height: 41px;
  padding-top: 10px;
}
/** 客户总体情况title*/
.bottomContent{
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow:0 0 8px e1e1e1;
  .home-title {
    border-bottom: 1px solid #f1f1f1;
    padding-bottom: 10px;
    color: #555;
    .home-title-col {
      font-weight: bold;
      color: #666;
      line-height: 24px;
    }
    .home-title-time {
      text-align: right;
    }
  }
  /****患者总体情况分析--饼图*****/
  .sft {
    width: 100%;
    min-height: 280px;
    margin-top: 25px;
    //疾病分布
    .sft1 {
      float: left;
      padding-left: 25px;
      width: 50%;
      min-height: 250px;
    }
    //用药依从性
    .sft2 {
      float: left;
      padding-left: 25px;
      width: 50%;
      min-height: 250px;
    }
  }
}
.boxCard {
  height: 372px;
  .el-card__body {
    padding: 0;
  }
}



@media screen and (min-width:800px) and (max-width:1290px) {
  .noticeNum{
    width: 49%;
    float: left;
    margin: 10px 10px 0 0;
  }

  .noticeNum-two{
    float: left;
    margin-top: 10px;
    width: 49%;
    margin-left: 0!important;
   }
  .plpl{
    margin: 10px 0 0 10px!important;
  }
  // 出院简报---随访数量分析
  .showTopPage {
    width: 98%;
    float: left;
  }
  .QuantitTatistics {
    width: 98%;
    float: left;
  }
  .bottomContent .sft {
    // 出院简报---随访数量分析
    .sft1 {
      width: 98%;
      float: left;
    }
    .sft2 {
      width: 98%;
      float: left;
    }
  }

}
  .notice-picture{
    width:30% ;
    height: 100px;
    background: #fc8c70;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    img{
      display: block;
      height: 44px;
      width: 44px;
      border-radius: 5px;
    }
    p:nth-child(1){
      margin-top: 20px;
      font-size: 15px;
      margin-bottom: 10px;
    }
    p:nth-child(2){
      color: #2d8cf0;
    }
  }
  .notice-picture-two{
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(45, 140, 240);
    p:nth-child(1){
      margin-top: 20px;
      font-size: 15px;
      margin-bottom: 10px;
    }
    p:nth-child(2){
      color: #2d8cf0;
    }
  }
  .notice-picture-three{
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(100, 213, 114);
  }

 .notice-picture-four{
   display: flex;
   justify-content: center;
   align-items: center;
   background: rgb(255, 213, 114);
 }
  .notice-content{
    overflow: hidden;
    p:nth-child(1){
      margin-top: 20px;
      font-size: 15px;
      margin-bottom: 10px;
    }
    p:nth-child(2){
      font-weight: bold;
      color: #2d8cf0;
    }
  }
  .notice-content-three{
    overflow: hidden;
    p:nth-child(1){
      margin-top: 20px;
      font-size: 15px;
      margin-bottom: 10px;
    }
    p:nth-child(2){
      font-weight: bold;
      color: #ffd572;
    }
  }
 .notice-content-two{
   overflow: hidden;
   p:nth-child(1){
     margin-top: 20px;
     font-size: 15px;
     margin-bottom: 10px;
   }
   p:nth-child(2){
     color: #64d572;
     font-weight: bold;
     /*font-size: 18px;*/
   }
 }
  .notice-content-one{
    overflow: hidden;
    p:nth-child(1){
      margin-top: 20px;
      font-size: 15px;
      margin-bottom: 10px;
    }
    p:nth-child(2){
      color: #fc8c70;
      font-weight: bold;
      /*font-size: 18px;*/
    }
  }

  .outputExcel {
    margin: -5px 50px 0 0;
    padding:6px 12px;
    float: right;
    font-size :13px;
  }
  // 随访数量统计的div
  .followTj {
    width: 100%;
    height: 300px;
  }
  .homePage-fotter {
    background: #fff;
    border: 1px solid #e9eaec;
    border-radius: 4px;
    box-shadow:0 0 4px #e1e1e1;
    -webkit-box-shadow:0 0 4px #e1e1e1;
  }
  .blue-color {
    background: rgb(45, 140, 240);
  }
  .green-color {
    background: #64d572;
  }
  .origin-color {
    background: #ffd572;
  }
  .blue-font {
    color: rgb(45, 140, 240);
  }
  .green-font {
    color: #64d572;
  }
  .origin-font {
    color: #ffd572;
  }
  ::-webkit-scrollbar {
    display: none;
  }
</style>