<template>
  <div class="homecontainer" style="height: 100%;">
    <!-- 上部 -->

    <el-row class="header-wrap">
      <el-col :span="7" style="background: white;" class="public-style noticeNum">
        <div>
          <div class="notice-picture">
            <!--el-icon-upload-->
            <i class="el-icon-upload" style="color: white;font-size: 40px;" v-if="!getAdminInfo.aipicTureUrl"></i>
            <img :src="'/'+getAdminInfo.aipicTureUrl" v-if="getAdminInfo.aipicTureUrl">
          </div>
          <div class="notice-content-one">
            <p>您好，{{getAdminInfo.realname}}医生,{{getAdminInfo.AiName}}已等候您{{lastHours?lastHours:0}}小时了。</p>
            <p>上次登录时间:{{getAdminInfo.lastVisitDate?getAdminInfo.lastVisitDate:"无"}}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="5" style="background: white;" class="public-style noticeNum-two">
        <div>
          <div class="notice-picture notice-picture-two">
            <i class="el-icon-message" style="color: white;font-size: 40px;"></i>
          </div>
          <div class="notice-content">
            <p>已通知人次</p>
            <p>{{getAdminInfo.hadVisitCount}}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="5" style="background: white;" class="public-style TotalNumber">
        <div>
          <div class="notice-picture notice-picture-three">
            <i class="el-icon-edit" style="color: white;font-size: 40px;"></i>
          </div>
          <div class="notice-content-two">
            <p>总客户数</p>
            <p>{{getAdminInfo.hadVisitPeopleCount}}</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" style="background: white;"  class="public-style wrap-four">
        <div>
          <div class="notice-picture notice-picture-four">
            <i class="el-icon-bell" style="color: white;font-size: 40px;"></i>
          </div>
          <div class="notice-content-three">
            <p>昨日通知结果</p>
            <p>{{getAdminInfo.needClCount}}</p>
          </div>
        </div>
      </el-col>
      <!--<el-col :span="12">-->
      <!--<div class="grid-content bg-purple-light">-->
      <!---->
      <!--</div>-->
      <!--</el-col>-->
    </el-row>
    <el-row style="margin-bottom: 10px; ">
      <el-col :span="10" class="SpecialConcern" style="min-width: 415px;">
        <div class="tbgx flRight" style="overflow: hidden;">
          <p class="tagConcern">特别关心</p>
          <div class="resultsProgress" style="height: 329px;">
            <el-table
              :data="SpecialtableData"
              style="width: 100%"
              class="homepageTable1"
              :show-header="true"
              border
              v-loading="syhz"
              v-if="SpecialtableData.length">
              <el-table-column label="姓名" prop="patientName" align="left" ></el-table-column>
              <el-table-column label="特别关心标签" align="center" width="110px">
                <template slot-scope="scope">
                  <el-tag style="background:#fff;font-size:12px;height:20px;line-height:18px;border-radius:10px;">{{scope.row.gzTag}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="性别/年龄" align="center" >
                <template slot-scope="scope">
                  <span>{{scope.row.patientSex}}</span>&nbsp;<span>{{scope.row.patientAge?"/":""}}{{scope.row.patientAge}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="icdName" label="套餐" align="center"  show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.mealName}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="档案" align="center"  >
                <template slot-scope="scope">
                  <el-button type="primary" @click="wayButton(scope)" style="height:23px;line-height:22px;width:45px;padding:0;font-size
                :13px;">档案</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row class="homepagefy" v-if="SpecialtableData.length">
              <el-col :span="24" class="text-right" style="margin-top:10px;">
                <el-pagination  @current-change="homeCurrentPage" :current-page.sync="currentPagehome" :page-size="4" layout="total,prev, pager, next"
                                :total="totalPagehome">
                </el-pagination>
              </el-col>
            </el-row>
            <!-- 无数据的时候 -->
            <div class="nullData" v-show="sfyd">
              <div class="nullImg">
                <div class="nullImg1">
                  <img src="../../assets/images/syyd.jpg" alt="">
                </div>
                <div class="nullWords">
                  <p class="p1"></p>
                  <p class="p2">添加重要患者关注<br>实时跟踪病情康复</p>
                </div>
              </div>
              <div class="nullBtn">
                <el-button @click.native="toHz" type="primary">立即前往</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="13" class="QuantitTatistics" style="min-width: 415px;">
        <div class="visitedRowRight">
          <div class="echartTitle">
            <div class="circle"> <div class="yuan"></div></div>
            <div class="circleTitle" style="float:left;text-align: left;margin-left: 15px;line-height: 40px;height: 46px;">通知数量统计</div>
            <div class="circleharts" style="padding-top: 10px;border-bottom: 1px solid #ebeef5;">
              <el-radio-group v-model="selectRadio" @change="radioChange" style="float: right;margin-right: 100px;">
                <el-radio :label="1">近7天</el-radio>
                <el-radio :label="2">近30天</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!--<div id="homeEchart1" style="width: 465px;height: 148px;">-->
          <div id="homeEchart1" style="height: 271px;">
          </div>
        </div>
      </el-col>
    </el-row>



    <el-row style="background: white;" class="bottomContent">
      <!-- 下部 -->
      <div class="hzxq">
        <!-- 患者分析 -->
        <div class="hzfx fl-left">
          <el-tabs v-model="hzfxTabActive" @tab-click="tabTimeSelect">
            <el-tab-pane label="客户总体情况分析" name="first" disabled>客户总体情况分析</el-tab-pane>
            <el-tab-pane label="近7天" name="1"></el-tab-pane>
            <el-tab-pane label="近30天" name="2" ></el-tab-pane>
            <el-tab-pane label="3个月" name="3"></el-tab-pane>
            <el-tab-pane label="6个月" name="4"></el-tab-pane>
            <el-tab-pane label="一年" name="5"></el-tab-pane>
            <el-tab-pane label="全部" name="0"></el-tab-pane>
          </el-tabs>
          <div class="sft">

            <!-- 疾病分布情况 -->
            <div class="sft1">
              <div class="sftitle">
                <div class="circle1"> <div class="yuan1"></div></div>
                <div class="circleTitle1">套餐分布情况</div>
              </div>
              <div class="sftcontent">
                <div class="echart2 left" id="echart2"></div>
                <div class="echartRight left" style="padding-top: 23px;">
                  <ul v-for="(item,index) in diagnoseInfoData" :key="index" v-if="item.percent">
                    <li :style="'background:'+item.itemStyle.normal.color"></li><li>{{item.name}}</li><li>{{item.percent}}%</li><li>{{item.value?item.value:'0'}}人</li>
                    <!--<li ></li><li>{{item.name}}</li><li>{{item.percent}}%</li><li>{{item.value?item.value:'0'}}人</li>-->

                  </ul>
                </div>
              </div>
            </div>


            <!-- 用药依从性 -->
            <div class="sft2">
              <div class="sftitle">
                <div class="circle1"> <div class="yuan1"></div></div>
                <div class="circleTitle1">到院情况</div>
              </div>
              <div class="diseEchart">
                <div class="echart2 left" id="echart3">
                </div>
                <div class="echartRight left" style="padding-top: 46px;">
                  <div style="overflow: hidden;">
                    <ul v-for="(item,index) in yyycData" :key="index">
                      <li :style="'background:'+item.itemStyle.normal.color"></li><li>{{item.name}}</li><li>{{item.value?item.value:'0'}}人</li>
                    </ul>
                  </div>

                </div>
                <ul class="echartRight2 left">
                  <li>
                    <p>前来</p>
                    <p>{{percent1?percent1:'0'}}</p>
                  </li>
                  <li>
                    <p>不来</p>
                    <p>{{percent2?percent2:'0'}}</p>
                  </li>
                  <li>
                    <p>改约</p>
                    <p>{{percent3?percent3:'0'}}</p>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

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
        <el-col :span="24" class="stepfinish"><button class="nextBtn" @click="finBtn">完成</button></el-col>
      </el-row>
    </el-dialog>

    <!-- 弹框 -->
    <el-dialog title="就诊档案" :visible.sync="dialogVisible" width="525px" top="30px" :center = "false" custom-class="hzDialog">
      <!-- 外层弹框 -->
      <div class="content" slot>
        <!-- 个人信息 -->
        <el-row class="personInfo">
          <el-col :span="12" class="elCol1">
            <!--<span class="personName colororigen" v-if="patientInfo">{{patientInfo.brxm}}</span>-->
            <span class="personSex colororigen" v-if="patientInfo" style="font-size: 15px;">{{patientInfo.name}} </span>
            <span class="personSex colororigen">{{patientInfo.sex}}/ </span>
            <span class="personXg" v-if="patientInfo" style="margin-left: 0;color: #ff602d">{{patientInfo.birthday}}</span><span style="margin-left: 20px">{{patientInfo.gzTag}}</span></el-col>
          <el-col :span="12" class="elCol2">
            <el-button type="text" @click="handleislike" v-bind:class="{ careColor: isCare}">
              <i class="iconfont" v-bind:class="{ careColor: isCare}" style="margin-right:5px; font-size:12px;">&#xe604;</i>
              {{isCare?'取消关心':'特别关心'}}
            </el-button>
          </el-col>
        </el-row>
        <el-row class="personResult">
        </el-row>
        <el-row class="personResult">
          <el-col :span="24" class="elCol3">
            <span class="elCol3Span1">手机号码&nbsp;:&nbsp;</span>
            <span class="elCol3Span2">{{patientInfo.phone?patientInfo.phone:"无"}}</span>
          </el-col>
        </el-row>
        <el-row class="personResult">
          <el-col :span="24" class="elCol3">
            <span class="elCol3Span1">证件号码&nbsp;:&nbsp;</span>
            <span class="elCol3Span2">{{patientInfo.identificationCard?patientInfo.identificationCard:'无'}}</span>
          </el-col>
        </el-row>
        <!--  就诊时间 -->
        <el-row class="resolveBtn"  v-if="swiperDate.length">
          <el-col :span="24" style="text-align:left;color:#000;">
            <!-- swiper -->
            <swiper :options="swiperOption" class="swiperTime" ref="swiper">
              <swiper-slide v-for="(item, index) in swiperDate" :key="index" @click.native="sliderClick(item,index)" :class="{'activeSlider': selectNumber === index}">体检<br>{{item.clientDate}}</swiper-slide>
              <!-- 按钮 -->
              <div class="swiper-button-prev" slot="button-prev">
                <i class="el-icon-arrow-left" style="margin-top:12px;font-size:20px; color:#ff6800"></i>
              </div>
              <div class="swiper-button-next" slot="button-next">
                <i class="el-icon-arrow-right" style="margin-top:12px;font-size:20px; color:#ff6800;margin-left:5px;"></i>
              </div>
            </swiper>
          </el-col>
        </el-row>
        <!-- 患者就诊信息 -->
        <el-row class="visitRecords" >
          <!-- 住院 -->
          <el-row v-if="!isNull">
            <el-row class="bed">
              <el-col :span="12">
                <span style="font-size:20px;color:#333;">体检</span>
              </el-col>
              <el-col :span="12"></el-col>
            </el-row>
            <el-row class="bedInfo" >
              <el-col :span="12" style="width: 330px;">
                <span class="colorLight">体检套餐 &nbsp;:&nbsp;</span>
                <span class="colorLight1" >{{PhysicalExSet.inspectMealName}}</span>
              </el-col>
              <el-col :span="12">
                <span class="colorLight">总检医生 &nbsp;:&nbsp;</span>
                <span class="colorLight1" >{{PhysicalExSet.inspectDoctor?PhysicalExSet.inspectDoctor:"无"}}</span>
              </el-col>
              <el-col :span="24" class="elCol3">
                <span class="elCol3Span1">是否是vip&nbsp;:&nbsp;</span>
                <span class="elCol3Span2">{{PhysicalExSet.clientType}}</span>
              </el-col>
            </el-row>
            <el-row style="padding: 0 36px;text-align:left;">
              <el-col :span="24" style="border-bottom: 1px solid #d8f1ff;color:#333;text-indent:10px;font-size: 14px;margin-top:10px;">
                体检结果
              </el-col>
            </el-row>
            <el-row class="bedInfo" >
              <el-col :span="22">
                <span class="colorLight" style="font-weight: bold;">体检总检结果 &nbsp;:&nbsp;</span>
                <span class="colorLight1" style="font-size: 12px;">{{PhysicalExSet.inspectConclusion?PhysicalExSet.inspectConclusion:"无"}}</span>
              </el-col>
            </el-row>
            <el-row class="bedInfo" >
              <el-col :span="22">
                <span class="colorLight" style="font-weight: bold;">体检健康建议 &nbsp;:&nbsp;</span>
                <span class="colorLight1" style="font-size: 12px;">{{PhysicalExSet.inspectSuggest?PhysicalExSet.inspectSuggest:"无"}}</span>
              </el-col>
            </el-row>
            <el-row class="leaveHospital" v-if="isinspectPlength">
              <el-collapse  accordion >
                <el-collapse-item   title="体检项目" >
                  <el-col :span="24" class="color666 text-left">项目名称&nbsp;:&nbsp;{{PhysicalProject.projectName}}</el-col>
                  <el-col :span="24" class="color666 text-left">项目小结&nbsp;:&nbsp;{{PhysicalProject.projectConclusion?PhysicalProject.projectConclusion:"无"}}</el-col>
                  <el-col :span="24" class="color666 text-left">完成状态&nbsp;:&nbsp;{{PhysicalProject.completeStatus}}</el-col>
                  <el-col :span="24" class="color666 text-left">体检科室&nbsp;:&nbsp;{{PhysicalProject.inspectDepartment?PhysicalProject.inspectDepartment:"无"}}</el-col>
                  <el-col :span="24" class="color666 text-left">体检医生&nbsp;:&nbsp;{{PhysicalProject.inspectDoctor}}</el-col>
                  <el-col :span="24" class="color666 text-left">结果值&nbsp;:&nbsp;{{PhysicalProject.finishValue}} &nbsp;&nbsp;{{PhysicalProject.unit}}&nbsp;&nbsp;{{PhysicalProject.finishStatus}}</el-col>
                  <el-col :span="24" class="color666 text-left">上限值&nbsp;:&nbsp;{{PhysicalProject.upValue}}</el-col>
                  <el-col :span="24" class="color666 text-left">下限值&nbsp;:&nbsp;{{PhysicalProject.downValue}}</el-col>
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </el-row>

          <!-- 无信息的时候 -->
          <el-row v-if="isNull" style="height: 250px;">
            <el-col :span="12" style="height: 250px;line-height:386px;text-align:right;"><img src="../../assets/images/animal.png" style="margin-right:20px;" alt=""></el-col>
            <el-col :span="12" style="height: 250px;line-height:350px;text-align:left;"><span>这个病人没有就诊信息哦...</span></el-col>
          </el-row>
        </el-row>
      </div>
      <!-- 内层弹框 -->
    </el-dialog>

    <!-- 处理意见 -->
    <el-dialog
      title="处理意见确认"
      :visible.sync="advice1"
      width="20%"
      custom-class="adviceModel">
      <span v-if="btnState!=''&&btnState=='2'">
        您选择的是"暂不处理"，您确认不需要给患者({{currentName}})任何提醒?
      </span>
      <span v-if="btnState!='2'">
        您选择的是{{btnState==0?'"病情稳定"':btnState==1?'"通知就诊"':''}}，患者将收到以下信息:
      </span>
      <br><br>
      <span v-if="btnState=='0'">
      【{{currentName}},您好！根据您这次的随访结果，请务必遵从医嘱用药，并定期来医院门诊复诊。】
      </span>
      <span v-if="btnState=='1'" style="margin-top: 20px;">
      【{{currentName}},您好！根据您这次的随访结果，建议您及时来医院门诊复诊。】
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="advice1 = false">选错了</el-button>
        <el-button type="primary" @click="clyjBtn">{{btnState=='2'?'不需要':'确定'}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { home } from '../../api/RJ_PhysicalExamination/home'; // 引入 api
  /**
   * 首页
   * @module Homepage
   */
//  import {API} from '@/serve'
  import echart from 'echarts';
  import 'swiper/dist/css/swiper.css';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
//  import {Point} from '@/common/js/selectOptions'
//  import Bus from '@/assets/js/bus'

  export default {
    data() {
      return {
        userId: '', // 医生id
        laterhours: '', // 距上次登录
        isinspectPlength: true,
        PhysicalExSet: {}, // 体检套餐信息
        // 医生个人信息
        getAdminInfo: {
          aipicTureUrl: '', // 头像url
          realname: '', // 医生姓名
          AiName: '', // 头像名字
          needClCount: '', // 随访结果待处理
          hadVisitCount: '', // 已随访
          hadVisitPeopleCount: '', // 患者数
          needShCount: '' // 随访方案待处理
        },
        PhysicalProject: {}, // 体检项目

        // 随访数量统计
        selectRadio: 1, // 随访数量(7天,30天)
        switchX: [], // x轴
        switchY: [], // y轴
        // 绑定头像
        innerVisible: false, // 绑定头像
        cwtx: null, // 选中的宠物index
        imgList: [], // 12生肖头像列表
        // 患者总体情况分析
        hzfxTabActive: '1', // 患者分析(近7天/30天/半年)
        diagnoseInfoData: [], // 疾病分布情况

        bqyz: {}, // 随访记过处理(病情严重)
        bqwd: {}, // 随访记过处理(病情稳定)
        value1: '', // select.model
        value2: '', // select.model
        value3: '', // select.model
        value4: '', // select.model
        yyycData: [], // 用药依从性data
        options: [],
        value: '',
        percent1: null, // 规律
        percent2: null, // 间断
        percent3: null, // 不服用
        totalbt1: null, // 随访疾病分类总人数
        totalbt2: null, // 用药依从性总人数
        SpecialtableData: [],
        page: 1,
        currentPagehome: 1, // 分页
        totalPagehome: null, // table总条数
        currenthref: '', // 12生肖地址前缀
        dialogVisible: false, // 记录弹框
        patientInfo: {}, // 记录个人信息
        patientId: '', // 病人id
        taskId: '', // 获取病人的taskId
        isCare: false, // 点击记录后，查看病人是否被关注
        ypxx: '1', // 药品信息
        clientId: '', // 客户id
        selectNumber: 0, // 选中第几次
        activeName1: 'a0', // 指标折线图选中下标
        activeName2: '1', // 随访语音折叠面板
        tabActive: 0, // 当前选中的tab0全部患者1特别关心
        modelData: [], // 患者指标
        targetTab: [], // 指标tab
        xChart: [],
        yChart: [],
        swiperOption: {// swiper
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
        sliderNumber: null, // 当前选中的就诊时间
        zyData: [],
        mzData: [],
        loading4: false,
        isNull: false, // 患者的住院门诊为都为视空
        dialogWay: false, // 内层弹框
        selecOptions: [],
        isResolveText: '', // 判断当前用户是否有处理意见
        yyHrec: '', // 语音地址
        tabLabel: '',
        showAnimal: false,
        loadingHp: true,
        leaveHospital: '',
        syhz: false, // 特别关心loading
        loadingsfjg: false,
        sfyd: false,
        attrTaskId: '', // 门住随访时间的taskId
        advice1: false, // 暂不处理
        currentName: '', // 当前患者姓名
        btnState: '' // 当前处理意见类型

      };
    },
    components: {
      swiper,
      swiperSlide
    },
    created() {
      this.userId = sessionStorage.getItem('userId');
      this.lastHours = sessionStorage.getItem('laterhours');
    },
    mounted() {
      this.getNoticedDate(); // 显示医生信息记录次数
      this.diagnoseInfo(1);// 套餐分布情况
      this.getUseEatInfo(1);// 到院情况
      this.SpecialCare(1);// 特别关心
      this.visitCountInfo(1);// 随访数量统计
      this.$nextTick(() => {
        this.dataSourcePie = echart.init(document.getElementById('homeEchart1'));
        this.dataSourceone = echart.init(document.getElementById('echart2'));
        this.dataSourceThree = echart.init(document.getElementById('echart3'));
        this.diagnoseInfo(1);
        this.visitCountInfo(1);// 随访数量统计
        this.getUseEatInfo(1); // 到院情况
        const self = this;
        window.addEventListener('resize', function() {
          self.dataSourcePie.resize();
          self.dataSourceone.resize();
          self.dataSourceThree.resize();
        });
      });
    },
    methods: {
      /**
       * 从sessionStorage获取医生id
       * @function getUserId
       * @param {String} userId 获取医生id
       */
      getUserId() {
        this.userId = sessionStorage.getItem('userId');// 用户名
        this.laterhours = sessionStorage.getItem('laterhours');// 距上次登录
        // 如果没有返回时间，则表示空
        if (this.laterhours == 'undefined' || this.laterhours == '') {
          this.laterhours = 0;
        }
        const aipictureurl = sessionStorage.getItem('aipictureurl');// 宠物头像
        if (aipictureurl == '') {
          this.innerVisible = true;
          this.findAiPictureList(this.userId);// 获取12生肖
        }
      },
      /**
       * 获取十二生肖
       * @function findAiPictureList
       * @param {String} adminId 医生id
       * @param {String} fromsys 医生端
       */
      findAiPictureList(userId) {
        home.findAiPictureList({
          'adminId': sessionStorage.getItem('userId'),
          'fromsys': 'web'
        }).then((res) => {
          // 12生肖地址前缀
          var url = location.href;
          var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
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
      /**
       * 获取首页数据
       **/
      getNoticedDate() {
        const DateLoading = this.$loading({
          target: document.getElementsByClassName('content-wrapper')[0]
        });
        home.getNoticed({
          'adminId': this.userId
        }).then((res) => {
          if (res.code == '0') {
            this.getAdminInfo.realname = res.data.realname; // 医生名字
            this.getAdminInfo.AiName = res.data.aiName; // 患者名字
            this.getAdminInfo.hadVisitCount = res.data.noticedPersonCount; // //已通知X人次
            this.getAdminInfo.hadVisitPeopleCount = res.data.noticedPersonSum; // //已通知X人次
            this.getAdminInfo.needClCount = res.data.noticedCount; // 昨日通知结果条数
            this.getAdminInfo.laterhours = res.data.laterHours;
            this.getAdminInfo.lastVisitDate = res.data.lastVisitDate;
            DateLoading.close();
            if (res.data.aiPictureUrl) {
              this.getAdminInfo.aipicTureUrl = res.data.aiPictureUrl; // 图片地址
            } else {
              this.innerVisible = true;
              this.findAiPictureList();
            }
          } else {
            this.$message.error(res.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       * 选择用户头像
       * @function selectIcon
       * @param    {object} item  头像
       * @param    {String} index 头像index
       */
      selectIcon(item, index) {
        this.cwtx = index;
        this.selectKey = item.key;
      },
      /**
       * 绑定宠物头像
       * @function finBtn
       * @param {String} adminId 医生id
       * @param {String} aiPictureCode 仇无头像code
       */
      finBtn() {
        if (this.selectKey) {
          this.innerVisible = false;
          home.bindAiPicture({
            'adminId': this.userId,
            'aiPictureCode': this.selectKey
          }).then((res) => {
            if (res.code == '0') {
              this.$message.success(res.message);
              this.getNoticedDate();
            } else {
              this.$message.error(res.message);
            }
          }).catch((error) => {
            console.log(error);
          });
        } else {
          this.$message.error('请选择头像!');
        }
      },
      /**
       * 查询首页个人信息
       * @function adminInfo
       * @param {String} adminId 医生id
       */
      adminInfo() {
        home.adminInfo({
          'adminId': this.userId
        }).then((res) => {
          if (res.code == 0) {
            // 获取当前url
            const url = location.href;
            const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
            const result = url.match(reg);
            this.currenthref = result[0];
            res.data.aipicTureUrl = this.currenthref + '/' + res.data.aipicTureUrl;
            this.getAdminInfo = res.data;
            sessionStorage.setItem('aipictureurl', res.data.aipicTureUrl);
          } else {
            this.$message.error(res.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       * 疾病分布情况
       * @function diagnoseInfo
       * @param {String} adminId 医生id
       * @param {String} dateType type
       */
      diagnoseInfo(type) {
        home.clientDistribute({
          'dateType': type
        }).then((res) => {
          if (res.code == 0) {
            const qq = [
              {
                'color': '#fc8c70'
              }, {
                'color': '#f9bd48'

              }, {
                'color': '#fd6388'
              }, {
                'color': '#69acff'
              }, {
                'color': '#e9e9e9'
              }
            ];
            const bb = [
              {
                'isTrue': false
              }, {
                'isTrue': false
              }, {
                'isTrue': false
              }, {
                'isTrue': false
              }, {
                'isTrue': false
              }
            ];
            // loadingsfjg
            const dd = [];
            for (let i = 0; i < res.resultList.length; i++) {
              dd.push(Object.assign(qq[i], bb[i]));
            }

            const tt = [];
            for (let i = 0; i < res.resultList.length; i++) {
              tt.push(Object.assign(dd[i], res.resultList[i]));
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
                this.selected = item.selected;
              }
            }
            const mm = [];
            tt.forEach((item) => {
              mm.push(new Point({
                value: item.itemCount,
                name: item.diagnoseName,
                percent: item.percent,
                selected: item.isTrue,
                icon: 'circle',
                itemStyle: {
                  normal: {
                    color: item.color
                  }
                }
              }));
            });
            // 总人数
            if (res.Count) {
              this.totalbt1 = res.Count;
            } else {
              this.totalbt1 = 0;
            }
            this.diagnoseInfoData = [];
            this.diagnoseInfoData = mm;
            this._echarts2();
          } else {
            this.$message.error(res.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       * 监听选择第几次
       * @function selectNumberFun
       * @param {String} value 监听选择第几次
       */
      selectNumberFun(value) {
        this.getVisistOrderResult(value);
      },
      /**
       * 到院情况
       * @function getUseEatInfo
       * @param {String} adminId 医生id
       * @param {String} dateType type
       */
      getUseEatInfo(type) {
        home.arriveHospital({
          'dateType': type
        }).then((res) => {
          if (res.code == 0) {
            const qq = [
              {
                'color': '#69acff'
              }, {
                'color': '#ffbd3d'
              }, {
                'color': '#fc8c70'
              }
            ];
            const bb = [
              {
                'isTrue': false
              }, {
                'isTrue': false
              }, {
                'isTrue': false
              }
            ];

            const dd = [];
            for (let i = 0; i < qq.length; i++) {
              dd.push(Object.assign(qq[i], bb[i]));
            }
            const tt = [];
            var result = [
              {
                itemCount: res.data.arrive,
                diagnoseName: '前来',
                percent: res.data.arrivePercent
              },
              {
                itemCount: res.data.noArrive,
                diagnoseName: '不来',
                percent: res.data.noArrivePercent
              }, {
                itemCount: res.data.nextArrive,
                diagnoseName: '改约',
                percent: res.data.nextArrivePercent
              }
            ];
            for (let i = 0; i < qq.length; i++) {
              tt.push(Object.assign(dd[i], result[i]));
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
                this.selected = item.selected;
              }
            }
            const mm = [];
            tt.forEach((item) => {
              mm.push(new Point({
                value: item.itemCount,
                name: item.diagnoseName,
                percent: item.percent,
                selected: item.isTrue,
                icon: 'circle',
                itemStyle: {
                  normal: {
                    color: item.color
                  }
                }

              }));
            });
            this.yyycData = [];
            this.yyycData = mm;
            this.percent1 = '';
            this.percent2 = '';
            this.percent3 = '';
            this.yyycData.forEach((item) => {
              if (item.name == '前来') {
                this.percent1 = item.percent;
              }
              if (item.name == '不来') {
                this.percent2 = item.percent;
              }
              if (item.name == '改约') {
                this.percent3 = item.percent;
              }
            });
            if (res.data) {
              this.totalbt2 = res.data.total;
            } else {
              this.totalbt2 = null;
            }

            this._echarts3();
          } else {
            // this.$message.error(res.message);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       * 监听随访统计开关
       * @function radioChange
       * @param {String} value 监听随访统计开关
       */
      radioChange(value) {
        this.visitCountInfo(value);
      },
      /**
       * 监听患者总体情况分析
       * @function tabTimeSelect
       * @param {object} tab tab切换
       */
      tabTimeSelect(tab) {
        this.totalbt1 = null;
        this.totalbt2 = null;
        this.diagnoseInfo(tab.paneName);
        this.getUseEatInfo(tab.paneName);
      },
      /**
       * 随访数量统计
       * @function visitCountInfo
       * @param {String} adminId 医生id
       * @param {String} dateType value
       */
      visitCountInfo(value) {
        home.noticedCountDate({
          'type': value
        }).then((res) => {
          if (res.code == 0) {
            this.switchX = [];
            this.switchY = [];
            res.data.forEach((item) => {
              const a = item.diagnoseName.slice(0, 4);
              const b = item.diagnoseName.slice(4, 6);
              const c = item.diagnoseName.slice(6, 8);
              item.diagnoseName = a + '-' + b + '-' + c;
              this.switchX.push(item.diagnoseName);
              this.switchY.push(item.itemCount);
            });
            this._echarts1();
          } else {
            // this.$message.error(res.message)
          }
        }).catch((error) => {
          console.log(error);
        });
      },

      /*
      *跳转随访结果
      */
      routerToWay() {
        if (this.getAdminInfo.needClCount) {
          this.$router.push({ path: '/MdNoticeRt' });
          Bus.$emit('activeIndex', '/MdNoticeRt');
        }
      },
      /*
      *跳转随访计划
      */
      routerToWay1() {
        this.$router.push({ path: '/FollowParam' });
        Bus.$emit('activeIndex1', '/FollowParam');
      },
      /*
      *跳转随访计划
      */
      toHz() {
        this.$router.push({ path: '/CtList' });
        Bus.$emit('activeIndex2', '/CtList');
      },

      /*
      *特别关心
      */
      SpecialCare() {
        home.specialClient({
          'limit': 4,
          'page': this.page,
          adminId: this.userId
        }).then((res) => {
          this.syhz = false;
          this.SpecialtableData = res.data;
          this.totalPagehome = res.total;
          // if (res.data.length < 1) {
          //   this.sfyd = true;
          // }
        }).catch((error) => {
          this.$message.error(error.message);
          this.syhz = false;
        });
      },

      /*
      *分页
      */
      homeCurrentPage(val) {
        this.page = val;
        this.SpecialCare();
      },
      /** ***************弹框***********************/
      /*
       *获取记录信息
       */
      wayButton(scope) {
        this.selecOptions = [];
        this.targetTab = [];// 清空数据
        this.patientId = scope.row.hzxxId;
        this.visitOrderId = scope.row.id;
        this.taskId = scope.row.taskId;
        this.currentName = scope.row.patientName;
        this.getPatinetInfo(); // 客户档案-基本信息
        this.loading4 = true;
      },
      /**
       * 客户档案-历史体检日期
       */
      jzTime(id) {
        home.clientInspectDate({
          'patientId': this.patientId,
          'clientId': id,
          adminId: this.userId
        }).then((res) => {
          console.log(11111111111111111);
          console.log(res);
          if (res.code == 0) {
            this.isNull = false; // 代表没有该记录
            this.swiperDate = res.data;
            this.zyData = [];
            this.selectNumber = 0;
            this.clientId = res.data[0].clientId;
            this.currentPartientInfo(res.data[0].clientDate);
          } else {
            this.swiperDate = [];
            this.isNull = true; // 代表没有该记录
          }
        }).catch((error) => {
          this.isNull = true; // 代表没有该记录
          console.log(error);
        });
      },
      /**
       * 客户档案-基本信息(刷新特别关注的标签)
       */
      getPatinetInfo() {
        this.patientInfo = '';
        home.clientInformation({
          'patientId': this.patientId,
          adminId: this.userId //
        }).then((res) => {
          console.log(res);
          if (res.code === 0) {
            this.dialogVisible = true;
            this.patientInfo = res.data;
            this.jzTime(res.data.clientId); // 历史体检日期  需要传客户id
          } else {
            this.dialogVisible = false;
            // this.$message.error(res.message);
          }
          if (res.data.gzTag) {
            this.isCare = true;
          } else {
            this.isCare = false;
          }
          // this.isResolveText = res.data.diseaseInfo
        }).catch((error) => {
          console.log(error);
        });
      },
      /*
      *点击就诊时间
      */
      sliderClick(item, index) {
      //        this.isNull = true;
        this.loading4 = true;
        this.zyData = [];
        this.mzData = [];
        this.selectNumber = index;
        this.currentPartientInfo(item.clientDate); // 客户档案-体检项目信息
      },
      /*
      *客户档案-体检项目信息
      */
      currentPartientInfo(item) {
      //        this.isNull = false
        home.clientTotalInspect({
          'patientId': this.patientId, //
          'date': item,
          'clientId': this.clientId,
          adminId: this.userId
        }).then((res) => {
          this.loading4 = false;
          if (res.code == 0) {
            this.PhysicalExSet = res.data;
            this.isNull = false;
            if (res.data.inspectProjectsVoList.length) {
              this.PhysicalProject = res.data.inspectProjectsVoList[0];
              this.isinspectPlength = true;
            } else {
              this.isinspectPlength = false;
            }
          } else {
            this.isNull = true;
          }
        }).catch((error) => {
          console.log(error);
        });
      },

      /*
      *已处理
      */
      handleislike() {
        if (this.isCare) {
          // 取消关注
          const h = this.$createElement;
          this.$msgbox({
            title: '消息',
            message: h('div', {
              style: 'text-align:center'
            }, [
              h('img', {
                attrs: { src: require('../../static/images/animal.png') },
                style: 'width: 60px;height:52px;margin:0 auto;'
              }, null),
              h('p', null, '确定取消关心吗?')
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
            // 取消关注
            home.updateGz({
              diagnoseType: 3,
              'adminId': this.userId,
              'patientId': this.patientId, // 患者的id （必填）
              'operateType': 0, // (操作类型 1:关注 0：取消关注) （必填）
              'operateTag': '' // 关注的标签
            }).then((res) => {
              if (res.code == 0) {
                this.isCare = false;
                this.patientInfo.GzTag = '';
                // 为了防止当第二页删除完得时候 记录得页码还是第二页，需得重新赋值
                if (this.page == Math.ceil(this.totalPagehome / 4)) {
                  this.page = Math.ceil((this.totalPagehome - 1) / 4);
                }
                this.SpecialCare();
                this.dialogVisible = false;
              } else {
                this.$message.error(res.message);
              }
            }).catch((error) => {
              console.log(error);
            });
          }).catch(() => {

          });
        } else {
          // 增加关注
          this.$prompt('  ', '添加标签', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '请输入标签',
            customClass: 'careMsgBoxAdd',
            cancelButtonClass: 'cancelButtonStyle',
            confirmButtonClass: 'confirmButtonStyle'
          }).then(({ value }) => {
            if (!value) {
              this.$message.error('标签不能为空!');
            } else if (value.toString().length < 6) {
              home.updateGz({
                diagnoseType: 3,
                'adminId': this.userId,
                'patientId': this.patientId, // 患者的id （必填）
                'operateType': 1, // (操作类型 1:关注 0：取消关注) （必填）
                'operateTag': value // 关注的标签
              }).then((res) => {
                if (res.code == 0) {
                  this.isCare = true;
                  this.$message({
                    type: 'success',
                    message: '关注成功!'
                  });
                  this.getPatinetInfo();
                }
              }).catch((error) => {
                console.log(error);
              });
            } else {
              this.$message.error('标签长度不能大于5!');
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      /** ***************内层弹框*********************/
      sfDialog(e) {
        this.taskId = e.target.attributes[0].value;
        this.dialogWay = true;
        this.targetTab = [];
        this.modelData = [];
        this.getWayResult(1);// 判断是否被处理
      },
      //       /*
      //      *处理意见按钮
      //      */
      //      resolveBTN (ev) {
      //        this.advice1 = true
      //        if(ev.target.innerText == '暂不处理') {
      //          document.querySelector('#updateDiseaseInfo1').classList.add('hello')
      //          document.querySelector('#updateDiseaseInfo2').classList.remove('hello')
      //          document.querySelector('#updateDiseaseInfo3').classList.remove('hello')
      //          this.btnState = 2
      //        }
      //        if(ev.target.innerText == '病情稳定') {
      //          document.querySelector('#updateDiseaseInfo2').classList.add('hello')
      //          document.querySelector('#updateDiseaseInfo1').classList.remove('hello')
      //          document.querySelector('#updateDiseaseInfo3').classList.remove('hello')
      //          this.btnState = 0
      //        }
      //        if(ev.target.innerText == '通知就诊') {
      //          document.querySelector('#updateDiseaseInfo3').classList.add('hello')
      //          document.querySelector('#updateDiseaseInfo1').classList.remove('hello')
      //          document.querySelector('#updateDiseaseInfo2').classList.remove('hello')
      //          this.btnState = 1
      //        }
      //      },
      clyjBtn() {
        this.clyj(this.btnState);
      },
      /**
       * 处理意见
       */
      clyj(btnState) {
        home.updateDiseaseInfo({
          'visitOrderId': this.visitOrderId,
          'diseaseInfo': btnState
        }).then((res) => {
          this.advice1 = false;
          if (res.code == 0) {
            this.wayDialoge = false;
            this.list(this.currentPageway1);
            this.list1(this.currentPageway2);
          } else {

          }
        }).catch((error) => {
          this.advice1 = false;
        });
      },
      /**
       *查看第几次随访
       */
      numberChange(value) {
        this.selectNumber = value;
        this.targetTab = [];
        this.getWayResult(value);
      },
      /**
       * 获取model随访结果
       */
      getWayResult(num) {
        API.followway.getVisistOrderResult({
          'num': num,
          'taskId': this.taskId
        }).then((res) => {
          if (res.code == 0) {
            this.selecOptions = [];
            // 随访进度
            if (res.count > 0) {
              this.selectNumber = num;
            } else {
              this.selectNumber = '';
            }
            for (let i = 1; i <= res.count; i++) {
              this.selecOptions.push(new Point(i));
            }
            // 判断指标类型
            res.data.forEach((item) => {
              if (item.isNum) {
                this.targetTab.push(item.fieldName);
              }
              if (item.isNormal) { // 指标正常
                if (item.isNum) { // 指标是数值类型
                  item.isNum = '';
                } else {
                  item.isNum = 'success';
                }
              } else if (!item.isNormal) { // 指标不正常
                item.isNum = 'danger';
              }
            });
            // 模态框数据
            this.modelData = res.data;
            this.yyHrec = res.AIVOICURL;

            this.visitOrderId1 = res.visitOrderId;
            this.getDiseaseInfo();
            this.activeName1 = 'a0';
            this.pp(this.targetTab[0], 0);
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      /**
       * 查询处理意见接口
       */
      getDiseaseInfo() {
        home.getDiseaseInfo({
          'visitOrderId': this.visitOrderId1
        }).then((res) => {
          if (res.code == 0) {
            if (res.data) {
              // 是否处理0:病情稳定 1:通知就诊  2:暂不处理  10表示未处理
              switch (res.data.diseaseInfo) {
                case 0:
                  document.querySelector('#updateDiseaseInfo2').classList.add('hello');
                  document.querySelector('#updateDiseaseInfo1').classList.remove('hello');
                  document.querySelector('#updateDiseaseInfo3').classList.remove('hello');
                  break;
                case 1:
                  document.querySelector('#updateDiseaseInfo3').classList.add('hello');
                  document.querySelector('#updateDiseaseInfo1').classList.remove('hello');
                  document.querySelector('#updateDiseaseInfo2').classList.remove('hello');
                  break;
                case 2:
                  document.querySelector('#updateDiseaseInfo1').classList.add('hello');
                  document.querySelector('#updateDiseaseInfo2').classList.remove('hello');
                  document.querySelector('#updateDiseaseInfo3').classList.remove('hello');
                  break;
                case 10:
                  document.querySelector('#updateDiseaseInfo1').classList.remove('hello');
                  document.querySelector('#updateDiseaseInfo2').classList.remove('hello');
                  document.querySelector('#updateDiseaseInfo3').classList.remove('hello');
                  break;
              }
            }
            // 如果是已审核的，处理按钮将会变成disabled点击失效
            if (res.data.diseaseInfo != 10) {
              document.querySelector('#updateDiseaseInfo1').setAttribute('disabled', true);
              document.querySelector('#updateDiseaseInfo2').setAttribute('disabled', true);
              document.querySelector('#updateDiseaseInfo3').setAttribute('disabled', true);
            } else {
              document.querySelector('#updateDiseaseInfo1').removeAttribute('disabled');
              document.querySelector('#updateDiseaseInfo2').removeAttribute('disabled');
              document.querySelector('#updateDiseaseInfo3').removeAttribute('disabled');
            }
          }
        }).catch((error) => {
          this.$message.error(error.message);
        });
      },
      /*
     *指标折线图tab切换
     */
      handleClick1(tab) {
        this.tabLabel = tab.label;
        this.pp(tab.label, tab.index);
      },
      /**
       * @functionName折线图
       */
      pp(label, number) {
        // 清空折线数据
        this.xChart = [];
        this.yChart = [];
        // 获取模态框指标信息
        home.getChartData({
          'hzxxId': this.patientId,
          'fieldName': label
        }).then((res) => {
          this.loadingsfjg = false;
          res.data.forEach((item) => {
            this.xChart.push(item.dateAdd);
            this.yChart.push(item.fieldValue);
          });
          const data1 = this.xChart;
          let data2 = [];
          const data3 = [];
          const data4 = [];
          const arrYchart = [];

          // 判断点击的是否是血压
          if (label.includes('血压')) {
            this.yChart.forEach((item) => {
              arrYchart.push(item.split('/'));
            });
            arrYchart.forEach((item) => {
              if (Number(item[0]) > Number(item[1])) {
                data3.push(item[0]);
                data4.push(item[1]);
              } else {
                data3.push(item[1]);
                data4.push(item[0]);
              }
            });
          }
          data2 = this.yChart;
          // 指定图表的配置项和数据
          const option1 = {
            backgroundColor: '#f9f9f9',
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: '12%',
              left: '10%',
              right: '8%',
              bottom: '12%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: data1
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: label,
                type: 'line',
                data: data2,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                },
                areaStyle: {
                  normal: {
                    color: new echart.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgba(255, 98, 66, .6)'
                    }, {
                      offset: 1,
                      color: 'rgba(255, 98, 66, .2)'
                    }])
                  }
                }
              }
            ]
          };
          const option2 = {
            backgroundColor: '#f9f9f9',
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              top: '12%',
              left: '10%',
              right: '8%',
              bottom: '12%'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: data1
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            },
            series: [
              {
                name: label,
                type: 'line',
                data: data3,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                }
                // markLine: {
                //   data: [
                //     [
                //       {name: '高压', xAxis: data1[0], yAxis: 140},
                //       {name: '高压', xAxis: data1[data1.length], yAxis: 140},
                //     ],

                //   ]
                // },
              },
              {
                name: label,
                type: 'line',
                data: data4,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                itemStyle: {
                  normal: {
                    color: 'rgba(255, 98, 66, .7)',
                    lineStyle: {
                      color: 'rgba(255, 98, 66, .5)',
                      width: 1
                    }
                  }
                }
                // markLine: {
                //   data: [
                //     [
                //       {name: '低压', xAxis: data1[0], yAxis: 85},
                //       {name: '低压', xAxis: data1[data1.length], yAxis: 85},
                //     ],

                //   ]
                // },
              }
            ]
          };

          if (label.includes('血压')) {
            if (data3.length) {
              idCon = echarts.init(document.getElementById(idCon));
              idCon.setOption(option2);
            }
          } else if (data2.length > 0) {
            idCon = echarts.init(document.getElementById(idCon));
            idCon.setOption(option1);
          } else {
            this.showAnimal = true;
          }
          this.loadingHp = false;
        }).catch((error) => {
          console.log(error);
        });
      },
      /*
   *echart2(疾病分布情况)
   */
      _echarts2() {
        const _this = this;
        this.echarts2 = echart.init(document.getElementById('echart2'));
        const data1 = this.diagnoseInfoData;
        this.echarts2.setOption({
          tooltip: {
            show: false,
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
          series: [
            {
              name: '套餐分布情况',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: function() {
                    return _this.totalbt1;
                  },
                  textStyle: {
                    fontSize: '14',
                    color: 'gray'
                  }
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
              data: data1
            }
          ]
        });
      },
      /*
      *echart3(用药依从性)
      */
      _echarts3() {
        this.echarts3 = echart.init(document.getElementById('echart3'));
        const _this = this;
        const data4 = this.yyycData;
        this.echarts3.setOption({
          tooltip: {
            show: false,
            align: 'left',
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '用药依从性',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: true,
                  position: 'center',
                  formatter: function() {
                    return _this.totalbt2;
                  },
                  textStyle: {
                    fontSize: '14',
                    color: 'gray'
                  }
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
              data: data4
            }
          ]
        });
      },
      /*
      *echart1(随访数量统计)
      */
      _echarts1() {
        this.echarts1 = echart.init(document.getElementById('homeEchart1'));
        this.echarts1.setOption({
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
              return params.seriesName + ':' + params.value;
            },
            textStyle: {
              align: 'right'
            }
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '10%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            data: this.switchX,
            axisLine: {
              lineStyle: {
                color: '#a1a1a1'
              }
            }
            // axisLabel: {
            //   interval: 0,
            //   rotate: 10
            // },
          },
          yAxis: {
            splitLine: { show: false },
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
              // color: '#0f0',；
              itemStyle: {
                normal: {
                  color: '#07d5d8' // 图标颜色
                }
              },
              data: this.switchY,
              lineStyle: {
                normal: {
                  width: 1,
                  color: 'rgba(8,213,216,.5)'
                }

              }
            },
            {
              name: '随访人数',
              type: 'bar',
              barWidth: 6,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: new echart.graphic.LinearGradient(
                    0, 0, 0.5, 1,
                    [
                      { offset: 0, color: '#8283da' },
                      { offset: 0.5, color: '#47aad9' },
                      { offset: 1, color: '#07d5d8' }
                    ]
                  )
                }
              },
              data: this.switchY
            }
          ]
        });
      }
    }
  };
</script>

<style lang="scss">
  @import '../../styles/mixin';
  @import '../../styles/reset';
  @import '../../styles/public';
  @import "../../styles/homePage";
  @import "../../styles/common";
  .SpecialConcern{
    width: 44.66667%;
    height: 372px;
    background: white;
    border-radius: 4px;
    border: 1px solid #e9eaec;
    box-shadow:0 0 5px grey;
    .resultsProgress{
      margin: 5px;
    }
    .tagConcern{
      height: 40px;
      line-height: 40px;
      float: left;
      width: 100%;
      text-align: left;
      padding-left: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
    }
  }
  .SpecialConcern:hover{
    box-shadow:0 0 15px grey;
  }
  .QuantitTatistics{
    float: right;
    background: white;
    border-radius: 4px;
    height: 372px;
    /*float: left;*/
    border: 1px solid #e9eaec;
    box-shadow:0 0 5px grey;
  }

  .QuantitTatistics:hover{
    box-shadow:0 0 15px grey;
  }
  .circleharts{
    height: 41px;
    padding-top: 10px;
  }
  .bottomContent{
    border-radius: 4px;
    box-shadow:0 0 8px grey;
  }
  .bottomContent:hover{
    box-shadow:0 0 15px grey;
  }
  .wrap-four{
    float: right;
  }
  .TotalNumber{
    /*float: left;*/
  }
  @media screen and (min-width:1180px) and (max-width:1270px) {
    .QuantitTatistics{
      width: 50%;
      float: right;
    }
    /* CSS 代码 */
  }
  .noticeNum{
    margin-right: 20px;
  }
  .noticeNum-two{
    margin-right: 20px;
  }
  @media screen and (min-width:800px) and (max-width:1220px) {
    .noticeNum{
      width: 49%;
      float: left;
      margin-right: 0;
    }
    .noticeNum-two{
      float: right;
      width: 49%;
      margin-right: 0px;
    }
    .wrap-four{
      width: 49%;
      float: right;
    }
    .TotalNumber{
      width: 49%;
      margin-right: 10px;
      float: left;
    }
    .public-style{
      margin-bottom: 10px;
    }

    /* CSS 代码 */
  }
  @media screen and (max-width:799px) {
    .noticeNum{
      width: 100%;
      float: left;
      margin-right: 0;
    }
    .noticeNum-two{
      float: right;
      width: 100%;
      margin-right: 0px;
    }
    .wrap-four{
      width: 100%;
      float: right;
    }
    .TotalNumber{
      width: 100%;
      margin-right: 10px;
      float: left;
    }
    .public-style{
      margin-bottom: 10px;
    }
    /* CSS 代码 */
  }
  /*.diseEchart{*/
  /*min-width: 780px;*/
  /*}*/
  @media screen and (min-width:798px) and (max-width:1030px) {
    .hzxq .sft .sft1 .sftcontent .echartRight{
      width: 100%;
      /*justify-content: center;*/
      /*display: flex;*/
      padding-left: 10%;
    }
    .hzxq .sft .sft1 .sftcontent .echart2{
      width: 100%;
    }
    .hzxq .sft .sft2 .diseEchart .echart2{
      width: 100%;
    }
    .hzxq .sft .sft2 .diseEchart .echartRight{
      padding-left: 10%;
    }
    .hzxq .sft .sft2 .diseEchart .echartRight{
      width: 202px;
    }
    /* CSS 代码 */
  }
  @media screen and (max-width:790px){
    .hzxq .sft .sft1 .sftcontent .echartRight{
      width: 100%;
      /*justify-content: center;*/
      /*display: flex;*/
      padding-left: 10%;
    }
    .hzxq .sft .sft1 .sftcontent .echart2{
      width: 100%;
    }
    .hzxq .sft .sft2 .diseEchart .echart2{
      width: 100%;
    }
    .hzxq .sft .sft2 .diseEchart .echartRight{
      padding-left: 10%;
    }
    .hzxq .sft .sft2 .diseEchart .echartRight{
      width: 102px;
      padding-left: 0;
    }
  }
  @media screen and (min-width:1180px) and (max-width:1200px) {
    .QuantitTatistics{
      width: 50%;
      float: right;
    }
    /* CSS 代码 */
  }
  @media screen and (min-width:1180px) and (max-width:1260px) {
    .SpecialConcern{
      width: 48%;
    }
    /* CSS 代码 */
  }
  @media screen and (min-width:1260px) and (max-width:1270px) {
    .SpecialConcern{
      width: 49%;
    }
    /* CSS 代码 */
  }
  @media screen and (max-width:1179px) {
    .QuantitTatistics{
      width: 100%;
      float: left;
    }
    .SpecialConcern{
      width: 100%;
      margin-bottom: 10px;
    }

    /* CSS 代码 */
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
  .public-style{
    margin-bottom: 10px;
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
  .public-style{
    box-shadow:0 0 10px grey;
    border-radius: 4px;
  }
  .public-style:hover{
    box-shadow:0 0 15px grey;
  }
  .hzDialog .el-dialog__body .content .visitRecords .bed, .daDialog .el-dialog__body .content .visitRecords .bed{
    margin: 15px 0 6px 0;
  }
  .left{
    float: left;
  }
  .notice-content-one,.notice-content,.notice-content-two,.notice-content-three{
    text-align: center;
  }
</style>
