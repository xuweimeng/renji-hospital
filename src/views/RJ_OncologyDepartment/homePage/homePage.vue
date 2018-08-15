<template>
  <div class="homePage">
    <el-row class="header-wrap">
      <el-col :span="7" class="public-style noticeNum">
        <div class="notice-picture">
          <img :src="getAdminInfo.aipicTureUrl">
        </div>
        <div class="notice-content-one">
          <p class="text-center">您好，{{getAdminInfo.realname}}医生,{{getAdminInfo.AiName}}已等候您{{getAdminInfo.laterhours?getAdminInfo.laterhours:'0'}}小时了。</p>
          <p class="text-center">上次登录时间:{{getAdminInfo.lastVisitDate?getAdminInfo.lastVisitDate:"无"}}</p>
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
          <p class="text-center">已随访人次</p>
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
                  <i class="el-icon-edit-outline showPageIcon"></i>满意度 Consistency
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
              <medicine-pie :dataMedicine="yyycData" :total2="totalbt2"></medicine-pie>
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
		<hz-file
			:hzDialog="hzDialog"
			@closeChildren="closeChildren">
    </hz-file>
  </div>
</template>
<script>
  import { commonUrl } from 'RJZL_API/commonUrl';
  import { rjPage, exportChart } from 'RJZL_API/rjPage';
  import echart from 'echarts';
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import HzFile from '@/components/Dialog/hzFile/hzFile';
  import { Point } from '@/utils/selectOptions';
  import html2canvas from 'html2canvas';
  import { setTimeout } from 'timers';
  import FollowCount from './echarts/followCount';
  import DiseasePie from './echarts/diseasePie';
  import MedicinePie from './echarts/medicinePie';
  import Cookies from 'js-cookie'
  export default {
    name: 'Homepage',
    data() {
      return {
        exportChart: exportChart, // 导出图表
        userId: '',//医生id
        laterhours: '',//距上次登录
        isinspectPlength:true,
        PhysicalExSet:{},   //体检套餐信息
        //医生个人信息
        getAdminInfo: {
          aipicTureUrl: '',//头像url
          realname: '',//医生姓名
          AiName: '',//头像名字
          needClCount: '',//随访结果待处理
          hadVisitCount: '',//已随访
          hadVisitPeopleCount: '',//患者数
          needShCount: '',//随访方案待处理
        },
        PhysicalProject:{},   //体检项目

        //随访数量统计
        selectRadio: 1,//随访数量(7天,30天)
        switchX: [],//x轴
        switchY: [],//y轴
        //绑定头像
        innerVisible: false,//绑定头像
        cwtx: null,//选中的宠物index
        imgList: [],//12生肖头像列表
        //患者总体情况分析
        hzfxTabActive: 0,//患者分析(近7天/30天/半年)
        diagnoseInfoData: [],//疾病分布情况

        bqyz: {},//随访记过处理(病情严重)
        bqwd: {},//随访记过处理(病情稳定)
        value1: '',//select.model
        value2: '',//select.model
        value3: '',//select.model
        value4: '',//select.model
        yyycData: [],//用药依从性data
        options: [],

        value: '',
        percent1: null,//规律
        percent2: null,//间断
        percent3: null,//不服用
        totalbt1: 0,//随访疾病分类总人数
        totalbt2: 0,//用药依从性总人数
        SpecialtableData: [],
        page:1,
        currentPagehome: 1,//分页
        totalPagehome: null,//table总条数
        currenthref: '',//12生肖地址前缀
        dialogVisible: false,//记录弹框
        patientInfo: {},//记录个人信息
        patientId: '',//病人id
        taskId: '',//获取病人的taskId
        isCare: false,//点击记录后，查看病人是否被关注
        ypxx: '1',//药品信息
        clientId:"",  //客户id
        selectNumber: 0,//选中第几次
        activeName1: 'a0',//指标折线图选中下标
        activeName2: '1',//随访语音折叠面板
        tabActive: 0,//当前选中的tab0全部患者1特别关心
        modelData:[],//患者指标
        targetTab: [],//指标tab
        xChart: [],
        yChart: [],
        swiperOption: {//swiper
          slidesPerView: 4,
          spaceBetween: 30,
          slidesPerGroup: 4,
          loop: false,
          loopFillGroupWithBlank: true,
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          },
        },
        swiperDate: [],//患者就诊档案时间
        sliderNumber: null,//当前选中的就诊时间
        zyData: [],
        mzData: [],
        loading4: false,
        isNull: false,//患者的住院门诊为都为视空
        dialogWay: false,//内层弹框
        selecOptions: [],
        selecOptions: [],
        modelData: [],
        targetTab: [],
        isResolveText:'',//判断当前用户是否有处理意见
        taskId: '',

        yyHrec: '',//语音地址
        tabLabel:'',
        showAnimal: false,
        loadingHp: true,
        leaveHospital: '',
        syhz: false,//特别关心loading
        loadingsfjg: false,
        sfyd: false,
        attrTaskId: '',//门住随访时间的taskId
        advice1: false,//暂不处理
        currentName: '',//当前患者姓名
        btnState: '',//当前处理意见类型
        hzDialog: false, // 患者就诊档案弹框
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
      }
    },
    components: {
      swiper,
      swiperSlide,
      HzFile,
      FollowCount,
      DiseasePie,
      MedicinePie
    },
    mounted() {
      this.getUserId();//用药依从性
      this.getNoticedDate();   //显示医生信息记录次数
      this.SpecialCare(1)//特别关心
      this.visitCountInfo(1)//随访数量统计
      this.diagnoseInfo(0);//疾病分布分布情况
      this.getUseEatInfo(0);//用药依从性
      this.showTopPage() // 首页出院随访简报
    },
    methods: {
      /**
       * 从sessionStorage获取医生id
       * @function getUserId
       * @param {String} userId 获取医生id
       */
      getUserId() {
        this.userId = sessionStorage.getItem('userId')//用户名
        this.laterhours = Cookies.get('laterhours')//用户名
      },
      /** 监听子组件关闭 */
      closeChildren (val) {
        this.hzDialog = false
        this.SpecialCare(this.currentPagehome)
      },
    /**
      * 获取十二生肖
      * @function findAiPictureList
      * @param {String} adminId 医生id
      * @param {String} fromsys 医生端
      */
      findAiPictureList(userId) {
        commonUrl.findAiPictureList({
          "adminId": sessionStorage.getItem('userId'),
          "fromsys": 'web'
        }).then((res) => {
          //12生肖地址前缀
          var url = location.href
          var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
          var result = url.match(reg);
          this.currenthref = result[0]+'/'
          res.data.SysConfigLsit.forEach((item)=>{
            item.value = this.currenthref+item.value
          })
          this.imgList = res.data.SysConfigLsit
        }).catch((error) => {
          console.log(error)
        })
      },
      /**
       * 获取首页数据
       **/
      getNoticedDate(){
        // let DateLoading = this.$loading({
        //   target:document.getElementsByClassName('content-wrapper')[0]
        // });
        rjPage.adminInfo({
          "adminId": sessionStorage.getItem('userId'),
        }).then((res) => {
          if(res.code === 0) {
            if (res.data.aipicTureUrl != '') {
              let url = location.href
              let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
              let result = url.match(reg);
              this.currenthref = result[0]
              res.data.aipicTureUrl = this.currenthref + '/'+ res.data.aipicTureUrl
            } else {
              this.innerVisible = true
              this.findAiPictureList()
            }
            this.getAdminInfo = res.data
            // DateLoading.close();
          }else {
            this.$message.error(res.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      },

      /**
       * 统计7天或30天体检通知数量
       *  "type":1 //日期类型，1：7天，2:30天
       **/
      noticedCountDateList(){
        commonUrl.noticedCountDate({
          "type": 1,
        }).then((res) => {
          if(res.code == "0") {

          }else {
            this.$message.error(res.message)
          }
        }).catch((error) => {
          console.log(error)
        })
      },

    /**
      * 选择用户头像
      * @function selectIcon
      * @param    {object} item  头像
      * @param    {String} index 头像index
      */
      selectIcon(item,index) {
      this.cwtx = index
      this.selectKey = item.key
      },
      /**
       * 绑定宠物头像
       * @function finBtn
       * @param {String} adminId 医生id
       * @param {String} aiPictureCode 仇无头像code
       */
      finBtn() {
        if(this.selectKey) {
          this.innerVisible = false
          commonUrl.bindAiPicture({
            "adminId": this.userId,
            "aiPictureCode":  this.selectKey
          }).then((res) => {
            if(res.code == "0") {
            this.$message.success(res.message)
            this.getNoticedDate()
            }else {
              this.$message.error(res.message)
            }
          }).catch((error) => {
            console.log(error)
          })
        }else {
          this.$message.error('请选择头像!')
        }
      },
    /**
      * 疾病分布情况
      * @function diagnoseInfo
      * @param {String} adminId 医生id
      * @param {String} dateType type
      */
      diagnoseInfo(type) {
        rjPage.diagnoseInfo({
          'adminId': sessionStorage.getItem('userId'),
          'dateType': type,
        }).then((res)=>{
          if(res.code == 0) {
            let qq = [
              {
              "color": '#fc8c70',
              },
              {
                "color": '#f9bd48',
              },
              {
              "color": '#fd6388',
              },
              {
              "color": '#69acff',
              },
              {
              "color": '#e9e9e9',
              },
            ]
            let bb = [
              {
                "isTrue": false,
              },
              {
                "isTrue": false,
              },
              {
                "isTrue": false,
              },
              {
              "isTrue": false,
              },
              {
                "isTrue": false,
              }
            ]
            //loadingsfjg
            let dd = []
            for(let i =0;i<res.data.length;i++){
              dd.push(Object.assign(qq[i],bb[i]))
            }

            let tt= []
            for(let i =0;i<res.data.length;i++){
              tt.push(Object.assign(dd[i],res.data[i]))
            }


            class Point {
              constructor(item) {
                this.value = item.value;
                this.name = item.name;
                this.icon = 'circle';
                this.percent = item.percent;
                this.itemStyle = {
                  normal: {
                    color: item.itemStyle.normal.color
                  }
                };
                this.selected = item.selected
              }
            }
            let mm = []
            tt.forEach((item) => {
              mm.push(new Point({
                value: item.itemCount,
                name: item.diagnoseName,
                percent: item.percent,
                selected: item.isTrue,
                icon : 'circle',
                itemStyle: {
                  normal: {
                    color: item.color
                  }
                },
              }))
            })
            //总人数
            if(res.data[0].Count) {
              this.totalbt1 = res.data[0].Count
            }else {
              this.totalbt1 = null
            }
            this.diagnoseInfoData = []
            this.diagnoseInfoData = mm
          }else {
            this.$message.error(res.message);
          }
        }).catch((error)=>{
          console.log(error)
        })
      },
      /**
      * 监听选择第几次
      * @function selectNumberFun
      * @param {String} value 监听选择第几次
      */
      selectNumberFun(value) {
        this.getVisistOrderResult(value)
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
            let qq = [
              {
              "color": '#69acff',
              },{
              "color": '#ffbd3d',
              },{
              "color": '#fc8c70',
              }
            ]
            let bb = [
              {
              "isTrue": false,
              },{
              "isTrue": false,
              },{
              "isTrue": false,
              }
            ]

            let dd = []
            for(let i =0;i<qq.length;i++){
              dd.push(Object.assign(qq[i],bb[i]))
            }
            let tt= [];
            var result =[
              {
                itemCount:res.data.arrive,
                diagnoseName:"规律",
                percent:res.data.arrivePercent
              },
              {
                itemCount:res.data.noArrive,
                diagnoseName:"间断",
                percent:res.data.noArrivePercent
              },{
                itemCount:res.data.nextArrive,
                diagnoseName:"不服用",
                percent:res.data.nextArrivePercent
              }
            ]
            for(let i =0;i<qq.length;i++){
              tt.push(Object.assign(dd[i],result[i]))
            }
            class Point {
              constructor(item) {
                this.value = item.value;
                this.name = item.name;
                this.icon = 'circle';
                this.percent = item.percent;
                this.itemStyle = {
                  normal: {
                    color: item.itemStyle.normal.color
                  }
                };
                this.selected = item.selected
              }
            }
            let mm = []
            tt.forEach((item) => {

              mm.push(new Point({
                value: item.itemCount,
                name: item.diagnoseName,
                percent: item.percent,
                selected: item.isTrue,
                icon : 'circle',
                itemStyle: {
                  normal: {
                    color: item.color
                  }
                },

              }))
            })
            this.yyycData = []
            this.yyycData = mm
            this.percent1 = ''
            this.percent2 = ''
            this.percent3 = ''
            this.yyycData.forEach((item)=>{
              if(item.name == '规律') {
                this.percent1 = item.percent
              }
              if(item.name == '间断') {
                this.percent2 = item.percent
              }
              if(item.name == '不服用') {
                this.percent3 = item.percent
              }

            })

            if(res.data) {
              this.totalbt2 = res.data.total
            }else {
              this.totalbt2 = 0
            }

          }
        }).catch((error)=>{
          console.log(error)
        })
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
        console.log('test');

        this.hzDialog = true
        this.$store.dispatch('getScopeRowData', scope)
      },
      /*
      *已处理
      */
      handleislike() {
        if(this.isCare) {
          //取消关注
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('div', {
              style:'text-align:center'
            }, [
            h('img', {
                attrs: {src: '../../static/images/animal.png'},
                style:'width: 60px;height:52px;margin:0 auto;'
              },null),
              h('p', null, '确定取消关心吗?'),
            ]),
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'careMsgBox',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle',
            beforeClose: (action, instance, done) => {
              done();
            }
          }).then(action => {
            //取消关注
            commonUrl.updateGz({
              'diagnoseType':3,
              'adminId':this.userId,
              'patientId': this.patientId,//患者的id （必填）
              'operateType': 0,//(操作类型 1:关注 0：取消关注) （必填）
              'operateTag':'' //关注的标签
            }).then((res)=>{
              if(res.code == 0) {
                this.isCare = false
                this.patientInfo.GzTag = '';
                this.SpecialCare();
                this.dialogVisible = false;
              }else{
                this.$message.error(res.message);
              }
            }).catch((error)=>{
              console.log(error)
            })
          }).catch(()=>{

          });
        }else {
          //增加关注
          this.$prompt('  ','添加标签', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入标签',
            customClass: 'careMsgBoxAdd',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle',
          }).then(({ value }) => {
            if(!value) {
              this.$message.error('标签不能为空!');
            }else if(value.toString().length<6){
              commonUrl.updateGz({
                diagnoseType:3,
                'adminId':this.userId,
                'patientId': this.patientId,//患者的id （必填）
                'operateType': 1,//(操作类型 1:关注 0：取消关注) （必填）
                'operateTag': value //关注的标签
              }).then((res)=>{
                if(res.code == 0) {
                  this.isCare = true
                  this.$message({
                    type: 'success',
                    message: '关注成功!'
                  });
                  this.getPatinetInfo()
                }
              }).catch((error)=>{
                console.log(error)
              })
            }else{
              this.$message.error('标签长度不能大于5!')
            }

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
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
            this.showTopPageData = res
            let getPhone, notGetPhone
            res.data.forEach( item => {
              if(item.parentStatisticsName === '已接通') {
                return getPhone = item.parentStatisticsValue
              }
              if(item.parentStatisticsName === '未接通') {
                return notGetPhone = item.parentStatisticsValue
              }
            })
            this.showTotal = getPhone + notGetPhone
          }
        })
      },
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