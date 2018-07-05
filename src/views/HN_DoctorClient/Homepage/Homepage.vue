<template>
  <div class="homecontainer">
    <!-- 上部 -->
    <div class="homeinfo">
      <!-- 医生信息 -->
      <div class="doctorinfo left">
        <div class="sfanimal">
          <div class="sfanimalPic">
            <img :src="getAdminInfo.aipicTureUrl">
          </div>
          <div class="sfWords">
            <p class="sfWordsp1 text-left">
              <span class="entertime">您好，{{getAdminInfo.realname}}医生,{{getAdminInfo.AiName}}已等候您{{laterhours}}小时了。</span>
            </p>
            <p class="sfWordsp2 text-left">以下是您这段时间需要处理的内容</p>
          </div>
        </div>
        <div class="sfresult text-left" style="margin-top: 15px;" >
          <span class="cwname">{{getAdminInfo.AiName}}</span>
          <span style="line-height:14px;margin-left:60px;color:#666;">随访记录待处理:</span>
          <span class="orange" style="line-height:36px;font-size:36px;border-bottom:3px solid #ff6e40;margin:0 20px;cursor: pointer;" @click="routerToWay">{{getAdminInfo.needClCount || 0}}</span><span class="orange" >条</span>
        </div>
      </div>
      <!-- 随访数量统计 -->
      <div class="sfinfo left">
        <div class="visitedRowLeft">
          <p><i class="iconfont">&#xe682;</i>已随访{{getAdminInfo.hadVisitCount || 0}}人次</p>
          <p><i class="iconfont">&#xe682;</i>共{{getAdminInfo.hadVisitPeopleCount || 0}}位患者</p>
          <!--<p><svg-icon icon-class="peoples" style="color: #17be43;margin-right: 9px;font-size: 17px;" />已随访{{getAdminInfo.hadVisitCount || 0}}人次</p>-->
          <!--<p><svg-icon icon-class="peoples" style="color: #17be43;margin-right: 9px;font-size: 17px;" />共{{getAdminInfo.hadVisitPeopleCount || 0}}位患者</p>-->
          <p>随访计划待审核</p>
          <p class="orange" @click="routerToWay1" style="cursor: pointer;"><em style="font-style: normal">{{getAdminInfo.needShCount || 0}}</em><span class="orange" >条</span></p>
        </div>
        <div class="visitedRowRight">
          <div class="echartTitle">
            <div class="circle"> <div class="yuan"></div></div>
            <div class="circleTitle">随访数量统计</div>
            <div class="circleharts">
              <el-radio-group v-model="selectRadio" @change="radioChange">
                <el-radio :label="1">近7天</el-radio>
                <el-radio :label="2">近30天</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div id="homeEchart1" style="width: 465px;height: 148px;">
          </div>
        </div>
      </div>
    </div>
    <!-- 下部 -->
    <div class="hzxq">
      <!-- 患者分析 -->
      <div class="hzfx fl-left">
        <el-tabs v-model="hzfxTabActive" @tab-click="tabTimeSelect">
          <el-tab-pane label="患者总体情况分析" name="first" disabled>患者总体情况分析</el-tab-pane>
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
              <div class="circleTitle1">疾病分布情况</div>
            </div>
            <div class="sftcontent">
              <div class="echart2 left" id="echart2"></div>
              <div class="echartRight left" style="padding-top: 23px;">
                <ul v-for="(item,index) in diagnoseInfoData" :key="index" v-if="item.percent">
                  <li :style="'background:'+item.itemStyle.normal.color"></li><li>{{item.name}}</li><li>{{item.percent}}%</li><li>{{item.value?item.value:'0'}}人</li>
                </ul>
              </div>
            </div>
          </div>
          <!-- 用药依从性 -->
          <div class="sft2">
            <div class="sftitle">
              <div class="circle1"> <div class="yuan1"></div></div>
              <div class="circleTitle1">用药依从性</div>
            </div>
            <div class="diseEchart">
              <div class="echart2 left" id="echart3">
              </div>
              <div class="echartRight left" style="padding-top: 46px;">
                <ul v-for="(item,index) in yyycData" :key="index">
                  <li :style="'background:'+item.itemStyle.normal.color"></li><li>{{item.name}}</li><li>{{item.value?item.value:'0'}}人</li>
                </ul>
              </div>
              <ul class="echartRight2 left">
                <li>
                  <p>规律</p>
                  <p>{{percent1?percent1:'0'}}%</p>
                </li>
                <li>
                  <p>间断</p>
                  <p>{{percent2?percent2:'0'}}%</p>
                </li>
                <li>
                  <p>不服用</p>
                  <p>{{percent3?percent3:'0'}}%</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!-- 特别关心 -->
      <div class="tbgx fl-right">
        <p>特别关心</p>
        <div class="resultsProgress">
          <el-table :data="SpecialtableData" style="width: 100%" class="homepageTable1" :show-header="false" v-loading="syhz" v-if="SpecialtableData.length">
            <el-table-column label="姓名" prop="patientName" align="left" width="60px"></el-table-column>
            <el-table-column label="本次异常" align="center" width="110px">
              <template slot-scope="scope">
                <el-tag style="background:#fff;font-size:12px;height:20px;line-height:18px;border-radius:10px;">{{scope.row.gzTag}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="性别/年龄" align="center" width="70px">
              <template slot-scope="scope">
                <span>{{scope.row.patientSex}}</span>&nbsp;/&nbsp;<span>{{scope.row.patientAge}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="icdName" label="诊断名称" align="center" width="100px" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="档案" align="center"  width="70px">
              <template slot-scope="scope">
                <el-button type="primary" @click="wayButton(scope)" style="height:23px;line-height:22px;width:45px;padding:0;font-size
                :13px;">档案</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row class="homepagefy" v-if="SpecialtableData.length">
            <el-col :span="24" class="text-right" style="margin-top:10px;">
              <el-pagination  @current-change="homeCurrentPage" :current-page.sync="currentPageHome" :page-size="limit" layout="total,prev, pager, next"
                              :total="totalPagehome">
              </el-pagination>
            </el-col>
          </el-row>
          <!-- 无数据的时候 -->
          <div class="nullData" v-show="sfyd">
            <div class="nullImg">
              <div class="nullImg1">
                <img src="../../../assets/HN_DoctorClient/images/syyd.jpg" alt="">
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
    </div>
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
    <!-- 就诊档案 -->
    <patient-file
      :patient-id="patientId"
      :visit-order-id="visitOrderId"
      :show-record-link="true"
      :task-id="taskId"
      v-on:refreshData="refreshList"
      ref="patientFile"
    ></patient-file>
  </div>
</template>

<script>
  /**
   * 首页
   * @module Homepage
   */
  import { Homepage } from '@/api/HN_DoctorClient/Homepage'
  import echart from "echarts";
  // import "swiper/dist/css/swiper.css";
  // import { swiper, swiperSlide } from "vue-awesome-swiper";
  // import { Point } from "@/common/js/selectOptions";
  import Bus from "@/assets/HN_DoctorClient/js/bus";
  // import { mapGetters } from "vuex";
  import patientFile from 'HNDC/common/patientFile'
  export default {
    data() {
      return {
        userId: "", //医生id
        laterhours: "", //距上次登录
        //医生个人信息
        getAdminInfo: {
          aipicTureUrl: "", //头像url
          realname: "", //医生姓名
          AiName: "", //头像名字
          needClCount: "", //随访结果待处理
          hadVisitCount: "", //已随访
          hadVisitPeopleCount: "", //患者数
          needShCount: "" //随访方案待处理
        },
        //随访数量统计
        selectRadio: 1, //随访数量(7天,30天)
        switchX: [], //x轴
        switchY: [], //y轴
        //绑定头像
        innerVisible: false, //绑定头像
        cwtx: null, //选中的宠物index
        imgList: [], //12生肖头像列表
        //患者总体情况分析
        hzfxTabActive: "1", //患者分析(近7天/30天/半年)
        diagnoseInfoData: [], //疾病分布情况

        yyycData: [], //用药依从性data
        // options: [],

        value: "",
        percent1: null, //规律
        percent2: null, //间断
        percent3: null, //不服用
        totalbt1: null, //随访疾病分类总人数
        totalbt2: null, //用药依从性总人数
        SpecialtableData: [],
        currentPageHome: 1, //分页
        totalPagehome: null, //table总条数
        currenthref: "", //12生肖地址前缀
        // dialogVisible: false, //记录弹框
        // patientInfo: {}, //记录个人信息
        patientId: "", //病人id
        taskId: "", //获取病人的taskId
        // isCare: false, //点击记录后，查看病人是否被关注
        // ypxx: "1", //药品信息
        // selectNumber: "", //选中第几次
        // activeName1: "a0", //指标折线图选中下标
        // activeName2: "1", //随访语音折叠面板
        // tabActive: 0, //当前选中的tab0全部患者1特别关心
        // modelData: [], //患者指标
        // targetTab: [], //指标tab
        // xChart: [],
        // yChart: [],
        // swiperDate: [], //患者就诊档案时间
        // sliderNumber: null, //当前选中的就诊时间
        // zyData: [],
        // mzData: [],
        // loading4: false,
        // isNull: false, //患者的住院门诊为都为视空
        // dialogWay: false, //内层弹框
        // selecOptions: [],
        // selecOptions: [],
        // modelData: [],
        // targetTab: [],
        // isResolveText: "", //判断当前用户是否有处理意见
        // taskId: "",
        // yyHrec: "", //语音地址
        // tabLabel: "",
        // showAnimal: false,
        // loadingHp: true,
        // leaveHospital: "",
        syhz: false, //特别关心loading
        // loadingsfjg: false,
        sfyd: false, // 特别关心 列表无数据
        visitOrderId:'',
        // attrTaskId: "", //门住随访时间的taskId
        // advice1: false, //暂不处理
        // currentName: "", //当前患者姓名
        // btnState: "" //当前处理意见类型
        // currentPage: 1, // 特别关心 第几页
        limit: 8,
      };
    },
    components: {
      // swiper,
      // swiperSlide
      patientFile,
      // followRecord
    },
    mounted: function() {
      this.getUserId();
      this._echarts2();
      this._echarts3();
      this.adminInfo();
      this.diagnoseInfo(1); //疾病分布
      // this.visitOrderInfoInfo(0)//随访结果处理
      this.getUseEatInfo(1); //用药依从性
      this.SpecialCare(1); //特别关心
      this.visitCountInfo(1); //随访数量统计
      console.log(this.userId);
    },
    // computed: {
    //   ...mapGetters(["userID"])
    // },
    methods: {
      /**
       * 刷新当前列表数据--特别关注切换后--子组件调用
       * @function refreshList
       */
      refreshList() {
        // let param_name = `param_${typeMap[this.tabActive]}`;
        // this.getList(this[param_name]);
        this.SpecialCare(this.currentPageHome);
      },
      /**
       * 从sessionStorage获取医生id
       * @function getUserId
       * @param {String} userId 获取医生id
       */
      getUserId() {
        this.userId = sessionStorage.getItem("userId"); //用户名
        this.laterhours = sessionStorage.getItem("laterhours"); //距上次登录
        //如果没有返回时间，则表示空
        if (this.laterhours == "undefined" || this.laterhours == "") {
          this.laterhours = 0;
        }
        let aipictureurl = sessionStorage.getItem("aipictureurl"); //宠物头像
        if (aipictureurl == "") {
          this.innerVisible = true;
          this.findAiPictureList(this.userId); //获取12生肖
        }
      },
      /**
       * 获取十二生肖
       * @function findAiPictureList
       * @param {String} adminId 医生id
       * @param {String} fromsys 医生端
       */
      findAiPictureList(userId) {
        Homepage
          .findAiPictureList({
            adminId: userId,
            fromsys: "web"
          })
          .then(res => {
            //12生肖地址前缀
            var url = location.href;
            var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
            var result = url.match(reg);
            this.currenthref = result[0] + "/";
            res.data.SysConfigLsit.forEach(item => {
              item.value = this.currenthref + item.value;
            });
            this.imgList = res.data.SysConfigLsit;
          })
          .catch(error => {
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
          Homepage
            .bindAiPicture({
              adminId: this.userId,
              aiPictureCode: this.selectKey
            })
            .then(res => {
              if (res.code == "0") {
                this.$message.success(res.message);
                this.adminInfo();
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$message.error("请选择头像!");
        }
      },
      /**
       * 查询首页个人信息
       * @function adminInfo
       * @param {String} adminId 医生id
       */
      adminInfo() {
        Homepage
          .adminInfo({
            adminId: this.userId
          })
          .then(res => {
            if (res.code == 0) {
              //获取当前url
              let url = location.href;
              let reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
              let result = url.match(reg);
              this.currenthref = result[0];
              res.data.aipicTureUrl =
                this.currenthref + "/" + res.data.aipicTureUrl;
              this.getAdminInfo = res.data;
              sessionStorage.setItem("aipictureurl", res.data.aipicTureUrl);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
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
        Homepage
          .diagnoseInfo({
            adminId: this.userId,
            dateType: type
          })
          .then(res => {
            if (res.code == 0) {
              let qq = [
                {
                  color: "#fc8c70"
                },
                {
                  color: "#f9bd48"
                },
                {
                  color: "#fd6388"
                },
                {
                  color: "#69acff"
                },
                {
                  color: "#e9e9e9"
                }
              ];
              let bb = [
                {
                  isTrue: false
                },
                {
                  isTrue: false
                },
                {
                  isTrue: false
                },
                {
                  isTrue: false
                },
                {
                  isTrue: false
                }
              ];
              //loadingsfjg
              let dd = [];
              for (let i = 0; i < qq.length; i++) {
                dd.push(Object.assign(qq[i], bb[i]));
              }

              let tt = [];
              for (let i = 0; i < qq.length; i++) {
                tt.push(Object.assign(dd[i], res.data[i]));
              }

              class Point {
                constructor(item) {
                  this.value = item.value;
                  this.name = item.name;
                  this.icon = "circle";
                  this.percent = item.percent;
                  this.itemStyle = {
                    normal: {
                      color: item.itemStyle.normal.color
                    }
                  };
                  this.selected = item.selected;
                }
              }
              let mm = [];
              tt.forEach(item => {
                mm.push(
                  new Point({
                    value: item.itemCount,
                    name: item.diagnoseName,
                    percent: item.percent,
                    selected: item.isTrue,
                    icon: "circle",
                    itemStyle: {
                      normal: {
                        color: item.color
                      }
                    }
                  })
                );
              });
              //总人数
              if (res.data[0].Count) {
                this.totalbt1 = res.data[0].Count;
              } else {
                this.totalbt1 = null;
              }
              this.diagnoseInfoData = [];
              this.diagnoseInfoData = mm;
              this._echarts2();
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      /**
       * 用药依从性
       * @function getUseEatInfo
       * @param {String} adminId 医生id
       * @param {String} dateType type
       */
      getUseEatInfo(type) {
        Homepage
          .getUseEatInfo({
            adminId: this.userId,
            dateType: type
          })
          .then(res => {
            if (res.code == 0) {
              let qq = [
                {
                  color: "#69acff"
                },
                {
                  color: "#ffbd3d"
                },
                {
                  color: "#fc8c70"
                }
              ];
              let bb = [
                {
                  isTrue: false
                },
                {
                  isTrue: false
                },
                {
                  isTrue: false
                }
              ];

              let dd = [];
              for (let i = 0; i < qq.length; i++) {
                dd.push(Object.assign(qq[i], bb[i]));
              }

              let tt = [];
              for (let i = 0; i < qq.length; i++) {
                tt.push(Object.assign(dd[i], res.data[i]));
              }

              class Point {
                constructor(item) {
                  this.value = item.value;
                  this.name = item.name;
                  this.icon = "circle";
                  this.percent = item.percent;
                  this.itemStyle = {
                    normal: {
                      color: item.itemStyle.normal.color
                    }
                  };
                  this.selected = item.selected;
                }
              }
              let mm = [];
              tt.forEach(item => {
                mm.push(
                  new Point({
                    value: item.itemCount,
                    name: item.diagnoseName,
                    percent: item.percent,
                    selected: item.isTrue,
                    icon: "circle",
                    itemStyle: {
                      normal: {
                        color: item.color
                      }
                    }
                  })
                );
              });
              this.yyycData = [];
              this.yyycData = mm;
              this.percent1 = "";
              this.percent2 = "";
              this.percent3 = "";
              this.yyycData.forEach(item => {
                if (item.name == "规律") {
                  this.percent1 = item.percent;
                }
                if (item.name == "间断") {
                  this.percent2 = item.percent;
                }
                if (item.name == "不服用") {
                  this.percent3 = item.percent;
                }
              });
              if (res.data.length) {
                this.totalbt2 = res.data[0].Count;
              } else {
                this.totalbt2 = null;
              }

              this._echarts3();
            } else {
              //this.$message.error(res.message);
            }
          })
          .catch(error => {
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
        Homepage
          .visitCountInfo({
            adminId: this.userId,
            dateType: value
          })
          .then(res => {
            if (res.code == 0) {
              this.switchX = [];
              this.switchY = [];
              res.data.forEach(item => {
                let a = item.diagnoseName.slice(0, 4);
                let b = item.diagnoseName.slice(4, 6);
                let c = item.diagnoseName.slice(6, 8);
                item.diagnoseName = a + "-" + b + "-" + c;
                this.switchX.push(item.diagnoseName);
                this.switchY.push(item.itemCount);
              });
              this._echarts1();
            } else {
              // this.$message.error(res.message)
            }
          })
          .catch(error => {
            console.log(error);
          });
      },

      /*
      *分页
      */
      homeCurrentPage(val) {
        this.currentPageHome = val;
        this.SpecialCare(val);
      },
      /*
      *跳转随访结果
      */

      routerToWay() {
        // this.$router.push({ path: "/FollowRecord" });
        // Bus.$emit("activeIndex", "/FollowRecord");
        this.$router.push({ path: '/FollowRecordHN/FollowRecordListHN' });
      },
      /*
      *跳转随访计划
      */
      routerToWay1() {
        // this.$router.push({ path: "/FollowParam" });
        // Bus.$emit("activeIndex1", "/FollowParam");
        this.$router.push({ path: '/FollowPlanHN/FollowPlanListHN' });
      },
      /*
      *跳转随访计划
      */
      toHz() {
        // this.$router.push({ path: "/PatientList" });
        // Bus.$emit("activeIndex2", "/PatientList");
        this.$router.push({ path: '/PatientHN/PatientListHN' });
      },

      /*
      *特别关心
      */
      SpecialCare(page) {
        this.syhz = true;
        this.sfyd = false;
        Homepage
          .list({
            adminId: this.userId,
            gz: 1,
            limit: this.limit,
            pager: page
          })
          .then(res => {
            this.syhz = false;
            if (res.code == 0) {
              this.SpecialtableData = res.data;
              this.totalPagehome = res.count;
              if (res.data.length < 1) {
                this.sfyd = true;
                // 取消 关注后，刷新，如果当前页数据为空，请求前一页？？
                if (this.currentPageHome>1) {
                  this.SpecialCare(this.currentPageHome - 1)
                  this.currentPageHome = this.currentPageHome - 1;
                }
              }
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.syhz = false;
          });
      },
      /*****************弹框***********************/

      /*
        *获取记录信息  档案 按钮
        */
      wayButton(scope) {
        this.patientId = scope.row.hzxxId;
        this.taskId = scope.row.taskId;
        this.visitOrderId = scope.row.id;
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        },0);
      },
      /*
      *echart2(疾病分布情况)
      */

      _echarts2() {
        let _this = this;
        this.echarts2 = echart.init(document.getElementById("echart2"));
        let data1 = this.diagnoseInfoData;
        this.echarts2.setOption({
          tooltip: {
            show: false,
            position: "center",
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          grid: {
            top: "5%",
            left: "1%",
            right: "5%",
            bottom: "5%",
            containLabel: true
          },
          series: [
            {
              name: "疾病分布情况",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: true,
                  position: "center",
                  formatter: function() {
                    return _this.totalbt1;
                  },
                  textStyle: {
                    fontSize: "14",
                    color: "gray"
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold"
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

        /* console.log(
          this.echarts2.getDataURL({
            pixelRatio: 2,
            backgroundColor: "#fff"
          })
        ); */
      },
      /*
      *echart3(用药依从性)
      */

      _echarts3() {
        this.echarts3 = echart.init(document.getElementById("echart3"));
        let _this = this;
        let data4 = this.yyycData;
        this.echarts3.setOption({
          tooltip: {
            show: false,
            align: "left",
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          series: [
            {
              name: "用药依从性",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              hoverAnimation: false,
              silent: true,
              label: {
                normal: {
                  show: true,
                  position: "center",
                  formatter: function() {
                    return _this.totalbt2;
                  },
                  textStyle: {
                    fontSize: "14",
                    color: "gray"
                  }
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "12",
                    fontWeight: "bold"
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
        this.echarts1 = echart.init(document.getElementById("homeEchart1"));
        this.echarts1.setOption({
          backgroundColor: "#fff",
          tooltip: {
            trigger: "item",
            axisPointer: {
              type: "shadow",
              label: {
                show: true,
                backgroundColor: "#333"
              }
            },
            formatter: function(params) {
              return params.seriesName + ":" + params.value;
            },
            textStyle: {
              align: "right"
            }
          },
          grid: {
            top: "10%",
            left: "1%",
            right: "10%",
            bottom: "10%",
            containLabel: true
          },
          xAxis: {
            data: this.switchX,
            axisLine: {
              lineStyle: {
                color: "#a1a1a1"
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
                color: "#a1a1a1"
              }
            }
          },
          series: [
            {
              name: "随访人数",
              type: "line",
              smooth: true,
              showAllSymbol: true,
              symbol: "circle",
              symbolSize: 4,
              // color: '#0f0',
              itemStyle: {
                normal: {
                  color: "#07d5d8" //图标颜色
                }
              },
              data: this.switchY,
              lineStyle: {
                normal: {
                  width: 1,
                  color: "rgba(8,213,216,.5)"
                }
              }
            },
            {
              name: "随访人数",
              type: "bar",
              barWidth: 6,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: new echart.graphic.LinearGradient(0, 0, 0.5, 1, [
                    { offset: 0, color: "#8283da" },
                    { offset: 0.5, color: "#47aad9" },
                    { offset: 1, color: "#07d5d8" }
                  ])
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

  /*@import "../../../assets/HN_DoctorClient/style/mixin";*/
  @import "../../../assets/HN_DoctorClient/style/reset";
  /*@import "../../../assets/HN_DoctorClient/style/base";*/

  .homecontainer {
    width: 1132px;
    height: 616px;
    padding: 20px;
    overflow: hidden;
    font-size: 14px;
    /*div{*/
      /*display: inline-block;*/
    /*}*/
    ul,
    li{
      list-style: none;
      padding: 0;
      margin: 0;
    }
    p{
      margin: 0;
    }
    .left{
      float: left;
    }
    /*************模块1**************/
    .homeinfo {
      width: 100%;
      height: 178px;
      padding-top: 5px;
      /*************左上**************/
      .doctorinfo {
        width: 457px;
        height: 100%;
        .sfanimal {
          width: 100%;
          height: 85px;

          .sfanimalPic {
            width: 85px;
            height: 85px;
            float: left;
            img {
              margin: 3px 0 0 14px;
               /*<!--@extend .full-size;-->*/
              width: 100%;
              height: 100%;
            }
          }
          .sfWords {
            float: right;
            width: 354px;
            height: 83px;
            padding: 17px 0 0 30px;
            margin-top: 2px;
            font-size: 14px;
            background: url("../../../assets/HN_DoctorClient/images/word.png") no-repeat center;
            .sfWordsp1,
            .sfWordsp2 {
              line-height: 26px;
              margin: 0;
            }
            .sfWordsp1 {
              color: #69acff;
            }
            .sfWordsp2 {
              color: #5d5d5d;
            }
          }
        }
        .sfresult {
          .cwname {
            line-height: 26px;
            font-style: 14px;
            color: #919191;
            margin-left: 43px;
          }
        }
      }
      /*************右上**************/
      .sfinfo {
        width: 634px;
        height: 100%;
        padding-left: 27px;
        // 左侧随访人数
        .visitedRowLeft {
          width: 140px;
          height: 173px;
          color: #666;
          float: left;
          p:nth-of-type(1),
          p:nth-of-type(2) {
            line-height: 25px;
            font-size: 13px;
            text-align: left;
            margin-bottom: 5px;
            i {
              margin-right: 9px;
              color: #17be43;
            }
          }
          p:nth-of-type(3) {
            color: #666;
            line-height: 52px;
            font-size: 14px;
            text-align: left;
            margin-top: 9px;
          }
          p:nth-of-type(4) {
            color: #666;
            line-height: 21px;
            font-size: 14px;
            text-align: left;
            em {
              line-height: 21px;
              font-size: 21px;
              color: #ff6e40;
              border-bottom: 2px solid #ff6e40;
              margin-right: 10px;
            }
          }
        }
        //右侧表格
        .visitedRowRight {
          float: left;
          width: 465px;
          height: 173px;
          .echartTitle {
            height: 26px;
            .circle {
              float: left;
              width: 24px;
              height: 26px;
              .yuan {
                margin: 9px 0 0 3px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #fd8567;
              }
            }
            .circleTitle {
              float: left;
              width: 100px;
              line-height: 26px;
              color: #989898;
            }
            // 下拉框
            .circleharts {
              float: right;
              margin-right: 22px;
              height: 26px;
              .el-select {
                .el-input {
                  .el-input__inner {
                    height: 26px;
                    width: 104px;
                    padding-left: 16px;
                    border-radius: 14px;
                    font-size: 12px;
                  }
                }
              }
            }
          }
          //echart1
          #homeEchart1 {
          }
        }
      }
    }
  }
  //分页
  .resultsProgress .homepagefy {
    .el-col {
      height: 18px;
      .el-pagination {
        padding: 0;
        .el-pagination__total {
          height: 18px;
          line-height: 18px;
        }
        button {
          height: 18px;
          line-height: 18px;
        }
        .el-pager li {
          height: 18px;
          line-height: 18px;
          font-weight: 100;
          min-width: 24px;
          color: #333;
        }
        .el-pager li.active{
          color: #409EFF;
        }
      }
    }
  }
  //引导图片
  .nullData {
    .nullImg {
      width: 100%;
      height: 200px;
      margin-top: 38px;
      .nullImg1 {
        margin-left: 20px;
        width: 200px;
        height: 200px;
        float: left;
      }
      .nullWords {
        margin-left: 63px;
        float: left;
        .p1 {
          width: 10px;
          height: 4px;
          background: #69acff;
          margin: 112px 0 5px;
        }
        .p2 {
          width: 111px;
          line-height: 23px;
          font-size: 13px;
        }
      }
    }
    //引导按钮去患者列表
    .nullBtn {
      margin-top: 67px;
      width: 100%;
      text-align: center;
      .el-button {
        padding: 9px 20px;
      }
    }
  }

  /*************患者详情**************/
  .hzxq {
    width: 1091px;
    height: 360px;
    /****患者总体情况分析*****/
    .hzfx {
      padding: 0 21px 0 6px;
      width: 641px;
      height: 386px;
      border-right: 1px solid #e7e7e7;
      .el-tabs {
        .el-tabs__header {
          margin: 0;
          .el-tabs__nav-wrap .el-tabs__nav-scroll {
            .el-tabs__nav {
              width: 100%;
              .el-tabs__active-bar {
                left: 128px;
              }
              .el-tabs__item {
                padding: 0 12px;
                height: 34px;
                line-height: 34px;
              }
              .el-tabs__item:nth-of-type(2) {
                padding: 0;
                float: left;
                margin-right: 128px;
                font-size: 17px;
                color: #333;
              }
            }
          }
        }
        .el-tabs__content {
        }
      }
    }
    /****患者分析*****/
    .sft {
      width: 615px;
      height: 327px;
      margin-top: 25px;
      //疾病分布
      .sft1 {
        width: 615px;
        height: 169px;
        //标题
        .sftitle {
          height: 14px;
          line-height: 14px;
          .circle1 {
            width: 18px;
            height: 14px;
            float: left;
            .yuan1 {
              width: 6px;
              height: 6px;
              background: #fd8567;
              border-radius: 50%;
              margin: 4px 0 0 4px;
            }
          }
          .circleTitle1 {
            float: left;
            width: 141px;
            text-align: left;
            font-size: 14px;
            line-height: 14px;
            color: #666;
          }
        }
        //饼图
        .sftcontent {
          width: 615px;
          height: 155px;
          .echart2 {
            width: 168px;
            height: 155px;
          }
          .echartRight {
            width: 447px;
            height: 155px;
            ul {
              width: 447px;
              height: 22px;
              li {
                float: left;
                text-align: left;
                line-height: 22px;
                font-size: 13px;
                color: #333;
              }
              li:nth-of-type(1) {
                margin: 6px 14px 0 0;
                width: 9px;
                height: 9px;
                border-radius: 100%;
              }
              li:nth-of-type(2) {
                width: 204px;
                height: 22px;
              }
              li:nth-of-type(3) {
                text-align: left;
                width: 140px;
                height: 22px;
              }
              li:nth-of-type(4) {
                text-align: left;
                width: 75px;
                height: 22px;
              }
            }
          }
        }
      }
      //用药依从性
      .sft2 {
        width: 615px;
        height: 158px;
        .sftitle {
          height: 14px;
          line-height: 14px;
          .circle1 {
            width: 18px;
            height: 14px;
            float: left;
            .yuan1 {
              width: 6px;
              height: 6px;
              background: #fd8567;
              border-radius: 50%;
              margin: 4px 0 0 4px;
            }
          }
          .circleTitle1 {
            float: left;
            width: 141px;
            text-align: left;
            font-size: 14px;
            line-height: 14px;
            color: #666;
          }
        }
        .diseEchart {
          width: 100%;
          height: 158px;
          .echart2 {
            width: 168px;
            height: 158px;
          }
          .echartRight {
            width: 131px;
            height: 158px;
            padding-top: 34px;
            ul {
              width: 118px;
              height: 22px;
              li {
                float: left;
                text-align: left;
                line-height: 22px;
                font-size: 13px;
                color: #333;
              }
              li:nth-of-type(1) {
                margin: 6px 14px 0 0;
                width: 9px;
                height: 9px;
                border-radius: 100%;
              }
              li:nth-of-type(2) {
                width: 54px;
                height: 22px;
              }
            }
          }
          .echartRight2 {
            width: 316px;
            height: 158px;
            padding: 28px 0 50px 0;
            margin-top: 13px;
            li {
              width: 100px;
              height: 79px;
              float: left;
              margin-left: 4px;
              border-radius: 3px;
              padding: 5px 0 0 3px;
              text-align: center;
              p:nth-of-type(1) {
                line-height: 28px;
                font-size: 13px;
                color: #424242;
              }
              p:nth-of-type(2) {
                line-height: 43px;
                font-size: 17px;
              }
            }
            li:nth-of-type(1) {
              border: 1px solid #66b1ff;
              background: #f3faff;
              p:nth-of-type(2) {
                color: #75b2ff;
                border-top: 1px solid #cae7ff;
              }
            }
            li:nth-of-type(2) {
              border: 1px solid #ffe2b7;
              background: #fffbf5;
              p:nth-of-type(2) {
                color: #ff8a00;
                border-top: 1px solid #ffe0c9;
              }
            }
            li:nth-of-type(3) {
              border: 1px solid #ffe1e7;
              background: #fffafb;
              p:nth-of-type(2) {
                color: #ff003d;
                border-top: 1px solid #ffcdd5;
              }
            }
          }
        }
      }
    }
    /****特别关心*****/
    .tbgx {
      width: 449px;
      height: 386px;
      padding: 0 10px 0 26px;
      //标题
      p {
        line-height: 26px;
        font-size: 17px;
        color: #333;
        text-align: left;
        margin-bottom: 12px;
      }
      //表格
      .resultsProgress .homepageTable1 {
        &:before {
          height: 0;
        }
        .el-table__header-wrapper {
        }
        .el-table__body-wrapper {
          .el-table__body tbody {
            .el-table__row {
              td {
                padding: 7px 0;
                border: 0;
                color: #333;
                .cell {
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .colorShow {
    color: #9bd542 !important;
  }
  /**
     * 12生肖model
     */
  .bdzoo {
    padding: 0 37px 33px 37px;
    .el-dialog__body {
      padding: 0;
      .stepTwo {
        width: 449px;
        height: 29px;
        //font-size: 20px;
        text-align: center;
        line-height: 29px;
      }
      /*生肖div*/
      .zooSelect {
        margin-top: 20px;
        width: 449px;
        height: 186px;
        overflow: hidden;
        .zooIcon {
          width: 468px;
          height: 186px;
          // background-color:#f7f7f7;
          li {
            float: left;
            .imgzoo {
              width: 55px;
              height: 89px;
              margin-right: 23px;

              img {
                width: 55px;
                height: 55px;
                border-radius: 50%;
                border: 0;
                display: block;
              }
              i {
                color: transparent;
                right: 0;
                bottom: 38px;
                font-size: 18px;
              }
              p {
                line-height: 13px;
                margin: 6px 0 14px 0;
                text-align: center;
                font-size: 13px;
                color: #949494;
              }
            }
          }
        }
      }
      .stepfinish {
        width: 449px;
        height: 44px;
        text-align: center;
        background: url("../../../assets/HN_DoctorClient/images/aibg.png") center center no-repeat;
        .nextBtn {
          margin-top: 12px;
        }
      }
    }
  }
</style>
