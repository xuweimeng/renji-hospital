<template>
	<el-dialog
		title="完善疾病名称"
		width="525px"
		height="600px"
		:visible.sync="dialogFormVisible"
		:modal-append-to-body="false"
		custom-class="diseaseDg"
		:before-close="closeDialog">
		<el-row>
			<el-col :span="20">
				<el-select
			    v-model="icdName"
			    filterable
			    remote
			    placeholder="请输入关键词"
			    :remote-method="remoteMethod"
			    @change="selectChange"
			    :loading="loading4">
			    <el-option
			      v-for="(item, index) in options4"
			      :key="index"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="savejb">保存</el-button>
			</el-col>
		</el-row>
	</el-dialog>
</template>

<script>
import { hzList } from 'RJZL_API/patientList'
import { commonUrl } from 'RJZL_API/commonUrl'
	export default {
		data () {
			return {
				icd: '',
				icdName: '', // 疾病名称
				options4: [], // select option
				loading4: false,
				dialogFormVisible: false
			}
		},
		props: [
		'diseaseDg',
		'hzid'
		],

		methods: {
			remoteMethod(query) {
        if (query !== '') {
          this.loading4 = true;
          this.options4 = [];
          setTimeout(() => {
            commonUrl.getdiseasefix({
              'jbmc': query
            }).then((res)=>{
							this.loading4 = false;
            	console.log(res)
              if(res.code == 0) {
              	this.options4=res.data.map(item => {
              		return {label: item.jbmc,value: item.icd10}
              	})
              } else {
								this.options4 = [];
							}
            }).catch((error)=>{
							this.loading4 = false;
              console.log(error)
            })
          }, 200);
        } else {
          this.options4 = [];
        }
      },
      /**
       * [savejb description]
       * @description  修改完善疾病名称
       * @DateTime    2018-04-20
       * @param       {{id}} 用户id
       * @param       {{icd}} 疾病的icd
       * @param       {{icdName}} 疾病名称
       */
      savejb () {
				hzList.updateOncology({
					'id': this.hzid, // 用户id
					'icdName': this.icd,
					'icd': this.icdName
				}).then((res)=>{
					console.log(res)
					if(res.code == 0) {
						this.$emit('closeDialogFun', false)
						this.$emit('saveIcdName', this.icd)
						this.options4.length = 0
						this.icdName = ''
						this.icd = ''
					}
				}).catch((error)=>{
					console.log(error)
				})
      },
      /**
       * 获取选择的label
       */
      selectChange (value) {
        let obj = this.options4.find((item)=> {
          return item.value === value
        })
        this.icd = obj.label
        console.log(obj);
      },
      /*
       * 关闭弹框
       */
      closeDialog () {
      	this.$emit('closeDialogFun', false)
      }
		},
		watch: {
      diseaseDg(old, new3) {
        this.dialogFormVisible = this.diseaseDg
      }
    }
	}
</script>

<style lang="scss">
	.diseaseDg {
		min-height: 200px;
		.el-select {
			width: 90%;
		}
	}
</style>