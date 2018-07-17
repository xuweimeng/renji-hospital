<template>
  <div class='admissionNoticeResults'>
    <!-- 查询 -->
		<el-row class='common-search'>
			<el-form :inline='true' :model='searchParams' label-position="center" label-width="80px">
			  <el-col :span='5'>
			  	<el-form-item label='患者姓名'>
				    <el-input v-model='searchParams.brxm' placeholder='请输入患者姓名' clearable ></el-input>
				  </el-form-item>
				</el-col>
        <el-col :span='4'>
			  	<el-form-item label='患者性别'>
				    <el-select v-model='searchParams.brxb' placeholder='性别'>
				      <el-option label='全部' value=''></el-option>
				      <el-option label='男' value='男'></el-option>
				      <el-option label='女' value='女'></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
				<el-col :span='5'>
			  	<el-form-item label='联系电话'>
				    <el-input v-model='searchParams.mobile' placeholder='请输入患者联系电话' clearable ></el-input>
				  </el-form-item>
				</el-col>
				<el-col :span='5'>
          <el-form-item label='疾病名称'>
            <el-select
              v-model='searchParams.icdName'
              filterable
              clearable
              remote
              reserve-keyword
              placeholder='请输入疾病名称'
              :remote-method='remoteMethod'
              :loading='queryLoading'>
              <el-option
                v-for='item in diseaseList'
                :key='item.id'
                :label='item.value'
                :value='item.value'>
              </el-option>
            </el-select>
          </el-form-item>
				</el-col>
        <el-col :span='5'>
			  	<el-form-item label='患者年龄'>
				  	<el-row>
				  		<el-col :span='11'><el-input v-model='searchParams.beginAge' placeholder='0'></el-input></el-col>
				  		<el-col :span='2' style='text-align: center;'>-</el-col>
				  		<el-col :span='11'><el-input v-model='searchParams.endAge'></el-input></el-col>
				  	</el-row>
			  	</el-form-item>
			  </el-col>
				<el-col :span='9'>
					<el-form-item label='通知时间'>
						<el-date-picker  @change='timeChange'
						 v-model='createTime'
							type='datetimerange'
							value-format='yyyy-MM-dd HH:mm:ss'
							range-separator='至'
							start-placeholder='开始日期'
							end-placeholder='结束日期'
              :picker-options='pickerTime'>
						</el-date-picker>
					</el-form-item>
				</el-col>
        <el-col :span='4'>
          <el-form-item label='通话状态'>
            <el-select v-model='searchParams.backStatus' placeholder='通话状态'>
              <el-option label='全部' value=''></el-option>
              <el-option label='呼叫失败' value='1'></el-option>
              <el-option label='正常通话' value='2'></el-option>
              <el-option label='通话中' value='3'></el-option>
              <el-option label='关停机' value='4'></el-option>
              <el-option label='无人接听' value='5'></el-option>
              <el-option label='空号' value='6'></el-option>
              <el-option label='号码有误' value='7'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
				<el-col :span='4'>
					<el-form-item label='是否本人'>
						<el-select v-model='searchParams.isMySelf' placeholder='是否是本人'>
							<el-option label='全部' value=''></el-option>
							<el-option label='是' value='1'></el-option>
							<el-option label='否' value='0'></el-option>
						</el-select>
					</el-form-item>
				</el-col>
        <el-col :span='4'>
			  	<el-form-item label='是否入院'>
				    <el-select v-model='searchParams.isCome' placeholder='是否来住院'>
				      <el-option label='全部' value=''></el-option>
				      <el-option label='不来' value='0'></el-option>
				      <el-option label='来' value='1'></el-option>
				    </el-select>
				  </el-form-item>
				</el-col>
			  <el-col :span='3'>
			  	<el-button type='primary' @click='getData'>查询</el-button>
			  </el-col>
			</el-form>
		</el-row>
    <!-- 表格 -->
		<el-row class='common-table'>
			<el-col :span='24'>
	    	<el-table :data='tableData' border style='width: 100%;' v-loading='dataLoading'>
	    		<el-table-column prop='brxm' label='姓名' align='center'></el-table-column>
	    		<el-table-column prop='mobile' label='联系电话' align='center' show-overflow-tooltip ></el-table-column>
	    		<el-table-column label='性别/年龄' align='center' width='100'>
            <template slot-scope='scope'>
              {{scope.row.brxb}} <span v-if='scope.row.brxb && scope.row.age'>/</span> {{scope.row.age}}
            </template>
          </el-table-column>
          <el-table-column prop='backStatusStr' label='通话状态' align='center'></el-table-column>
	    		<el-table-column prop='icdName' label='疾病名称' align='center' show-overflow-tooltip></el-table-column>
	    		<el-table-column prop='dateBegin' label='通知时间' align='center' show-overflow-tooltip ></el-table-column>
	    		<el-table-column prop='vetRemark' label='通知结果' align='center'></el-table-column>
	    		<el-table-column prop='resultStatusStr' label='采集状态' align='center'></el-table-column>
	    		<el-table-column  label='是否本人' align='center'>
						<template slot-scope='scope'>
							{{ scope.row.isMySelf==0?'否':scope.row.isMySelf==1?'是':'' }}
						</template>
					</el-table-column>
	    		<el-table-column prop='isCome' label='是否入院' align='center'>
						<template slot-scope='scope'>
							{{ scope.row.isCome==0?'不来':scope.row.isCome==1?'来':scope.row.isCome==2?'改约':'' }}
						</template>
					</el-table-column>
          	<el-table-column label='详情' align='center'>
              <template slot-scope='scope'>
                <el-button type='primary' size='mini' @click='detailBtn(scope)'>详情</el-button>
              </template>
            </el-table-column>
	    	</el-table>

        <div class='block' style='margin: 30px 50px;text-align: right;'>
          <el-pagination  @current-change='handleCurrentChange' :current-page.sync='searchParams.pager' :page-size='10' layout='total,prev, pager, next, jumper'
            :total='totalPage' v-if='totalPage'>
          </el-pagination>
        </div>

			</el-col>
		</el-row>
		<!-- 审核不通过 -->
		<el-dialog title='审核不通过原因' :visible.sync='noCheck' width='350px' :center = 'false' custom-class='checknoPass'>
			<el-row slot>
				 <el-col :span='24' >
					<el-select v-model='selectCheck' placeholder='请选择' @change='changeSelect' popper-class='selectOut'>
						<el-option  v-for='item in checkoptions' :key='item.value' :label='item.label' :value='item.value'></el-option>
					</el-select>
				</el-col>
				<el-col
					:span='24'
					class='btnCheck'
					style='margin-top:28px;'
					@click.native='noothroughCkeck'>
					<el-button type='primary'>确定</el-button>
					<el-button type='info' @click='noCheck=false'>取消</el-button>
				</el-col>
			</el-row>
		</el-dialog>
    <!-- 详情 -->
    <ad-result :resultDg='resultDg'
		@closeChildren='closeChildren'></ad-result>
  </div>
</template>
<script>
  import { AdmissionNotice } from 'RJZL_API/hospitalNotice';
  import { commonUrl } from 'RJZL_API/commonUrl';
  import AdResult from '@/components/dialog/aDresult/ppResult';
  export default {
    name: 'admissionNoticeResults',
    data() {
      return {
        createTime: [] /* 创建时间 */,
        currentPage1: 1, // 当前页
        totalPage: null, // 总页数
        /* 搜索条件 */
        searchParams: {
          adminId: sessionStorage.getItem('userId'),
          pager: 1, //当前页码
          limit: 10, //每页条数
          brxm: '', //患者姓名（可选）
          dateBeginBegin: null, //生成开始时间（可选）
          dateBeginEnd: null, //生成结束时间（可选）
          beginAge: null, //开始年龄（可选）
          endAge: null, //结束年龄（可选）
          brxb: '', //性别（可选）
          activeType: 4, //0，随访；1，通知，2，临时随访；3，是出院随访;4入院通知；5体检
          mobile: null, //联系方式
          backStatus:'',//通话状态
          icdName: null, //疾病名称
          isMySelf: '', //是否本人（1：是，0：否）
          isCome: '' //是否过来入院（0：不来，1：来，2：改约）
        },
        input10: '',
        activeName: 'first', // tab
        tableData: [],
        dataLoading: false, // 表格数据请求等待
        checkoptions: [
          {
            value: '',
            label: '请选择'
          },
          {
            //审核不通过options
            value: '1',
            label: '患者已死亡'
          },
          {
            value: '2',
            label: '患者不接受随访'
          },
          {
            value: '3',
            label: '随访方案重复'
          },
          {
            value: '4',
            label: '方案不匹配'
          }
        ],
        selectCheck: '', // 选中的审核不通过
        checkId: [], // 随访通过的id(多选时),
        noCheck: false, // 审核不通过弹框
        queryLoading: false, // 搜索loading...
        diseaseList: [], // 疾病list
        resultDg: false, // 详情弹窗
        pickerTime: {
          shortcuts: [
            {
              text: '最近七天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600*1000*24*7)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600*1000*24*30)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600*1000*24*90)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      };
    },
    components: {
      AdResult
    },
    mounted() {
      this.getData();
      this.getCurrent();
    },
    methods: {
      getCurrent() {
        const current = new Date();
        const currentYear = current.getUTCFullYear();
        const currentMonth = current.getMonth() + 1;
        const startDate = current.getDate();
        const currentTime1 = currentYear + '-' + currentMonth + '-' + startDate + ' ' + '00:00:00';
        const currentTime2 = currentYear + '-' + currentMonth + '-' + startDate + ' ' + '23:59:59';
        this.searchParams.dateBeginBegin = currentTime1;
        this.searchParams.dateBeginEnd = currentTime2;
        this.createTime.push(currentTime1);
        this.createTime.push(currentTime2);
      },
      /** 疾病远程搜索 */
      remoteMethod(query) {
        if (query !== '') {
          this.queryLoading = true;
          setTimeout(() => {
            commonUrl.autocomplete({
              'zjm': query
            }).then((res)=>{
              this.queryLoading = false;
              console.log(res)
              if(res.code == 0) {
                this.diseaseList = res.data
              } else {
                this.options4 = [];
              }
            }).catch((error)=>{
              console.log(error)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      /** @description
       * 创建时间更改
       */
      timeChange(time) {
        if (time) {
          this.searchParams.dateBeginBegin = time[0] + ' ' + '00:00:00';
          this.searchParams.dateBeginEnd = time[1] + ' ' + '23:59:59';
        } else {
          this.searchParams.dateBeginBegin = '';
          this.searchParams.dateBeginEnd = '';
        }
      },
      /* 获取数据 */
      getData() {
        this.dataLoading = true;
        AdmissionNotice.resultList(this.searchParams).then(res => {
          this.dataLoading = false;
          this.tableData = res.data;
          this.totalPage = res.total;
        });
      },
      /**
       *审核不通过的原因
      *@function changeSelect
      *@param {String} value 审核不通过的原因
      */
      changeSelect(value) {
        this.selectCheck = value;
      },
      /**
       * 分页
       * @function handleCurrentChange
       * @param {String} val 当前页码
       * @description this.tabActive = 0//全部患者=1特别关心
       */
      handleCurrentChange(page) {
        this.dataLoading = true;
        this.searchParams.pager = page;
        this.getData();
      },
      /** 详情 */
      detailBtn(scope) {
        this.resultDg = true;
        this.$store.dispatch('getScopeRowData', scope);
      },
      /** 监听弹窗子组件的关闭动作 */
      closeChildren(val) {
        this.resultDg = val;
      }
    }
  };

</script>
<style lang='scss'>
  @import '~styles/search';
  .admissionNoticeResults {
  }
</style>