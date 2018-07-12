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
  import { Homepage } from '@/api/HN_DoctorClient/Homepage';
  import { CommonAPI } from '@/api/HN_DoctorClient/common';
  import echart from 'echarts';
  import patientFile from 'HNDC/common/patientFile';

  import { setParameter } from '@/utils/auth';
  export default {
    data() {
      return {
        userId: '', // 医生id
        laterhours: '', // 距上次登录
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
        yyycData: [], // 用药依从性data
        value: '',
        percent1: null, // 规律
        percent2: null, // 间断
        percent3: null, // 不服用
        totalbt1: null, // 随访疾病分类总人数
        totalbt2: null, // 用药依从性总人数
        SpecialtableData: [],
        currentPageHome: 1, // 分页
        totalPagehome: null, // table总条数
        currenthref: '', // 12生肖地址前缀
        patientId: '', // 病人id
        taskId: '', // 获取病人的taskId
        syhz: false, // 特别关心loading
        sfyd: false, // 特别关心 列表无数据
        visitOrderId: '',
        limit: 8
      };
    },
    components: {
      patientFile
    },
    mounted: function() {
      this.getUserId();
      this._echarts2();
      this._echarts3();
      this.adminInfo();
      this.diagnoseInfo(1); // 疾病分布
      // this.visitOrderInfoInfo(0)//随访结果处理
      this.getUseEatInfo(1); // 用药依从性
      this.SpecialCare(1); // 特别关心
      this.visitCountInfo(1); // 随访数量统计
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
        this.SpecialCare(this.currentPageHome);
      },
      /**
       * 从sessionStorage获取医生id
       * @function getUserId
       * @param {String} userId 获取医生id
       */
      getUserId() {
        this.userId = this.$store.state.user.token; // 用户名
        // this.laterhours = sessionStorage.getItem('laterhours'); // 距上次登录
        this.laterhours = this.$store.state.user.laterhours;
        // 如果没有返回时间，则表示空
        if (this.laterhours === 'undefined' || this.laterhours === '') {
          this.laterhours = 0;
        }
        // const aipictureurl = sessionStorage.getItem('aipictureurl'); // 宠物头像
        const aipictureurl = this.$store.state.user.avatar;
        if (aipictureurl === '') {
          this.innerVisible = true;
          this.findAiPictureList(this.userId); // 获取12生肖
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
            fromsys: 'web'
          })
          .then(res => {
            // 12生肖地址前缀
            var url = location.href;
            var reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
            var result = url.match(reg);
            this.currenthref = result[0] + '/';
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
              if (res.code === 0) {
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
          this.$message.error('请选择头像!');
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
            if (res.code === 0) {
              // 获取当前url
              const url = location.href;
              const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/);
              const result = url.match(reg);
              this.currenthref = result[0];
              res.data.aipicTureUrl =
                this.currenthref + '/' + res.data.aipicTureUrl;
              this.getAdminInfo = res.data;
              // sessionStorage.setItem('aipictureurl', res.data.aipicTureUrl);
              this.$store.commit('SET_AVATAR', res.data.aipicTureUrl);
              setParameter('avatar', res.data.aipicTureUrl);
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
            if (res.code === 0) {
              const qq = [
                {
                  color: '#fc8c70'
                },
                {
                  color: '#f9bd48'
                },
                {
                  color: '#fd6388'
                },
                {
                  color: '#69acff'
                },
                {
                  color: '#e9e9e9'
                }
              ];
              const bb = [
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
              // loadingsfjg
              const dd = [];
              for (let i = 0; i < qq.length; i++) {
                dd.push(Object.assign(qq[i], bb[i]));
              }

              const tt = [];
              for (let i = 0; i < qq.length; i++) {
                tt.push(Object.assign(dd[i], res.data[i]));
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
              tt.forEach(item => {
                mm.push(
                  new Point({
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
                  })
                );
              });
              // 总人数
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
            if (res.code === 0) {
              const qq = [
                {
                  color: '#69acff'
                },
                {
                  color: '#ffbd3d'
                },
                {
                  color: '#fc8c70'
                }
              ];
              const bb = [
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

              const dd = [];
              for (let i = 0; i < qq.length; i++) {
                dd.push(Object.assign(qq[i], bb[i]));
              }

              const tt = [];
              for (let i = 0; i < qq.length; i++) {
                tt.push(Object.assign(dd[i], res.data[i]));
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
              tt.forEach(item => {
                mm.push(
                  new Point({
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
                  })
                );
              });
              this.yyycData = [];
              this.yyycData = mm;
              this.percent1 = '';
              this.percent2 = '';
              this.percent3 = '';
              this.yyycData.forEach(item => {
                if (item.name === '规律') {
                  this.percent1 = item.percent;
                }
                if (item.name === '间断') {
                  this.percent2 = item.percent;
                }
                if (item.name === '不服用') {
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
              // this.$message.error(res.message);
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
            if (res.code === 0) {
              this.switchX = [];
              this.switchY = [];
              res.data.forEach(item => {
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
        this.$router.push({ path: '/FollowRecord/FollowRecordList' });
      },
      /*
      *跳转随访计划
      */
      routerToWay1() {
        // this.$router.push({ path: "/FollowParam" });
        // Bus.$emit("activeIndex1", "/FollowParam");
        this.$router.push({ path: '/FollowPlan/FollowPlanList' });
      },
      /*
      *跳转随访计划
      */
      toHz() {
        // this.$router.push({ path: "/PatientList" });
        // Bus.$emit("activeIndex2", "/PatientList");
        this.$router.push({ path: '/Patient/PatientList' });
      },

      /*
      *特别关心
      */
      SpecialCare(page) {
        this.syhz = true;
        this.sfyd = false;
        CommonAPI
          .patientList({
            adminId: this.userId,
            gz: 1,
            limit: this.limit,
            pager: page
          })
          .then(res => {
            this.syhz = false;
            if (res.code === 0) {
              this.SpecialtableData = res.data;
              this.totalPagehome = res.count;
              if (res.data.length < 1) {
                this.sfyd = true;
                // 取消 关注后，刷新，如果当前页数据为空，请求前一页？？
                if (this.currentPageHome > 1) {
                  this.SpecialCare(this.currentPageHome - 1);
                  this.currentPageHome = this.currentPageHome - 1;
                }
              }
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            console.log(error);
            this.syhz = false;
          });
      },
      /** ***************弹框***********************/

      /*
        *获取记录信息  档案 按钮
        */
      wayButton(scope) {
        this.patientId = scope.row.hzxxId;
        this.taskId = scope.row.taskId;
        this.visitOrderId = scope.row.id;
        setTimeout(() => {
          this.$refs.patientFile.toggleShowModal();
        }, 0);
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
              name: '疾病分布情况',
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
              // color: '#0f0',
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
                  color: new echart.graphic.LinearGradient(0, 0, 0.5, 1, [
                    { offset: 0, color: '#8283da' },
                    { offset: 0.5, color: '#47aad9' },
                    { offset: 1, color: '#07d5d8' }
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

