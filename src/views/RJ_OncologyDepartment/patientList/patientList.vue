<template>
	<div class="app-container" >
    <!-- 增加患者、完善信息 -->
		<ul class="common_search">
      <li class="common_search_single">
        <label class="radio-label" >姓名</label>
        <el-input v-model.trim="formInline.name" clearable placeholder="请输入姓名"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >联系电话</label>
        <el-input v-model.trim="formInline.mobile" clearable placeholder="请输入联系电话"></el-input>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >疾病名称</label>
				<el-select
					v-model="formInline.icdName"
					filterable
					remote
					clearable
					placeholder="请输入关键词"
					:remote-method="remoteMethod"
					:loading="queryLoading"
					size="medium" >
					<el-option
						v-for="(item, index) in options4"
						:key="index"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >性别</label>
        <el-select v-model="formInline.sex" placeholder="请选择" >
          <el-option label="全部" value=""></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </li>
      <li class="common_search_single">
        <label class="radio-label" >标签</label>
        <el-select v-model="formInline.isdeath" placeholder="请选择" >
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="0"></el-option>
          <el-option label="死亡" value="1"></el-option>
        </el-select>
      </li>
			<li class="common_search_single">
        <label class="radio-label" >年龄</label>
				<el-input v-model="formInline.startAge" placeholder="0" size="medium"  clearable></el-input>
				-
				<el-input v-model="formInline.endAge" size="medium" clearable></el-input>
      </li>
      <li class="common_search_single common_search_single_longBtn">
        <el-button  @click="searchBtn" type="primary" icon="el-icon-search" >查询</el-button>

        <el-button type="primary" size="medium" @click="addListBtn">添加患者</el-button>
				<router-link :to="`/UploadHz`" style="margin-left:10px">
					<el-button type="success" size="medium">批量添加</el-button>
				</router-link>
				<router-link :to="`/HalfInfo`" style="margin-left:10px">
					<el-button type="info" size="medium">未完善信息<span v-if="errorNumber > 0">({{errorNumber}})</span></el-button>
				</router-link>
      </li>
    </ul>
		<!-- 表格 -->
		<el-table border fit highlight-current-row  :data="tableData" v-loading="loading">
			<el-table-column prop="brxm" label="姓名" align="center"></el-table-column>
			<el-table-column prop="jtdh" label="联系电话" align="center"></el-table-column>
			<el-table-column label="性别/年龄" align="center" width="110">
				<template slot-scope="scope">
					{{scope.row.brxb}} <span v-if="scope.row.brxb && scope.row.age">/</span> {{scope.row.age}}
				</template>
			</el-table-column>
			<el-table-column prop="sourcetime" label="创建时间" align="center"></el-table-column>
			<el-table-column prop="icdName" label="疾病名称/病种" align="center" show-overflow-tooltip></el-table-column>
			<el-table-column label="标签" align="center">
				<template slot-scope="scope">
					<el-button
						@click="isdeathBtn(scope.row)"
						:type="scope.row.state === 1?'danger':'success'"
						plain
						size="mini">
						{{scope.row.state === 1?'死亡':'正常'}}
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="240" align="center">
				<template slot-scope="scope">
					<el-button
						@click="fileBtn(scope)"
						type="primary"
						size="mini">
						档案
					</el-button>
					<el-button
						@click="resetMobile(scope)"
						type="warning"
						size="mini">
						修改手机号
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		 <div class="pagination-container" style="text-align:right;margin-top:15px;">
				<el-pagination style="display:inline-block" background  @current-change="handleCurrentChange" :current-page="currentPage"  :page-size="10" layout="total,  prev, pager, next, jumper" :total="totalPage">
				</el-pagination>
			</div>
		<!-- 添加患者 -->
		<add-list :elDialog="showDialog" v-on:closeDialogFun="closeDialogFun"></add-list>
		<!-- 患者档案 -->
		<hz-file
			ref="hzFileRef">
		</hz-file>
		<!-- 修改患者死亡、正常标签 -->
		<el-dialog title="修改标签" :visible.sync="updateIsLiveDg" width="500px" custom-class="updateIsLiveDg">
			<div class="neirong">
				<el-radio-group v-model="updateIsLiveRadio">
					<el-radio :label="0">正常</el-radio>
					<el-radio :label="1">死亡</el-radio>
				</el-radio-group>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="updateIsLiveBtn">确 定</el-button>
				<el-button @click="updateIsLiveDg = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 修改手机号 -->
		<el-dialog title="修改手机号" :visible.sync="resetMobileDg" width="500px" custom-class="updateIsLiveDg">
			<el-row class="resetRow">
				<el-col :span="5">原手机号：</el-col>
				<el-col :span="19">{{oldMobile}}</el-col>
				<el-col :span="5">新手机号：</el-col>
				<el-col :span="19"><el-input v-model="newMobile" placeholder="请输入手机号"></el-input></el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="resetMobileDgBtn">确 定</el-button>
				<el-button @click="resetMobileDg = false">取 消</el-button>
			</span>
		</el-dialog>
		<!-- 修改手机号是否有随访计划执行 -->
		<el-dialog title="提示" :visible.sync="mobileDg" width="900px" custom-class="updateIsLiveDg">
			<el-row class="resetRow">
				<el-col :span="5">
					<img src="../../../assets/images/animal.png" alt="认识医生">
				</el-col>
				<el-col :span="19">
					您修改的手机号<span class="red"> {{newMobile}}</span>  有其他计划正在执行<br/>
					请问您是否需要终止其他计划，或者放弃修改号码
				</el-col>
			</el-row>
			<el-table :data="mobileDate" border height="320">
				<el-table-column	type="index"	width="50" label="序号" align="center">
				</el-table-column>
				<el-table-column label="姓名" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.brxm}}</span>
						<el-tag type="success" v-if="scope.row.hzxxId == patientId">本人</el-tag>
					</template>
				</el-table-column>
				<el-table-column property="mobile" label="当前联系电话" width="140" align="center"></el-table-column>
				<el-table-column property="icdName" label="疾病类型" align="center"></el-table-column>
				<el-table-column property="schemeName" label="方案名称" align="center"></el-table-column>
				<el-table-column label="操作" width="100" align="center">
					<template slot-scope="scope">
						<el-button
							@click="cancelAllBtn(scope)"
							:type="scope.row.buttonType"
							:disabled="scope.row.buttonDisabled"
							size="mini">
							{{scope.row.buttonText}}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="mobileDgBtn">确定修改</el-button>
				<el-button @click="mobileCloseDgBtn">放弃修改</el-button>
			</span>
		</el-dialog>
		<!-- 终止计划 -->
		<cancel-all
			:cancelDialog="cancelDialog"
			:rowData="rowData"
			@closeCancelDialog="closeCancelDialog">
		</cancel-all>
	</div>
</template>

<script>
	import { hzList } from 'RJZL_API/patientList';
	import { commonUrl } from 'RJZL_API/commonUrl';
	import AddList from './addList';
	import HzFile from 'components/Dialog/hzFile/hzFile';
	import CancelAll from 'components/Dialog/cancelAll/cancelAll';
	export default {
  name: 'hzList',
	  data() {
	    return {
	      formInline: {
	        adminId: sessionStorage.getItem('userId'),
	        name: '', // 查询姓名
	        mobile: '', // 查询手机号
	        sex: '', // 查询性别
	        icdName: '', // 查询姓名
	        startAge: '', // 查询年龄
	        endAge: '', // 查询年龄
	        isdeath: '0',
	        pager: 1,
        limit: '10'
	      },
	      options4: [],
	      tableData: [],
	      loading: false, // table loading
	      currentPage: 1,
	      totalPage: null,
	      showDialog: false, // 单个添加患者弹框
	      hzDialog: false, // 患者就诊档案弹框
	      queryLoading: false, // 助记码loading
	      diseaseDg: false, // 疾病检索弹框
	      errorNumber: null, // 未完善的数量
	      updateIsLiveDg: false, // 病人死亡标签
	      updateIsLiveRadio: '', // 死亡状态 1死亡。0正常
	      resetMobileDg: false, // 修改手机号
	      oldMobile: '', // 旧手机号
	      newMobile: '', // 新手机号
	      patientId: '', // 患者id
	      mobileDg: false, // 手机号随访计划提示弹框
	      mobileDate: [], // 手机号随访计划提示弹框data
	      cancelDialog: false, // 终止计划弹框
	      rowData: {}, // 终止随访详情患者row.data
	      faStatue: '终止方案', // 终止方案/已终止
	      rowIndex: '' // 修改手机号表格row 的index
	    };
	  },
	  components: {
	    AddList,
	    HzFile,
	    CancelAll
	  },
	  mounted() {
	    this.list();
	  },
	  created() {
	    this.failList();
	  },
	  methods: {
    /** 疾病搜索 */
	    remoteMethod(query) {
      if (query !== '') {
        this.queryLoading = true;
        setTimeout(() => {
	          this.queryLoading = false;
          commonUrl.getdiseasefix({
            'jbmc': query
          }).then((res) => {
            if (res.code == 0) {
              	this.options4 = res.data.map(item => {
              		return { label: item.jbmc, value: item.jbmc };
              	});
            } else {
	              this.options4 = [];
	            }
          }).catch((error) => {});
        }, 200);
      } else {
        this.options4 = [];
      }
    },

    /**
      * 全部列表
      * @function list
      */
    list() {
	      this.formInline.pager = this.currentPage;
      this.loading = true;
      hzList.list(this.formInline).then((res) => {
        this.loading = false;
        if (res.code == 0) {
	          res.data.forEach(item => {
	            item.icdName = item.diseaseName;
	            item.mobile = item.jtdh;
	          });
          this.tableData = res.data;
	          if (this.currentPage == 1) {
	            this.totalPage = res.count;
	          }
        }
      }).catch((error) => {
	        this.loading = false;
        console.log(error);
      });
	    },
	    /** 未完善信息 */
	    failList() {
	      hzList.OncologyTempList(this.formInline).then((res) => {
        if (res.code == 0) {
	          this.errorNumber = res.count;
        }
      }).catch((error) => {
        	console.log(error);
      });
	    },
	    /**
			 * [searchBtn description] 查询
			 * @return {[type]} [description]
			 */
	    searchBtn() {
	      this.currentPage = 1;
	      this.list();
	    },
	    // 分页
	    handleCurrentChange(val) {
	      this.currentPage = val;
	      this.list();
    },
	    /**
			 * [fileBtn description]
			 * @description 点击档案，弹框显示，传递vuex
			 * @DateTime    2018-04-18
			 */
	    fileBtn(scope) {
	      this.$refs.hzFileRef.hzDialog = true;
	      this.$store.dispatch('getScopeRowData', scope);
	      this.$store.dispatch('getCareStatus', scope.row.hzxxId);
	    },
	    /**
			 * 修改手机号弹框
			 */
	    resetMobile(scope) {
			  this.newMobile = '';
				this.patientId = '';
	      this.resetMobileDg = true;
	      this.oldMobile = scope.row.jtdh;
	      this.patientId = scope.row.hzxxId;
	    },
	    /**
			 * 修改手机号确定按钮
			 */
	    resetMobileDgBtn() {
	      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	      if (myreg.test(this.newMobile)) {
	        this.isfollowPlan();
	      } else {
	        this.$message.error('手机号格式不正确！');
	      }
	    },
	    /**
			 * 判断当前手机号是否有随访计划
			 */
	    isfollowPlan() {
	      hzList.getTaskByHzxxIdAndPhone({
	        oldPhone: this.oldMobile,
        newPhone: this.newMobile,
        patientId: this.patientId
	      }).then(res => {
	        if (res.code === 0) {
	          if (res.data.length) {
	            this.mobileDg = true;
	            // 增加按钮的文字和样式
	            res.data.forEach(item => {
	              Object.assign(item, {
	                buttonText: '终止方案',
	                buttonType: 'primary',
	                buttonDisabled: false
	              });
	              if (item.status === 4) {
	                item.buttonText = '已终止';
	                item.buttonType = 'danger';
	                item.buttonDisabled = true;
	              }
	            });
	            this.mobileDate = res.data;
	          } else {
	            this.resetMobileFun();
	          }
	        } else {
	          this.$message.error(res.message);
	        }
	      }).catch((error) => {
        	this.$message.error(error.message);
      });
	    },
	    /**
			 * 确定修改（修改的手机号已有随访计划执行）
			 */
	    mobileDgBtn() {
	      this.resetMobileFun();
	    },
	    /**
			 * 放弃修改
			 */
	    mobileCloseDgBtn() {
	      this.mobileDg = false;
	      this.resetMobileDg = false;
	    },
	    /**
			 * 修改手机号 function
			 */
	    resetMobileFun() {
	      hzList.upDateHzxxMobile({
	        patientId: this.patientId,
	        oldPhone: this.oldMobile,
	        newPhone: this.newMobile
	      }).then(res => {
	        console.log(res.code);
	        this.mobileDg = false;
	        this.resetMobileDg = false;
	        if (res.code === 0) {
	          this.$message.success(res.message);
	          this.resetMobileDg = false;
	          this.list();
	        } else {
	          this.$message.error(res.message);
	        }
	      }).catch((error) => {
        	this.$message.error(error.message);
      });
	    },
	    /**
			 * 终止随访计划按钮
			 */
	    cancelAllBtn(scope) {
	      this.cancelDialog = true;
	      this.rowData = scope.row;
	      // row  index
	      this.rowIndex = '';
	      this.rowIndex = scope.$index;
	    },
	    /** 监听终止随访计划弹框关闭 */
	    closeCancelDialog(val) {
	      this.cancelDialog = val.close;
	      // response = true表示终止成功
	      if (val.response) {
	        this.mobileDate[this.rowIndex].buttonText = '已终止';
	        this.mobileDate[this.rowIndex].buttonType = 'danger';
	        this.mobileDate[this.rowIndex].buttonDisabled = true;
	        // isDeath = true表示终止原因为患者已死亡，此时需妖调用接口传值该患者已死亡
	        if (val.isDeath) {
	          this.hzxxId = this.rowData.hzxxId;
	          this.updateIsLiveRadio = 1;
	          this.updateIsLiveFun(val);
	        }
	      }
	    },
	    /**
			 * 修改患者标签 -- 死亡/正常
			 */
	    isdeathBtn(rows) {
	      this.updateIsLiveDg = true;
	      this.hzxxId = rows.hzxxId;
	      this.updateIsLiveRadio = rows.state;
	    },
	    /**
			 * 修改死亡标签
			 */
	    updateIsLiveBtn() {
	      if (this.updateIsLiveRadio === 1) {
	        this.$confirm('标记死亡后该患者的所有随访计划将终止, 确定标记该患者死亡?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          confirmButtonClass: 'operationBtn',
	          cancelButtonClass: 'operationBtn',
	          type: 'warning'
	        }).then(() => {
	          this.updateIsLiveFun();
	        });
	      } else {
	        this.updateIsLiveFun();
	      }
	    },
	    updateIsLiveFun(param) {
	      let paramNotPassReason;
	      let paramNotPassRemark;
	      if (param) {
	        paramNotPassReason = param.notPassReason;
	        paramNotPassRemark = param.notPassRemark;
	      }
	      hzList.updateIsLive({
        'hzxxId': this.hzxxId,
	        'isDed': this.updateIsLiveRadio,
	        'notPassReason': paramNotPassReason,
	        'notPassRemark': paramNotPassRemark
      }).then((res) => {
        if (res.code == 0) {
	          this.updateIsLiveDg = false;
	          this.list(this.currentPage);
	          this.$message.success(res.message);
	          if (param) {
	            console.log('test,  刷新列表');
	            this.isfollowPlan();
	          }
        }
      }).catch((error) => {
	        console.log(error);
      });
	    },
	    // 添加患者
	    addListBtn() {
	      this.showDialog = true;
	    },
	    // 关闭弹框
	    closeDialogFun(value) {
	      this.showDialog = value.close;
	      if (value.success) {
	        this.list(this.currentPage);
	      }
    },
    /** 路由跳转-批量添加 */
	    addPlBtn() {
	      this.$router.push({ path: '/UploadHz' });
    },
    /** 路由跳转-未完善信息 */
	    halfBtn() {
	      this.$router.push({ path: '/HalfInfo' });
	    }
	  },
	  watch: {
	    /** 当路由变化时，刷新未完善的列表和患者信息列表 */
	    '$route'(newV, oldV) {
	      if (newV.path != oldV.path) {
	        this.failList();
	        this.list(this.currentPage);
	      }
	    }
	  }
	};
</script>

<style lang="scss">
@import '~styles/search';

// 修改患者标签状态
.updateIsLiveDg {
	.el-dialog__body {
		padding: 30px 20px;
		border-top: 1px solid #e4e4e4;
		border-bottom: 1px solid #e4e4e4;
		.resetRow {
			.el-col {
				line-height: 40px;
				.el-input {
					width: 80%;
					.el-input__inner {
						height: 35px;
						line-height: 35px;
					}
				}
			}
		}
		.el-table {
			margin-top: 20px;
		}
	}
	.el-dialog__footer {
		text-align: center;
		padding: 20px;
		.el-button {
			padding: 8px 20px;
		}
	}
}
.red {
	color: #f00;
}
</style>
