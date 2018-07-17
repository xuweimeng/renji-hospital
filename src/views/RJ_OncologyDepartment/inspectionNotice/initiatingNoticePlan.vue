<template>
  <div class="dischargeFollowupResults">
    <!-- 查询 -->
    <el-row class="common-search">
			<el-form :inline="true" :model="searchParams" label-position="center" label-width="80px">
			  <el-col :span="4">
			  	<el-form-item label="姓名">
				    <el-input v-model="searchParams.name" placeholder="请输入患者姓名" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="4">
			  	<el-form-item label="联系电话">
				    <el-input v-model="searchParams.mobile" placeholder="请输入患者联系电话" clearable></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span="4">
			  	<el-form-item label="检查项目">
				    <el-select v-model="searchParams.icdCheckItem" clearable  placeholder="请选择">
				      <el-option
                v-for="item in ProjectList"
                :key="item.icd10"
                :label="item.jbmc"
                :value="item.icd10">
               </el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span="9">
          <el-form-item label="检查时间" class="formTime">
            <el-date-picker
              v-model="startTime"
              @change="timeChange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
			  </el-col>
			  <el-col :span="3">
			  	<el-button type="primary" @click="getData">查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
    <!-- 表格 -->
		<el-row class="common-table">
			<el-col :span="24">
				<el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="检查通知列表" name="first">
			    	<el-table
              border :data="tableData"
              @selection-change="selectChange"
              v-loading="loading1"
              style="width: 100%;"
              ref="multipleTable">
			    		<el-table-column type="selection" align="center"></el-table-column>
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="性别/年龄" align="center">
                <template slot-scope="scope">
                  {{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop="icdName" label="检查项目" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="orderTime" label="检查时间" align="center"></el-table-column>
              <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
			    		<el-table-column label="操作" align="center" width="180">
			    			<template slot-scope="scope">
                  <el-button type="primary" @click="showInfo(scope.row)" size="mini">详情</el-button>
                  <el-button type="danger" @click="passoutBtn(scope.row.id)" size="mini">终止</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
			    	<el-row v-if="tableData">
              <!-- 批量通过 -->
              <el-col :span="12">
                <div class="checkPiliang" v-if="totalPage">
                  <el-button type="primary" @click="numCheck">批量终止</el-button>
                </div>
              </el-col>
              <!-- 分页 -->
              <el-col :span="12">
                <div class="block" style="margin-top: 11px;">
                  <el-pagination  @current-change="handleCurrentChange" :current-page.sync="nowpager" :page-size="10" layout="total,prev, pager, next, jumper"
                    :total="totalPage" v-if="totalPage">
                  </el-pagination>
                </div>
              </el-col>
            </el-row>
			    </el-tab-pane>
			    <el-tab-pane label="已终止通知" name="second">
						<el-table border :data="noPassdata" style="width: 100%;" v-loading="loading2" class="noPassdataTable">
			    		<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			    		<el-table-column prop="mobile" label="联系电话" align="center" width="190" show-overflow-tooltip></el-table-column>
			    		<el-table-column label="性别/年龄" align="center">
                <template slot-scope="scope">
                  {{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
                </template>
              </el-table-column>
			    		<el-table-column prop="icdName" label="检查项目" align="center" show-overflow-tooltip></el-table-column>
			    		<el-table-column prop="orderTime" label="检查时间" align="center"></el-table-column>
              <el-table-column prop="visitStartTime" label="通知开始时间" align="center"></el-table-column>
			    		<el-table-column label="操作" align="center">
			    			<template slot-scope="scope">
                  <el-button
                  type="primary"
                  @click="showInfo(scope.row)"
                  size="mini">详情</el-button>
                </template>
			    		</el-table-column>
			    	</el-table>
			    	<el-row v-if="noPassdata.length">
              <!-- 分页 -->
              <el-col :span="18">
                <div class="block" style="margin-top: 11px; float:right;">
                  <el-pagination  @current-change="pageChange" :current-page.sync="nopager" :page-size="10" layout="total,prev, pager, next, jumper"
                    :total="noTotalPage">
                  </el-pagination>
                </div>
              </el-col>
            </el-row>
					</el-tab-pane>
			  </el-tabs>
			</el-col>
		</el-row>
		<!-- 审核不通过 -->
		<el-dialog title="终止原因"
      :visible.sync="noCheck"
      width="450px"
      :before-close = "dgFailBtn"
      :center = "false"
      custom-class="checknoPass">
			<el-row slot>
				 <el-col :span="24" >
					<el-select v-model="selectCheck" placeholder="请选择终止原因" popper-class="selectOut" style="width: 350px;">
						<el-option  v-for="item in checkoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-col>
        <el-col :span="24">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            placeholder="请输入详情(必填)"
            v-model="notPassRemark"
            :style="{'width':'350px','marginTop': '20px'}">
          </el-input>
        </el-col>
				<el-col
					:span="24"
					class="btnCheck"
					style="margin-top:28px;">
					<el-button type="primary" @click="dgPassBtn" style="margin-right: 30px;">确定</el-button>
					<el-button type="info" @click="dgFailBtn">取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
    <!-- 检查详情 -->
		<!-- 步骤一已预约检查 -->
    <!-- <checked-list
      :infoShow2="infoShow"
      :checkListData="gridData"
      @closeDialog="closeList">
    </checked-list> -->
  </div>
</template>
<script>
import { InspectionNotice } from 'RJZL_API/InitiateNotification';
import { commonUrl } from 'RJZL_API/commonUrl';
// import CheckedList from './checkedList/checkedList';
export default {
  name: 'dischargeFollowupResults',
  data() {
    return {
      searchParams: {
        pager: 1, //当前页码
        limit: 10, //每页条数
        name: "", //患者姓名（可选）
        mobile: '', //；联系方式（可选）
        icdCheckItem: "", //随访方案（可选）
        startOrderTime: '', //检查开始时间
        endOrderTime: '', //检查结束时间
        status: '' //0表示正常状态   4表示已终止
      },
      startTime: "",
			noTotalPage:0,
      totalPage: 0, // 总页数
      activeName: "first", // tab
			tableData: [],
      noPassdata:[],
      nowpager: 1, // 当前页
      nopager: 1, // 当前页
      checkoptions: [
        {
          value: "",
          label: "请选择"
        },
        {
          //审核不通过options
          value: "1",
          label: "患者已死亡"
        },
        {
          value: "2",
          label: "患者不接受随访"
        },
        {
          value: "3",
          label: "随访方案重复"
        },
        {
          value: "4",
          label: "方案不匹配"
        }
      ],
      infoShow: false /* 通知计划详情显示 */,
      selectCheck: "", //选中的审核不通过
      notPassRemark: '', //不通过详情
      checkId: [], //随访通过的id(多选时),
      checkString: '', //多选字符串
      noCheck: false, //审核不通过弹框
      loading1: false,
      loading2: false,
      planDg: false, // 详情弹窗
      tabIndex: '0', // tab 0:入院通知，1：已终止通知
      gridData: [], //检查详情
      ProjectList: [], // 检查项目
    }
  },
  components: {
    // CheckedList
  },
  mounted() {
    this.getProjectList()
    this.getData();
  },
  methods: {
    /* 获取数据 */
    getData() {
      if (this.tabIndex === '0') {
        this.nowpager = 1
        this.getData1()
      } else {
        this.nopager = 1
        this.getData2()
      }
    },
    getData1 () {
      this.loading1 = true
      this.searchParams.pager=this.nowpager
      this.searchParams.status = '0'
      InspectionNotice.queryCheckTask(this.searchParams)
        .then(res => {
          this.tableData = res.data
          this.loading1 = false
          if(this.nowpager === 1) {
            this.totalPage = res.count;
          }
			});
    },
    getData2 () {
      this.loading2 = true
      this.searchParams.pager=this.nopager
      this.searchParams.status = '4'
      InspectionNotice.queryCheckTask(this.searchParams).then(res => {
        this.noPassdata = res.data
        this.loading2 = false
        if(this.nowpager === 1) {
          this.noTotalPage = res.count;
        }
      });
    },
    /** 获取检查项目列表 */
    getProjectList () {
      commonUrl.getdiseasefix({
        diseasetype: '2'
      }).then(res => {
        this.ProjectList = res.data;
      });
    },
    /** 创建时间更改 */
    timeChange(time) {
      if (time) {
        this.searchParams.startOrderTime = time[0];
        this.searchParams.endOrderTime = time[1];
      } else {
        this.searchParams.startOrderTime = '';
        this.searchParams.endOrderTime = '';
      }
    },
    /* 展示随访计划详情 */
    showInfo(rows) {
      this.infoShow = true
      this.getDetails(rows)
    },
    /**
     * 关闭已预约的弹框
     */
    closeList (value) {
      this.infoShow = value
    },
    /**
     * 获取详情数据
     */
    getDetails (rows) {
      InspectionNotice
        .queryCheckDetail({
          hzxxId: rows.hzxxId,
          orderTime: rows.orderTime,
        })
        .then(res => {
          if (res.code == 0) {
            this.gridData = res.data
          }else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {});
    },
    /** 审核多选的id集合 */
    selectChange(selection){
      this.checkId.length = 0
      selection.forEach( item => {
        this.checkId.push(item.id)
      })
    },
    /** 弹框点击不通过确定 */
    dgPassBtn() {
      if(!this.selectCheck) {
        this.$message.error('请选择终止原因!')
      } else if(!this.notPassRemark) {
        this.$message.error('请填写详情!')
      } else {
        this.checkString = this.checkId.join(',')
        this.handleCheck(this.checkString, this.selectCheck, this.notPassRemark);
      }
    },
    /** 终止原因--取消 */
    dgFailBtn () {
      this.noCheck = false;
      this.selectCheck = ''
      this.notPassRemark = ''
    },
    /**
     *审核功能
     *@function handleCheck
     *@description 审核功能均调用这一个函数
     *@param {String} ids 患者id集合,数组转字符串
     *@param {String} noPassReason 审核不通过原因
     */
    handleCheck( ids, notPassReason, notPassRemark) {
      InspectionNotice
        .stopCheckTask({
          adminId: sessionStorage.getItem('userId'),
          ids: ids,
          notPassReason: notPassReason,
          notPassRemark: notPassRemark
        })
        .then(res => {
          if (res.code == 0) {
            this.getData();
            this.noCheck = false;
            this.selectCheck = ''
            this.notPassRemark = ''
          }else {
            this.$message.error(res.message)
          }
        })
        .catch(error => {});
    },
    /** 切换tab */
    handleClick(tab, event) {
      this.tabIndex = tab.index
      if (this.tabIndex === '0') {
        this.getData1()
      } else {
        this.getData2()
      }
    },
    /**
     * 分页
     * @function handleCurrentChange
     * @param {String} val 当前页码
     * @description this.tabActive = 0//全部患者=1特别关心
     */
    handleCurrentChange(page) {
      this.nowpager = page;
      this.getData1();
		},
		pageChange(page) {
      this.nopager = page;
      this.getData2();
    },
    /** 批量终止 */
    numCheck() {
      if(this.checkId.length==0){
        this.$message.error('患者不能为空！')
        return false;
      }
      this.noCheck = true;
    },
    /** 表格终止按钮 */
    passoutBtn(id) {
      this.noCheck = true;
      this.checkId.push(id)
    }
  }
};
</script>
<style lang="scss">
  @import '~styles/search';
  .dischargeFollowupResults {
  }
</style>