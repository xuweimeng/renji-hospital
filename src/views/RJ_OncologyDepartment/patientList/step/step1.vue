<template>
<div>
	<el-upload
	  class="upload-demo"
	  ref="uploademo"
	  drag
	  name="upfile"
		:action="upload.patientUrl"
	  :data="{adminId:sendData.adminId}"
	  :before-upload="beforeUpload"
	  :on-success="onSuccess"
	  :on-error="onError">
	  <i class="el-icon-upload"></i>
	  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
	  <div class="el-upload__tip" slot="tip"><a href="/assets/templatedoc/cologyTemp.xls">下载Excel模板</a></div>
	</el-upload>
	</div>
</template>

<script>
	import { upload } from 'RJZL_API/patientList'
	export default {
		data () {
			return {
				upload: upload,
				sendData: {
					adminId: sessionStorage.getItem('userId'), // userid
				},
			}
		},
		methods: {
			/** @description */
			beforeUpload (file) {
				console.log(this.$refs.uploademo.data)
				const extension = file.name.split('.')[1] === 'xls'
				const extension1 = file.name.split('.')[1] === 'xlsx'
				if (!extension && !extension1) {
					this.$message.error('上传格式只能为xls或者xlsx!')
				}
			},
			/**
			 * [onSuccess description]
			 * @description 上传成功
			 * @DateTime    2018-04-19
			 */
			onSuccess (response) {
				response = JSON.parse(response)
				if (response.code == 3) {
					this.$message.error(response.message)
				} else {
					this.$message.success(response.message)
					console.log('response', response);

					this.$store.dispatch('uploadNum', response)
					this.$emit('stepFun', 1)
				}
			},
			/**
			 * [onError description]
			 * @description 上传失败
			 * @DateTime    2018-04-19
			 */
			onError (response) {
				this.$message.error(JSON.parse(response.message))
			}
		}
	}
</script>

<style lang="scss">
	.upload-demo {
			position: absolute;
      top: 20%;
			left: 50%;
      transform: translateY(-50%);
      transform: translateX(-50%);
			.el-upload__tip {
				text-align: center;
				color: #409EFF;
				font-size: 15px;
				a {
					color: #666;
					&:hover {
						color: #409EFF;
					}
				}
			}
		}
</style>